const API_BASE_URL = 'https://api.onestepmedi.com:8000';

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, password }); // Log input
    const response = await fetch(`${API_BASE_URL}/patient/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status); // Log status
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Full API response:', data); // Log entire response

    // Try common token keys
    const token = data.token || data.accessToken || data.jwt || data.access_token || data.authToken;
    if (!token) {
      console.warn('No token found. Response keys:', Object.keys(data));
      throw new Error('Token not found in API response');
    }

    // Attempt to store token
    try {
      // Check if localStorage is available
      if (isStorageAvailable('localStorage')) {
        localStorage.setItem('authToken', token);
        console.log('Stored in localStorage:', localStorage.getItem('authToken'));
      } else {
        console.warn('localStorage unavailable, trying sessionStorage');
        if (isStorageAvailable('sessionStorage')) {
          sessionStorage.setItem('authToken', token);
          console.log('Stored in sessionStorage:', sessionStorage.getItem('authToken'));
        } else {
          console.error('Both localStorage and sessionStorage are unavailable');
          throw new Error('Storage unavailable');
        }
      }
    } catch (storageError) {
      console.error('Storage error:', storageError);
      throw new Error('Failed to store token');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Helper function to check storage availability
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    console.warn(`${type} test failed:`, e.message);
    return false;
  }
}

// Helper function to get the stored token
export const getAuthToken = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  console.log('Retrieved token:', token);
  return token;
};