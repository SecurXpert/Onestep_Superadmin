// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';

// const AddPortfolio = () => {
//   const [formData, setFormData] = useState({
//     doctor_id: '',
//     name: '',
//     specialization: '',
//     experience_yrs: '',
//     quote: '',
//     hospital: '',
//     total_patients: '',
//     status: true,
//     profile_img_left: null as File | null,
//     profile_img_right: null as File | null,
//     label1: '',
//     label2: '',
//     label3: '',
//     about: ''
//   });
//   const [sections, setSections] = useState<{ section_type: string; image_file: File | null }[]>([{ section_type: '', image_file: null }]);
//   const [clinics, setClinics] = useState<{ address: string; city: string; latitude: string; longitude: string; image_files: (File | null)[] }[]>([{ address: '', city: '', latitude: '', longitude: '', image_files: [null, null] }]);
//   const [expertise, setExpertise] = useState<{ image_file: File | null; description: string }[]>([]);
//   const [reviews, setReviews] = useState<{ patient_name: string; description: string; rating: number }[]>([]);
//   const [videos, setVideos] = useState<{ video_url: string }[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string | null>(null);
//   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
//   const navigate = useNavigate();

//   const API_BASE_URL = 'https://api.onestepmedi.com:8000';

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked, files } = e.target as HTMLInputElement;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'file' ? files ? files[0] : null : type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSectionChange = (index: number, field: string, value: any) => {
//     const updatedSections = [...sections];
//     updatedSections[index] = { ...updatedSections[index], [field]: field === 'image_file' ? value[0] : value };
//     setSections(updatedSections);
//   };

//   const handleClinicChange = (index: number, field: string, value: any, imgIndex: number = 0) => {
//     const updatedClinics = [...clinics];
//     if (field === 'image_files') {
//       const newImageFiles = [...updatedClinics[index].image_files];
//       newImageFiles[imgIndex] = value[0] || null;
//       updatedClinics[index] = { ...updatedClinics[index], image_files: newImageFiles };
//     } else {
//       updatedClinics[index] = { ...updatedClinics[index], [field]: value };
//     }
//     setClinics(updatedClinics);
//   };

//   const handleExpertiseChange = (index: number, field: string, value: any) => {
//     const updatedExpertise = [...expertise];
//     updatedExpertise[index] = { ...updatedExpertise[index], [field]: field === 'image_file' ? value[0] : value };
//     setExpertise(updatedExpertise);
//   };

//   const handleReviewChange = (index: number, field: string, value: any) => {
//     const updatedReviews = [...reviews];
//     updatedReviews[index] = { ...updatedReviews[index], [field]: field === 'rating' ? Number(value) : value };
//     setReviews(updatedReviews);
//   };

//   const handleVideoChange = (index: number, field: string, value: any) => {
//     const updatedVideos = [...videos];
//     updatedVideos[index] = { ...updatedVideos[index], [field]: value };
//     setVideos(updatedVideos);
//   };

//   const addSection = async () => {
//     setSections([...sections, { section_type: '', image_file: null }]);
//     setDebugInfo('Added new section');
//     await handleSaveSections();
//   };

//   const addClinic = () => {
//     setClinics([...clinics, { address: '', city: '', latitude: '', longitude: '', image_files: [null, null] }]);
//     setDebugInfo('Added new clinic');
//   };

//   const addExpertise = () => {
//     setExpertise([...expertise, { image_file: null, description: '' }]);
//     setDebugInfo('Added new expertise');
//   };

//   const addReview = () => {
//     setReviews([...reviews, { patient_name: '', description: '', rating: 0 }]);
//     setDebugInfo('Added new review');
//   };

//   const addVideo = () => {
//     setVideos([...videos, { video_url: '' }]);
//     setDebugInfo('Added new video');
//   };

//   const handleSaveDoctor = async () => {
//     if (!formData.doctor_id || !formData.name || !formData.specialization) {
//       setError('Doctor ID, Name, and Specialization are required.');
//       setDebugInfo('Validation failed: Missing required fields');
//       return false;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const queryParams = new URLSearchParams({
//         doctor_id: formData.doctor_id,
//         name: formData.name,
//         specialization: formData.specialization,
//         experience_years: formData.experience_yrs,
//         quote: formData.quote,
//         hospital: formData.hospital,
//         total_patients: formData.total_patients,
//         status: formData.status.toString(),
//         label1: formData.label1,
//         label2: formData.label2,
//         label3: formData.label3,
//         about: formData.about
//       }).toString();

//       const formDataToSend = new FormData();
//       if (formData.profile_img_left) {
//         formDataToSend.append('profile_img_left', formData.profile_img_left);
//       }
//       if (formData.profile_img_right) {
//         formDataToSend.append('profile_img_right', formData.profile_img_right);
//       }

//       const response = await fetch(`${API_BASE_URL}/doctors/create?${queryParams}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to create doctor portfolio");
//       }

//       const newDoctor = await response.json();
//       setFormData((prev) => ({ ...prev, doctor_id: newDoctor.doctor_id }));
//       setError(null);
//       setDebugInfo(`Successfully created doctor ${newDoctor.doctor_id}`);
//       setIsConfirmDialogOpen(true);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving doctor:', error);
//       setError(`Failed to save doctor: ${error.message}. Please ensure the backend accepts query parameters and multipart/form-data.`);
//       setDebugInfo(`Save doctor failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSaveSections = async () => {
//     if (!formData.doctor_id) {
//       setError('Please save doctor details first.');
//       setDebugInfo('Validation failed: Missing doctor_id');
//       return false;
//     }
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       sections.forEach((section) => {
//         formDataToSend.append(`section_type`, section.section_type);
//         if (section.image_file) {
//           formDataToSend.append(`images`, section.image_file);
//         }
//       });

//       const response = await fetch(`${API_BASE_URL}/doctors/sections/${formData.doctor_id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to save sections");
//       }

//       setError(null);
//       setDebugInfo(`Successfully saved sections for doctor ${formData.doctor_id}`);
//       setIsConfirmDialogOpen(true);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving sections:', error);
//       setError(`Failed to save sections: ${error.message}`);
//       setDebugInfo(`Save sections failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSaveClinics = async () => {
//     if (!formData.doctor_id) {
//       setError('Please save doctor details first.');
//       setDebugInfo('Validation failed: Missing doctor_id');
//       return false;
//     }
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       clinics.forEach((clinic) => {
//         formDataToSend.append(`address`, clinic.address);
//         formDataToSend.append(`city`, clinic.city);
//         formDataToSend.append(`latitude`, clinic.latitude);
//         formDataToSend.append(`longitude`, clinic.longitude);
//         clinic.image_files.forEach((image, idx) => {
//           if (image) formDataToSend.append(`images_${idx}`, image);
//         });
//       });

//       const response = await fetch(`${API_BASE_URL}/doctors/clinics/${formData.doctor_id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to save clinics");
//       }

//       setError(null);
//       setDebugInfo(`Successfully saved clinics for doctor ${formData.doctor_id}`);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving clinics:', error);
//       setError(`Failed to save clinics: ${error.message}`);
//       setDebugInfo(`Save clinics failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSaveExpertise = async () => {
//     if (!formData.doctor_id) {
//       setError('Please save doctor details first.');
//       setDebugInfo('Validation failed: Missing doctor_id');
//       return false;
//     }
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       expertise.forEach((exp) => {
//         formDataToSend.append(`description`, exp.description);
//         if (exp.image_file) {
//           formDataToSend.append(`images`, exp.image_file);
//         }
//       });

//       const response = await fetch(`${API_BASE_URL}/doctors/expertise/${formData.doctor_id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to save expertise");
//       }

//       setError(null);
//       setDebugInfo(`Successfully saved expertise for doctor ${formData.doctor_id}`);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving expertise:', error);
//       setError(`Failed to save expertise: ${error.message}`);
//       setDebugInfo(`Save expertise failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSaveReviews = async () => {
//     if (!formData.doctor_id) {
//       setError('Please save doctor details first.');
//       setDebugInfo('Validation failed: Missing doctor_id');
//       return false;
//     }
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       for (const review of reviews) {
//         if (review.patient_name && review.description && review.rating > 0) {
//           const response = await fetch(`${API_BASE_URL}/doctors/reviews/${formData.doctor_id}`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(review),
//           });

//           if (!response.ok) {
//             if (response.status === 401) {
//               throw new Error("Unauthorized: Invalid or expired token");
//             }
//             throw new Error("Failed to save review");
//           }
//         }
//       }

//       setError(null);
//       setDebugInfo(`Successfully saved reviews for doctor ${formData.doctor_id}`);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving reviews:', error);
//       setError(`Failed to save reviews: ${error.message}`);
//       setDebugInfo(`Save reviews failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSaveVideos = async () => {
//     if (!formData.doctor_id) {
//       setError('Please save doctor details first.');
//       setDebugInfo('Validation failed: Missing doctor_id');
//       return false;
//     }
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       for (const video of videos) {
//         if (video.video_url) {
//           const response = await fetch(`${API_BASE_URL}/doctors/videos/${formData.doctor_id}`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(video),
//           });

//           if (!response.ok) {
//             if (response.status === 401) {
//               throw new Error("Unauthorized: Invalid or expired token");
//             }
//             throw new Error("Failed to save video");
//           }
//         }
//       }

//       setError(null);
//       setDebugInfo(`Successfully saved videos for doctor ${formData.doctor_id}`);
//       return true;
//     } catch (error: any) {
//       console.error('Error saving videos:', error);
//       setError(`Failed to save videos: ${error.message}`);
//       setDebugInfo(`Save videos failed: ${error.response?.status || 'unknown'} ${error.message}`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const doctorSaved = await handleSaveDoctor();
//     if (doctorSaved) {
//       await Promise.all([
//         handleSaveSections(),
//         handleSaveClinics(),
//         handleSaveExpertise(),
//         handleSaveReviews(),
//         handleSaveVideos(),
//       ]);
//       if (!error) {
//         setIsConfirmDialogOpen(true);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <Card className="shadow-card">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//               Add Doctor Portfolio
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//                 {error}
//               </div>
//             )}
//             {debugInfo && (
//               <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
//                 Debug: {debugInfo}
//               </div>
//             )}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="doctor_id">Doctor ID *</Label>
//                   <Input
//                     id="doctor_id"
//                     name="doctor_id"
//                     value={formData.doctor_id}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g., DR201"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Name *</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g., Dr. Anil Sharma"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="specialization">Specialization *</Label>
//                   <Input
//                     id="specialization"
//                     name="specialization"
//                     value={formData.specialization}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g., Cardiologist (MBBS, MD)"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="experience_yrs">Experience (Years)</Label>
//                   <Input
//                     id="experience_yrs"
//                     name="experience_yrs"
//                     type="number"
//                     value={formData.experience_yrs}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 14"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="quote">Quote</Label>
//                   <Input
//                     id="quote"
//                     name="quote"
//                     value={formData.quote}
//                     onChange={handleInputChange}
//                     placeholder="e.g., I believe in listening to the patient's heart."
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="hospital">Hospital</Label>
//                   <Input
//                     id="hospital"
//                     name="hospital"
//                     value={formData.hospital}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Fortis Hospital, Hyderabad"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="total_patients">Total Patients</Label>
//                   <Input
//                     id="total_patients"
//                     name="total_patients"
//                     type="number"
//                     value={formData.total_patients}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 275"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="status">Status</Label>
//                   <select
//                     id="status"
//                     name="status"
//                     value={formData.status.toString()}
//                     onChange={handleInputChange}
//                     className="p-2 border rounded w-full"
//                   >
//                     <option value="true">Available</option>
//                     <option value="false">Not Available</option>
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="profile_img_left">Profile Image Left</Label>
//                   <Input
//                     id="profile_img_left"
//                     name="profile_img_left"
//                     type="file"
//                     onChange={handleInputChange}
//                     accept="image/*"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="profile_img_right">Profile Image Right</Label>
//                   <Input
//                     id="profile_img_right"
//                     name="profile_img_right"
//                     type="file"
//                     onChange={handleInputChange}
//                     accept="image/*"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="label1">Label 1</Label>
//                   <Input
//                     id="label1"
//                     name="label1"
//                     value={formData.label1}
//                     onChange={handleInputChange}
//                     placeholder="e.g., In clinic, Online"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="label2">Label 2</Label>
//                   <Input
//                     id="label2"
//                     name="label2"
//                     value={formData.label2}
//                     onChange={handleInputChange}
//                     placeholder="e.g., English, Hindi, Telugu"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="label3">Label 3</Label>
//                   <Input
//                     id="label3"
//                     name="label3"
//                     value={formData.label3}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 97% Recommends"
//                   />
//                 </div>
//                 <div className="space-y-2 col-span-2">
//                   <Label htmlFor="about">About</Label>
//                   <textarea
//                     id="about"
//                     name="about"
//                     value={formData.about}
//                     onChange={handleInputChange}
//                     className="p-2 border rounded w-full"
//                     rows={4}
//                     placeholder="Enter doctor's bio..."
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Button type="button" onClick={handleSaveDoctor} className="bg-green-500 hover:bg-green-600">
//                     <FaSave className="mr-2" /> Save Doctor Details
//                   </Button>
//                 </div>
//               </div>

//               {/* Sections */}
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">Sections</h3>
//                   <Button type="button" onClick={addSection} className="bg-blue-500 hover:bg-blue-600">
//                     <FaPlus className="mr-2" /> Add Section
//                   </Button>
//                 </div>
//                 {sections.map((section, index) => (
//                   <div key={index} className="flex gap-4 mb-4">
//                     <div className="space-y-2 flex-1">
//                       <Label htmlFor={`section_type_${index}`}>Section Type</Label>
//                       <Input
//                         id={`section_type_${index}`}
//                         value={section.section_type}
//                         onChange={(e) => handleSectionChange(index, 'section_type', e.target.value)}
//                         placeholder="e.g., Experience"
//                       />
//                     </div>
//                     <div className="space-y-2 flex-1">
//                       <Label htmlFor={`section_image_${index}`}>Image (Optional)</Label>
//                       <Input
//                         id={`section_image_${index}`}
//                         type="file"
//                         onChange={(e) => handleSectionChange(index, 'image_file', e.target.files)}
//                         accept="image/*"
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <Button type="button" onClick={handleSaveSections} className="bg-green-500 hover:bg-green-600">
//                   <FaSave className="mr-2" /> Save Sections
//                 </Button>
//               </div>

//               {/* Clinics */}
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">Clinics</h3>
//                   <Button type="button" onClick={addClinic} className="bg-blue-500 hover:bg-blue-600">
//                     <FaPlus className="mr-2" /> Add Clinic
//                   </Button>
//                 </div>
//                 {clinics.map((clinic, index) => (
//                   <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_address_${index}`}>Address</Label>
//                       <Input
//                         id={`clinic_address_${index}`}
//                         value={clinic.address}
//                         onChange={(e) => handleClinicChange(index, 'address', e.target.value)}
//                         placeholder="Address"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_city_${index}`}>City</Label>
//                       <Input
//                         id={`clinic_city_${index}`}
//                         value={clinic.city}
//                         onChange={(e) => handleClinicChange(index, 'city', e.target.value)}
//                         placeholder="City"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_latitude_${index}`}>Latitude</Label>
//                       <Input
//                         id={`clinic_latitude_${index}`}
//                         type="number"
//                         value={clinic.latitude}
//                         onChange={(e) => handleClinicChange(index, 'latitude', e.target.value)}
//                         placeholder="Latitude"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_longitude_${index}`}>Longitude</Label>
//                       <Input
//                         id={`clinic_longitude_${index}`}
//                         type="number"
//                         value={clinic.longitude}
//                         onChange={(e) => handleClinicChange(index, 'longitude', e.target.value)}
//                         placeholder="Longitude"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_image_1_${index}`}>Image 1 (Optional)</Label>
//                       <Input
//                         id={`clinic_image_1_${index}`}
//                         type="file"
//                         onChange={(e) => handleClinicChange(index, 'image_files', e.target.files, 0)}
//                         accept="image/*"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`clinic_image_2_${index}`}>Image 2 (Optional)</Label>
//                       <Input
//                         id={`clinic_image_2_${index}`}
//                         type="file"
//                         onChange={(e) => handleClinicChange(index, 'image_files', e.target.files, 1)}
//                         accept="image/*"
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <Button type="button" onClick={handleSaveClinics} className="bg-green-500 hover:bg-green-600">
//                   <FaSave className="mr-2" /> Save Clinics
//                 </Button>
//               </div>

//               {/* Expertise */}
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">Expertise</h3>
//                   <Button type="button" onClick={addExpertise} className="bg-blue-500 hover:bg-blue-600">
//                     <FaPlus className="mr-2" /> Add Expertise
//                   </Button>
//                 </div>
//                 {expertise.map((exp, index) => (
//                   <div key={index} className="flex gap-4 mb-4">
//                     <div className="space-y-2 flex-1">
//                       <Label htmlFor={`expertise_image_${index}`}>Image</Label>
//                       <Input
//                         id={`expertise_image_${index}`}
//                         type="file"
//                         onChange={(e) => handleExpertiseChange(index, 'image_file', e.target.files)}
//                         accept="image/*"
//                       />
//                     </div>
//                     <div className="space-y-2 flex-1">
//                       <Label htmlFor={`expertise_description_${index}`}>Description</Label>
//                       <Input
//                         id={`expertise_description_${index}`}
//                         value={exp.description}
//                         onChange={(e) => handleExpertiseChange(index, 'description', e.target.value)}
//                         placeholder="Description"
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <Button type="button" onClick={handleSaveExpertise} className="bg-green-500 hover:bg-green-600">
//                   <FaSave className="mr-2" /> Save Expertise
//                 </Button>
//               </div>

//               {/* Reviews */}
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">Reviews</h3>
//                   <Button type="button" onClick={addReview} className="bg-blue-500 hover:bg-blue-600">
//                     <FaPlus className="mr-2" /> Add Review
//                   </Button>
//                 </div>
//                 {reviews.map((review, index) => (
//                   <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                     <div className="space-y-2">
//                       <Label htmlFor={`review_patient_name_${index}`}>Patient Name</Label>
//                       <Input
//                         id={`review_patient_name_${index}`}
//                         value={review.patient_name}
//                         onChange={(e) => handleReviewChange(index, 'patient_name', e.target.value)}
//                         placeholder="Patient Name"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`review_description_${index}`}>Description</Label>
//                       <Input
//                         id={`review_description_${index}`}
//                         value={review.description}
//                         onChange={(e) => handleReviewChange(index, 'description', e.target.value)}
//                         placeholder="Description"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor={`review_rating_${index}`}>Rating (1-5)</Label>
//                       <Input
//                         id={`review_rating_${index}`}
//                         type="number"
//                         value={review.rating}
//                         onChange={(e) => handleReviewChange(index, 'rating', e.target.value)}
//                         placeholder="Rating (1-5)"
//                         min="1"
//                         max="5"
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <Button type="button" onClick={handleSaveReviews} className="bg-green-500 hover:bg-green-600">
//                   <FaSave className="mr-2" /> Save Reviews
//                 </Button>
//               </div>

//               {/* Videos */}
//               <div className="mt-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-semibold">Videos</h3>
//                   <Button type="button" onClick={addVideo} className="bg-blue-500 hover:bg-blue-600">
//                     <FaPlus className="mr-2" /> Add Video
//                   </Button>
//                 </div>
//                 {videos.map((video, index) => (
//                   <div key={index} className="flex gap-4 mb-4">
//                     <div className="space-y-2 flex-1">
//                       <Label htmlFor={`video_url_${index}`}>Video URL</Label>
//                       <Input
//                         id={`video_url_${index}`}
//                         value={video.video_url}
//                         onChange={(e) => handleVideoChange(index, 'video_url', e.target.value)}
//                         placeholder="e.g., https://youtube.com/watch?v=..."
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <Button type="button" onClick={handleSaveVideos} className="bg-green-500 hover:bg-green-600">
//                   <FaSave className="mr-2" /> Save Videos
//                 </Button>
//               </div>

//               <div className="flex gap-4 mt-6">
//                 <Button type="submit" className="bg-gradient-primary">
//                   <FaSave className="mr-2" /> Save All
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate('/doctors')}
//                   className="bg-red-500 hover:bg-red-600 text-white"
//                 >
//                   <FaTimes className="mr-2" /> Cancel
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Confirmation Dialog */}
//         <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
//           <DialogContent className="sm:max-w-[400px]">
//             <DialogHeader>
//               <DialogTitle>Portfolio Saved</DialogTitle>
//             </DialogHeader>
//             <p className="text-gray-600">Doctor portfolio has been successfully saved.</p>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 className="bg-gradient-primary"
//                 onClick={() => {
//                   setIsConfirmDialogOpen(false);
//                   navigate('/doctors');
//                 }}
//               >
//                 Back to Doctors
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default AddPortfolio;


// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// // import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';

// // const AddPortfolio = () => {
// //   const [formData, setFormData] = useState({
// //     doctor_id: '',
// //     name: '',
// //     specialization: '',
// //     experience_yrs: '',
// //     quote: '',
// //     hospital: '',
// //     total_patients: '',
// //     status: true,
// //     profile_img_left: null as File | null,
// //     profile_img_right: null as File | null,
// //     label1: '',
// //     label2: '',
// //     label3: '',
// //     about: ''
// //   });
// //   const [sections, setSections] = useState<{ section_type: string; image_file: File | null }[]>([{ section_type: '', image_file: null }]);
// //   const [clinics, setClinics] = useState<{ address: string; city: string; latitude: string; longitude: string; image_file: File | null }[]>([]);
// //   const [expertise, setExpertise] = useState<{ image_file: File | null; description: string }[]>([]);
// //   const [reviews, setReviews] = useState<{ patient_name: string; description: string; rating: number }[]>([]);
// //   const [videos, setVideos] = useState<{ video_url: string }[]>([]);
// //   const [error, setError] = useState<string | null>(null);
// //   const [debugInfo, setDebugInfo] = useState<string | null>(null);
// //   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
// //   const navigate = useNavigate();

// //   const API_BASE_URL = 'https://api.onestepmedi.com:8000';

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type, checked, files } = e.target as HTMLInputElement;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: type === 'file' ? files ? files[0] : null : type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   const handleSectionChange = (index: number, field: string, value: any) => {
// //     const updatedSections = [...sections];
// //     updatedSections[index] = { ...updatedSections[index], [field]: field === 'image_file' ? value[0] : value };
// //     setSections(updatedSections);
// //   };

// //   const handleClinicChange = (index: number, field: string, value: any) => {
// //     const updatedClinics = [...clinics];
// //     updatedClinics[index] = { ...updatedClinics[index], [field]: field === 'image_file' ? value[0] : value };
// //     setClinics(updatedClinics);
// //   };

// //   const handleExpertiseChange = (index: number, field: string, value: any) => {
// //     const updatedExpertise = [...expertise];
// //     updatedExpertise[index] = { ...updatedExpertise[index], [field]: field === 'image_file' ? value[0] : value };
// //     setExpertise(updatedExpertise);
// //   };

// //   const handleReviewChange = (index: number, field: string, value: any) => {
// //     const updatedReviews = [...reviews];
// //     updatedReviews[index] = { ...updatedReviews[index], [field]: field === 'rating' ? Number(value) : value };
// //     setReviews(updatedReviews);
// //   };

// //   const handleVideoChange = (index: number, field: string, value: any) => {
// //     const updatedVideos = [...videos];
// //     updatedVideos[index] = { ...updatedVideos[index], [field]: value };
// //     setVideos(updatedVideos);
// //   };

// //   const addSection = async () => {
// //     setSections([...sections, { section_type: '', image_file: null }]);
// //     setDebugInfo('Added new section');
// //     await handleSaveSections();
// //   };

// //   const addClinic = () => {
// //     setClinics([...clinics, { address: '', city: '', latitude: '', longitude: '', image_file: null }]);
// //     setDebugInfo('Added new clinic');
// //   };

// //   const addExpertise = () => {
// //     setExpertise([...expertise, { image_file: null, description: '' }]);
// //     setDebugInfo('Added new expertise');
// //   };

// //   const addReview = () => {
// //     setReviews([...reviews, { patient_name: '', description: '', rating: 0 }]);
// //     setDebugInfo('Added new review');
// //   };

// //   const addVideo = () => {
// //     setVideos([...videos, { video_url: '' }]);
// //     setDebugInfo('Added new video');
// //   };

// //   const handleSaveDoctor = async () => {
// //     if (!formData.doctor_id || !formData.name || !formData.specialization) {
// //       setError('Doctor ID, Name, and Specialization are required.');
// //       setDebugInfo('Validation failed: Missing required fields');
// //       return false;
// //     }

// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       const queryParams = new URLSearchParams({
// //         doctor_id: formData.doctor_id,
// //         name: formData.name,
// //         specialization: formData.specialization,
// //         experience_years: formData.experience_yrs,
// //         quote: formData.quote,
// //         hospital: formData.hospital,
// //         total_patients: formData.total_patients,
// //         status: formData.status.toString(),
// //         label1: formData.label1,
// //         label2: formData.label2,
// //         label3: formData.label3,
// //         about: formData.about
// //       }).toString();

// //       const formDataToSend = new FormData();
// //       if (formData.profile_img_left) {
// //         formDataToSend.append('profile_img_left', formData.profile_img_left);
// //       }
// //       if (formData.profile_img_right) {
// //         formDataToSend.append('profile_img_right', formData.profile_img_right);
// //       }

// //       const response = await fetch(`${API_BASE_URL}/doctors/create?${queryParams}`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           throw new Error("Unauthorized: Invalid or expired token");
// //         }
// //         throw new Error("Failed to create doctor portfolio");
// //       }

// //       const newDoctor = await response.json();
// //       setFormData((prev) => ({ ...prev, doctor_id: newDoctor.doctor_id }));
// //       setError(null);
// //       setDebugInfo(`Successfully created doctor ${newDoctor.doctor_id}`);
// //       setIsConfirmDialogOpen(true);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving doctor:', error);
// //       setError(`Failed to save doctor: ${error.message}. Please ensure the backend accepts query parameters and multipart/form-data.`);
// //       setDebugInfo(`Save doctor failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSaveSections = async () => {
// //     if (!formData.doctor_id) {
// //       setError('Please save doctor details first.');
// //       setDebugInfo('Validation failed: Missing doctor_id');
// //       return false;
// //     }
// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       const formDataToSend = new FormData();
// //       sections.forEach((section) => {
// //         formDataToSend.append(`section_type`, section.section_type);
// //         if (section.image_file) {
// //           formDataToSend.append(`images`, section.image_file);
// //         }
// //       });

// //       const response = await fetch(`${API_BASE_URL}/doctors/sections/${formData.doctor_id}`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           throw new Error("Unauthorized: Invalid or expired token");
// //         }
// //         throw new Error("Failed to save sections");
// //       }

// //       setError(null);
// //       setDebugInfo(`Successfully saved sections for doctor ${formData.doctor_id}`);
// //       setIsConfirmDialogOpen(true);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving sections:', error);
// //       setError(`Failed to save sections: ${error.message}`);
// //       setDebugInfo(`Save sections failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSaveClinics = async () => {
// //     if (!formData.doctor_id) {
// //       setError('Please save doctor details first.');
// //       setDebugInfo('Validation failed: Missing doctor_id');
// //       return false;
// //     }
// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       const formDataToSend = new FormData();
// //       clinics.forEach((clinic) => {
// //         formDataToSend.append(`address`, clinic.address);
// //         formDataToSend.append(`city`, clinic.city);
// //         formDataToSend.append(`latitude`, clinic.latitude);
// //         formDataToSend.append(`longitude`, clinic.longitude);
// //         if (clinic.image_file) {
// //           formDataToSend.append(`images`, clinic.image_file);
// //         }
// //       });

// //       const response = await fetch(`${API_BASE_URL}/doctors/clinics/${formData.doctor_id}`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           throw new Error("Unauthorized: Invalid or expired token");
// //         }
// //         throw new Error("Failed to save clinics");
// //       }

// //       setError(null);
// //       setDebugInfo(`Successfully saved clinics for doctor ${formData.doctor_id}`);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving clinics:', error);
// //       setError(`Failed to save clinics: ${error.message}`);
// //       setDebugInfo(`Save clinics failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSaveExpertise = async () => {
// //     if (!formData.doctor_id) {
// //       setError('Please save doctor details first.');
// //       setDebugInfo('Validation failed: Missing doctor_id');
// //       return false;
// //     }
// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       const formDataToSend = new FormData();
// //       expertise.forEach((exp) => {
// //         formDataToSend.append(`description`, exp.description);
// //         if (exp.image_file) {
// //           formDataToSend.append(`images`, exp.image_file);
// //         }
// //       });

// //       const response = await fetch(`${API_BASE_URL}/doctors/expertise/${formData.doctor_id}`, {
// //         method: 'POST',
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: formDataToSend,
// //       });

// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           throw new Error("Unauthorized: Invalid or expired token");
// //         }
// //         throw new Error("Failed to save expertise");
// //       }

// //       setError(null);
// //       setDebugInfo(`Successfully saved expertise for doctor ${formData.doctor_id}`);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving expertise:', error);
// //       setError(`Failed to save expertise: ${error.message}`);
// //       setDebugInfo(`Save expertise failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSaveReviews = async () => {
// //     if (!formData.doctor_id) {
// //       setError('Please save doctor details first.');
// //       setDebugInfo('Validation failed: Missing doctor_id');
// //       return false;
// //     }
// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       for (const review of reviews) {
// //         if (review.patient_name && review.description && review.rating > 0) {
// //           const response = await fetch(`${API_BASE_URL}/doctors/reviews/${formData.doctor_id}`, {
// //             method: 'POST',
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify(review),
// //           });

// //           if (!response.ok) {
// //             if (response.status === 401) {
// //               throw new Error("Unauthorized: Invalid or expired token");
// //             }
// //             throw new Error("Failed to save review");
// //           }
// //         }
// //       }

// //       setError(null);
// //       setDebugInfo(`Successfully saved reviews for doctor ${formData.doctor_id}`);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving reviews:', error);
// //       setError(`Failed to save reviews: ${error.message}`);
// //       setDebugInfo(`Save reviews failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSaveVideos = async () => {
// //     if (!formData.doctor_id) {
// //       setError('Please save doctor details first.');
// //       setDebugInfo('Validation failed: Missing doctor_id');
// //       return false;
// //     }
// //     try {
// //       const token = localStorage.getItem("authToken");
// //       if (!token) {
// //         throw new Error("No access token found");
// //       }

// //       for (const video of videos) {
// //         if (video.video_url) {
// //           const response = await fetch(`${API_BASE_URL}/doctors/videos/${formData.doctor_id}`, {
// //             method: 'POST',
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //               'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify(video),
// //           });

// //           if (!response.ok) {
// //             if (response.status === 401) {
// //               throw new Error("Unauthorized: Invalid or expired token");
// //             }
// //             throw new Error("Failed to save video");
// //           }
// //         }
// //       }

// //       setError(null);
// //       setDebugInfo(`Successfully saved videos for doctor ${formData.doctor_id}`);
// //       return true;
// //     } catch (error: any) {
// //       console.error('Error saving videos:', error);
// //       setError(`Failed to save videos: ${error.message}`);
// //       setDebugInfo(`Save videos failed: ${error.response?.status || 'unknown'} ${error.message}`);
// //       return false;
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const doctorSaved = await handleSaveDoctor();
// //     if (doctorSaved) {
// //       await Promise.all([
// //         handleSaveSections(),
// //         handleSaveClinics(),
// //         handleSaveExpertise(),
// //         handleSaveReviews(),
// //         handleSaveVideos(),
// //       ]);
// //       if (!error) {
// //         setIsConfirmDialogOpen(true);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6 font-sans">
// //       <div className="max-w-7xl mx-auto">
// //         <Card className="shadow-card">
// //           <CardHeader>
// //             <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
// //               Add Doctor Portfolio
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {error && (
// //               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
// //                 {error}
// //               </div>
// //             )}
// //             {debugInfo && (
// //               <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
// //                 Debug: {debugInfo}
// //               </div>
// //             )}
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="doctor_id">Doctor ID *</Label>
// //                   <Input
// //                     id="doctor_id"
// //                     name="doctor_id"
// //                     value={formData.doctor_id}
// //                     onChange={handleInputChange}
// //                     required
// //                     placeholder="e.g., DR201"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="name">Name *</Label>
// //                   <Input
// //                     id="name"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleInputChange}
// //                     required
// //                     placeholder="e.g., Dr. Anil Sharma"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="specialization">Specialization *</Label>
// //                   <Input
// //                     id="specialization"
// //                     name="specialization"
// //                     value={formData.specialization}
// //                     onChange={handleInputChange}
// //                     required
// //                     placeholder="e.g., Cardiologist (MBBS, MD)"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="experience_yrs">Experience (Years)</Label>
// //                   <Input
// //                     id="experience_yrs"
// //                     name="experience_yrs"
// //                     type="number"
// //                     value={formData.experience_yrs}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., 14"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="quote">Quote</Label>
// //                   <Input
// //                     id="quote"
// //                     name="quote"
// //                     value={formData.quote}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., I believe in listening to the patient's heart."
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="hospital">Hospital</Label>
// //                   <Input
// //                     id="hospital"
// //                     name="hospital"
// //                     value={formData.hospital}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., Fortis Hospital, Hyderabad"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="total_patients">Total Patients</Label>
// //                   <Input
// //                     id="total_patients"
// //                     name="total_patients"
// //                     type="number"
// //                     value={formData.total_patients}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., 275"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="status">Status</Label>
// //                   <select
// //                     id="status"
// //                     name="status"
// //                     value={formData.status.toString()}
// //                     onChange={handleInputChange}
// //                     className="p-2 border rounded w-full"
// //                   >
// //                     <option value="true">Available</option>
// //                     <option value="false">Not Available</option>
// //                   </select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="profile_img_left">Profile Image Left</Label>
// //                   <Input
// //                     id="profile_img_left"
// //                     name="profile_img_left"
// //                     type="file"
// //                     onChange={handleInputChange}
// //                     accept="image/*"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="profile_img_right">Profile Image Right</Label>
// //                   <Input
// //                     id="profile_img_right"
// //                     name="profile_img_right"
// //                     type="file"
// //                     onChange={handleInputChange}
// //                     accept="image/*"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="label1">Label 1</Label>
// //                   <Input
// //                     id="label1"
// //                     name="label1"
// //                     value={formData.label1}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., In clinic, Online"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="label2">Label 2</Label>
// //                   <Input
// //                     id="label2"
// //                     name="label2"
// //                     value={formData.label2}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., English, Hindi, Telugu"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="label3">Label 3</Label>
// //                   <Input
// //                     id="label3"
// //                     name="label3"
// //                     value={formData.label3}
// //                     onChange={handleInputChange}
// //                     placeholder="e.g., 97% Recommends"
// //                   />
// //                 </div>
// //                 <div className="space-y-2 col-span-2">
// //                   <Label htmlFor="about">About</Label>
// //                   <textarea
// //                     id="about"
// //                     name="about"
// //                     value={formData.about}
// //                     onChange={handleInputChange}
// //                     className="p-2 border rounded w-full"
// //                     rows={4}
// //                     placeholder="Enter doctor's bio..."
// //                   />
// //                 </div>
// //                 <div className="col-span-2">
// //                   <Button type="button" onClick={handleSaveDoctor} className="bg-green-500 hover:bg-green-600">
// //                     <FaSave className="mr-2" /> Save Doctor Details
// //                   </Button>
// //                 </div>
// //               </div>

// //               {/* Sections */}
// //               <div className="mt-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">Sections</h3>
// //                   <Button type="button" onClick={addSection} className="bg-blue-500 hover:bg-blue-600">
// //                     <FaPlus className="mr-2" /> Add Section
// //                   </Button>
// //                 </div>
// //                 {sections.map((section, index) => (
// //                   <div key={index} className="flex gap-4 mb-4">
// //                     <div className="space-y-2 flex-1">
// //                       <Label htmlFor={`section_type_${index}`}>Section Type</Label>
// //                       <Input
// //                         id={`section_type_${index}`}
// //                         value={section.section_type}
// //                         onChange={(e) => handleSectionChange(index, 'section_type', e.target.value)}
// //                         placeholder="e.g., Experience"
// //                       />
// //                     </div>
// //                     <div className="space-y-2 flex-1">
// //                       <Label htmlFor={`section_image_${index}`}>Image (Optional)</Label>
// //                       <Input
// //                         id={`section_image_${index}`}
// //                         type="file"
// //                         onChange={(e) => handleSectionChange(index, 'image_file', e.target.files)}
// //                         accept="image/*"
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <Button type="button" onClick={handleSaveSections} className="bg-green-500 hover:bg-green-600">
// //                   <FaSave className="mr-2" /> Save Sections
// //                 </Button>
// //               </div>

// //               {/* Clinics */}
// //               <div className="mt-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">Clinics</h3>
// //                   <Button type="button" onClick={addClinic} className="bg-blue-500 hover:bg-blue-600">
// //                     <FaPlus className="mr-2" /> Add Clinic
// //                   </Button>
// //                 </div>
// //                 {clinics.map((clinic, index) => (
// //                   <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`clinic_address_${index}`}>Address</Label>
// //                       <Input
// //                         id={`clinic_address_${index}`}
// //                         value={clinic.address}
// //                         onChange={(e) => handleClinicChange(index, 'address', e.target.value)}
// //                         placeholder="Address"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`clinic_city_${index}`}>City</Label>
// //                       <Input
// //                         id={`clinic_city_${index}`}
// //                         value={clinic.city}
// //                         onChange={(e) => handleClinicChange(index, 'city', e.target.value)}
// //                         placeholder="City"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`clinic_latitude_${index}`}>Latitude</Label>
// //                       <Input
// //                         id={`clinic_latitude_${index}`}
// //                         type="number"
// //                         value={clinic.latitude}
// //                         onChange={(e) => handleClinicChange(index, 'latitude', e.target.value)}
// //                         placeholder="Latitude"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`clinic_longitude_${index}`}>Longitude</Label>
// //                       <Input
// //                         id={`clinic_longitude_${index}`}
// //                         type="number"
// //                         value={clinic.longitude}
// //                         onChange={(e) => handleClinicChange(index, 'longitude', e.target.value)}
// //                         placeholder="Longitude"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`clinic_image_${index}`}>Image</Label>
// //                       <Input
// //                         id={`clinic_image_${index}`}
// //                         type="file"
// //                         onChange={(e) => handleClinicChange(index, 'image_file', e.target.files)}
// //                         accept="image/*"
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <Button type="button" onClick={handleSaveClinics} className="bg-green-500 hover:bg-green-600">
// //                   <FaSave className="mr-2" /> Save Clinics
// //                 </Button>
// //               </div>

// //               {/* Expertise */}
// //               <div className="mt-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">Expertise</h3>
// //                   <Button type="button" onClick={addExpertise} className="bg-blue-500 hover:bg-blue-600">
// //                     <FaPlus className="mr-2" /> Add Expertise
// //                   </Button>
// //                 </div>
// //                 {expertise.map((exp, index) => (
// //                   <div key={index} className="flex gap-4 mb-4">
// //                     <div className="space-y-2 flex-1">
// //                       <Label htmlFor={`expertise_image_${index}`}>Image</Label>
// //                       <Input
// //                         id={`expertise_image_${index}`}
// //                         type="file"
// //                         onChange={(e) => handleExpertiseChange(index, 'image_file', e.target.files)}
// //                         accept="image/*"
// //                       />
// //                     </div>
// //                     <div className="space-y-2 flex-1">
// //                       <Label htmlFor={`expertise_description_${index}`}>Description</Label>
// //                       <Input
// //                         id={`expertise_description_${index}`}
// //                         value={exp.description}
// //                         onChange={(e) => handleExpertiseChange(index, 'description', e.target.value)}
// //                         placeholder="Description"
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <Button type="button" onClick={handleSaveExpertise} className="bg-green-500 hover:bg-green-600">
// //                   <FaSave className="mr-2" /> Save Expertise
// //                 </Button>
// //               </div>

// //               {/* Reviews */}
// //               <div className="mt-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">Reviews</h3>
// //                   <Button type="button" onClick={addReview} className="bg-blue-500 hover:bg-blue-600">
// //                     <FaPlus className="mr-2" /> Add Review
// //                   </Button>
// //                 </div>
// //                 {reviews.map((review, index) => (
// //                   <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`review_patient_name_${index}`}>Patient Name</Label>
// //                       <Input
// //                         id={`review_patient_name_${index}`}
// //                         value={review.patient_name}
// //                         onChange={(e) => handleReviewChange(index, 'patient_name', e.target.value)}
// //                         placeholder="Patient Name"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`review_description_${index}`}>Description</Label>
// //                       <Input
// //                         id={`review_description_${index}`}
// //                         value={review.description}
// //                         onChange={(e) => handleReviewChange(index, 'description', e.target.value)}
// //                         placeholder="Description"
// //                       />
// //                     </div>
// //                     <div className="space-y-2">
// //                       <Label htmlFor={`review_rating_${index}`}>Rating (1-5)</Label>
// //                       <Input
// //                         id={`review_rating_${index}`}
// //                         type="number"
// //                         value={review.rating}
// //                         onChange={(e) => handleReviewChange(index, 'rating', e.target.value)}
// //                         placeholder="Rating (1-5)"
// //                         min="1"
// //                         max="5"
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <Button type="button" onClick={handleSaveReviews} className="bg-green-500 hover:bg-green-600">
// //                   <FaSave className="mr-2" /> Save Reviews
// //                 </Button>
// //               </div>

// //               {/* Videos */}
// //               <div className="mt-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h3 className="text-lg font-semibold">Videos</h3>
// //                   <Button type="button" onClick={addVideo} className="bg-blue-500 hover:bg-blue-600">
// //                     <FaPlus className="mr-2" /> Add Video
// //                   </Button>
// //                 </div>
// //                 {videos.map((video, index) => (
// //                   <div key={index} className="flex gap-4 mb-4">
// //                     <div className="space-y-2 flex-1">
// //                       <Label htmlFor={`video_url_${index}`}>Video URL</Label>
// //                       <Input
// //                         id={`video_url_${index}`}
// //                         value={video.video_url}
// //                         onChange={(e) => handleVideoChange(index, 'video_url', e.target.value)}
// //                         placeholder="e.g., https://youtube.com/watch?v=..."
// //                       />
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <Button type="button" onClick={handleSaveVideos} className="bg-green-500 hover:bg-green-600">
// //                   <FaSave className="mr-2" /> Save Videos
// //                 </Button>
// //               </div>

// //               <div className="flex gap-4 mt-6">
// //                 <Button type="submit" className="bg-gradient-primary">
// //                   <FaSave className="mr-2" /> Save All
// //                 </Button>
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={() => navigate('/doctors')}
// //                   className="bg-red-500 hover:bg-red-600 text-white"
// //                 >
// //                   <FaTimes className="mr-2" /> Cancel
// //                 </Button>
// //               </div>
// //             </form>
// //           </CardContent>
// //         </Card>

// //         {/* Confirmation Dialog */}
// //         <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
// //           <DialogContent className="sm:max-w-[400px]">
// //             <DialogHeader>
// //               <DialogTitle>Portfolio Saved</DialogTitle>
// //             </DialogHeader>
// //             <p className="text-gray-600">Doctor portfolio has been successfully saved.</p>
// //             <DialogFooter>
// //               <Button
// //                 type="button"
// //                 className="bg-gradient-primary"
// //                 onClick={() => {
// //                   setIsConfirmDialogOpen(false);
// //                   navigate('/doctors');
// //                 }}
// //               >
// //                 Back to Doctors
// //               </Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddPortfolio;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaSave, FaTimes, FaPlus } from 'react-icons/fa';

const AddPortfolio = () => {
  const [formData, setFormData] = useState({
    doctor_id: '',
    name: '',
    specialization: '',
    experience_yrs: '',
    quote: '',
    hospital: '',
    total_patients: '',
    status: true,
    profile_img_left: null as File | null,
    profile_img_right: null as File | null,
    label1: '',
    label2: '',
    label3: '',
    about: ''
  });
  const [sections, setSections] = useState<{ section_type: string; image_file: File | null }[]>([{ section_type: '', image_file: null }]);
  const [clinics, setClinics] = useState<{ address: string; city: string; latitude: string; longitude: string; image_file: File | null }[]>([]);
  const [expertise, setExpertise] = useState<{ image_file: File | null; description: string }[]>([]);
  const [reviews, setReviews] = useState<{ patient_name: string; description: string; rating: number }[]>([]);
  const [videos, setVideos] = useState<{ video_url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://api.onestepmedi.com:8000';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files ? files[0] : null : type === 'checkbox' ? checked : value,
    }));
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: field === 'image_file' ? value[0] : value };
    setSections(updatedSections);
  };

  const handleClinicChange = (index: number, field: string, value: any) => {
    const updatedClinics = [...clinics];
    updatedClinics[index] = { ...updatedClinics[index], [field]: field === 'image_file' ? value[0] : value };
    setClinics(updatedClinics);
  };

  const handleExpertiseChange = (index: number, field: string, value: any) => {
    const updatedExpertise = [...expertise];
    updatedExpertise[index] = { ...updatedExpertise[index], [field]: field === 'image_file' ? value[0] : value };
    setExpertise(updatedExpertise);
  };

  const handleReviewChange = (index: number, field: string, value: any) => {
    const updatedReviews = [...reviews];
    updatedReviews[index] = { ...updatedReviews[index], [field]: field === 'rating' ? Number(value) : value };
    setReviews(updatedReviews);
  };

  const handleVideoChange = (index: number, field: string, value: any) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setVideos(updatedVideos);
  };

  const addSection = async () => {
    setSections([...sections, { section_type: '', image_file: null }]);
    setDebugInfo('Added new section');
    await handleSaveSections();
  };

  const addClinic = () => {
    setClinics([...clinics, { address: '', city: '', latitude: '', longitude: '', image_file: null }]);
    setDebugInfo('Added new clinic');
  };

  const addExpertise = () => {
    setExpertise([...expertise, { image_file: null, description: '' }]);
    setDebugInfo('Added new expertise');
  };

  const addReview = () => {
    setReviews([...reviews, { patient_name: '', description: '', rating: 0 }]);
    setDebugInfo('Added new review');
  };

  const addVideo = () => {
    setVideos([...videos, { video_url: '' }]);
    setDebugInfo('Added new video');
  };

  const handleSaveDoctor = async () => {
    if (!formData.doctor_id || !formData.name || !formData.specialization) {
      setError('Doctor ID, Name, and Specialization are required.');
      setDebugInfo('Validation failed: Missing required fields');
      return false;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const queryParams = new URLSearchParams({
        doctor_id: formData.doctor_id,
        name: formData.name,
        specialization: formData.specialization,
        experience_years: formData.experience_yrs,
        quote: formData.quote,
        hospital: formData.hospital,
        total_patients: formData.total_patients,
        status: formData.status.toString(),
        label1: formData.label1,
        label2: formData.label2,
        label3: formData.label3,
        about: formData.about
      }).toString();

      const formDataToSend = new FormData();
      if (formData.profile_img_left) {
        formDataToSend.append('profile_img_left', formData.profile_img_left);
      }
      if (formData.profile_img_right) {
        formDataToSend.append('profile_img_right', formData.profile_img_right);
      }

      const response = await fetch(`${API_BASE_URL}/doctors/create?${queryParams}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to create doctor portfolio");
      }

      const newDoctor = await response.json();
      setFormData((prev) => ({ ...prev, doctor_id: newDoctor.doctor_id }));
      setError(null);
      setDebugInfo(`Successfully created doctor ${newDoctor.doctor_id}`);
      setIsConfirmDialogOpen(true);
      return true;
    } catch (error: any) {
      console.error('Error saving doctor:', error);
      setError(`Failed to save doctor: ${error.message}. Please ensure the backend accepts query parameters and multipart/form-data.`);
      setDebugInfo(`Save doctor failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSaveSections = async () => {
    if (!formData.doctor_id) {
      setError('Please save doctor details first.');
      setDebugInfo('Validation failed: Missing doctor_id');
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const formDataToSend = new FormData();
      sections.forEach((section) => {
        formDataToSend.append(`section_type`, section.section_type);
        if (section.image_file) {
          formDataToSend.append(`images`, section.image_file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/doctors/sections/${formData.doctor_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to save sections");
      }

      setError(null);
      setDebugInfo(`Successfully saved sections for doctor ${formData.doctor_id}`);
      setIsConfirmDialogOpen(true);
      return true;
    } catch (error: any) {
      console.error('Error saving sections:', error);
      setError(`Failed to save sections: ${error.message}`);
      setDebugInfo(`Save sections failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSaveClinics = async () => {
    if (!formData.doctor_id) {
      setError('Please save doctor details first.');
      setDebugInfo('Validation failed: Missing doctor_id');
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const formDataToSend = new FormData();
      clinics.forEach((clinic) => {
        formDataToSend.append(`address`, clinic.address);
        formDataToSend.append(`city`, clinic.city);
        formDataToSend.append(`latitude`, clinic.latitude);
        formDataToSend.append(`longitude`, clinic.longitude);
        if (clinic.image_file) {
          formDataToSend.append(`images`, clinic.image_file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/doctors/clinics/${formData.doctor_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to save clinics");
      }

      setError(null);
      setDebugInfo(`Successfully saved clinics for doctor ${formData.doctor_id}`);
      return true;
    } catch (error: any) {
      console.error('Error saving clinics:', error);
      setError(`Failed to save clinics: ${error.message}`);
      setDebugInfo(`Save clinics failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSaveExpertise = async () => {
    if (!formData.doctor_id) {
      setError('Please save doctor details first.');
      setDebugInfo('Validation failed: Missing doctor_id');
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const formDataToSend = new FormData();
      expertise.forEach((exp) => {
        formDataToSend.append(`description`, exp.description);
        if (exp.image_file) {
          formDataToSend.append(`images`, exp.image_file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/doctors/expertise/${formData.doctor_id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to save expertise");
      }

      setError(null);
      setDebugInfo(`Successfully saved expertise for doctor ${formData.doctor_id}`);
      return true;
    } catch (error: any) {
      console.error('Error saving expertise:', error);
      setError(`Failed to save expertise: ${error.message}`);
      setDebugInfo(`Save expertise failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSaveReviews = async () => {
    if (!formData.doctor_id) {
      setError('Please save doctor details first.');
      setDebugInfo('Validation failed: Missing doctor_id');
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      for (const review of reviews) {
        if (review.patient_name && review.description && review.rating > 0) {
          const response = await fetch(`${API_BASE_URL}/doctors/reviews/${formData.doctor_id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized: Invalid or expired token");
            }
            throw new Error("Failed to save review");
          }
        }
      }

      setError(null);
      setDebugInfo(`Successfully saved reviews for doctor ${formData.doctor_id}`);
      return true;
    } catch (error: any) {
      console.error('Error saving reviews:', error);
      setError(`Failed to save reviews: ${error.message}`);
      setDebugInfo(`Save reviews failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSaveVideos = async () => {
    if (!formData.doctor_id) {
      setError('Please save doctor details first.');
      setDebugInfo('Validation failed: Missing doctor_id');
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      for (const video of videos) {
        if (video.video_url) {
          const response = await fetch(`${API_BASE_URL}/doctors/videos/${formData.doctor_id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(video),
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized: Invalid or expired token");
            }
            throw new Error("Failed to save video");
          }
        }
      }

      setError(null);
      setDebugInfo(`Successfully saved videos for doctor ${formData.doctor_id}`);
      return true;
    } catch (error: any) {
      console.error('Error saving videos:', error);
      setError(`Failed to save videos: ${error.message}`);
      setDebugInfo(`Save videos failed: ${error.response?.status || 'unknown'} ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctorSaved = await handleSaveDoctor();
    if (doctorSaved) {
      await Promise.all([
        handleSaveSections(),
        handleSaveClinics(),
        handleSaveExpertise(),
        handleSaveReviews(),
        handleSaveVideos(),
      ]);
      if (!error) {
        setIsConfirmDialogOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Add Doctor Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            {debugInfo && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                Debug: {debugInfo}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_id">Doctor ID *</Label>
                  <Input
                    id="doctor_id"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., DR201"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Dr. Anil Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Cardiologist (MBBS, MD)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience_yrs">Experience (Years)</Label>
                  <Input
                    id="experience_yrs"
                    name="experience_yrs"
                    type="number"
                    value={formData.experience_yrs}
                    onChange={handleInputChange}
                    placeholder="e.g., 14"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote</Label>
                  <Input
                    id="quote"
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    placeholder="e.g., I believe in listening to the patient's heart."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <Input
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    placeholder="e.g., Fortis Hospital, Hyderabad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_patients">Total Patients</Label>
                  <Input
                    id="total_patients"
                    name="total_patients"
                    type="number"
                    value={formData.total_patients}
                    onChange={handleInputChange}
                    placeholder="e.g., 275"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status.toString()}
                    onChange={handleInputChange}
                    className="p-2 border rounded w-full"
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile_img_left">Profile Image Left</Label>
                  <Input
                    id="profile_img_left"
                    name="profile_img_left"
                    type="file"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile_img_right">Profile Image Right</Label>
                  <Input
                    id="profile_img_right"
                    name="profile_img_right"
                    type="file"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label1">Label 1</Label>
                  <Input
                    id="label1"
                    name="label1"
                    value={formData.label1}
                    onChange={handleInputChange}
                    placeholder="e.g., In clinic, Online"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label2">Label 2</Label>
                  <Input
                    id="label2"
                    name="label2"
                    value={formData.label2}
                    onChange={handleInputChange}
                    placeholder="e.g., English, Hindi, Telugu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label3">Label 3</Label>
                  <Input
                    id="label3"
                    name="label3"
                    value={formData.label3}
                    onChange={handleInputChange}
                    placeholder="e.g., 97% Recommends"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="about">About</Label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="p-2 border rounded w-full"
                    rows={4}
                    placeholder="Enter doctor's bio..."
                  />
                </div>
                <div className="col-span-2">
                  <Button type="button" onClick={handleSaveDoctor} className="bg-green-500 hover:bg-green-600">
                    <FaSave className="mr-2" /> Save Doctor Details
                  </Button>
                </div>
              </div>

              {/* Sections */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Sections</h3>
                  <Button type="button" onClick={addSection} className="bg-blue-500 hover:bg-blue-600">
                    <FaPlus className="mr-2" /> Add Section
                  </Button>
                </div>
                {sections.map((section, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`section_type_${index}`}>Section Type</Label>
                      <Input
                        id={`section_type_${index}`}
                        value={section.section_type}
                        onChange={(e) => handleSectionChange(index, 'section_type', e.target.value)}
                        placeholder="e.g., Experience"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`section_image_${index}`}>Image (Optional)</Label>
                      <Input
                        id={`section_image_${index}`}
                        type="file"
                        onChange={(e) => handleSectionChange(index, 'image_file', e.target.files)}
                        accept="image/*"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleSaveSections} className="bg-green-500 hover:bg-green-600">
                  <FaSave className="mr-2" /> Save Sections
                </Button>
              </div>

              {/* Clinics */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Clinics</h3>
                  <Button type="button" onClick={addClinic} className="bg-blue-500 hover:bg-blue-600">
                    <FaPlus className="mr-2" /> Add Clinic
                  </Button>
                </div>
                {clinics.map((clinic, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`clinic_address_${index}`}>Address</Label>
                      <Input
                        id={`clinic_address_${index}`}
                        value={clinic.address}
                        onChange={(e) => handleClinicChange(index, 'address', e.target.value)}
                        placeholder="Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`clinic_city_${index}`}>City</Label>
                      <Input
                        id={`clinic_city_${index}`}
                        value={clinic.city}
                        onChange={(e) => handleClinicChange(index, 'city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`clinic_latitude_${index}`}>Latitude</Label>
                      <Input
                        id={`clinic_latitude_${index}`}
                        type="number"
                        value={clinic.latitude}
                        onChange={(e) => handleClinicChange(index, 'latitude', e.target.value)}
                        placeholder="Latitude"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`clinic_longitude_${index}`}>Longitude</Label>
                      <Input
                        id={`clinic_longitude_${index}`}
                        type="number"
                        value={clinic.longitude}
                        onChange={(e) => handleClinicChange(index, 'longitude', e.target.value)}
                        placeholder="Longitude"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`clinic_image_${index}`}>Image</Label>
                      <Input
                        id={`clinic_image_${index}`}
                        type="file"
                        onChange={(e) => handleClinicChange(index, 'image_file', e.target.files)}
                        accept="image/*"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleSaveClinics} className="bg-green-500 hover:bg-green-600">
                  <FaSave className="mr-2" /> Save Clinics
                </Button>
              </div>

              {/* Expertise */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Expertise</h3>
                  <Button type="button" onClick={addExpertise} className="bg-blue-500 hover:bg-blue-600">
                    <FaPlus className="mr-2" /> Add Expertise
                  </Button>
                </div>
                {expertise.map((exp, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`expertise_image_${index}`}>Image</Label>
                      <Input
                        id={`expertise_image_${index}`}
                        type="file"
                        onChange={(e) => handleExpertiseChange(index, 'image_file', e.target.files)}
                        accept="image/*"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`expertise_description_${index}`}>Description</Label>
                      <Input
                        id={`expertise_description_${index}`}
                        value={exp.description}
                        onChange={(e) => handleExpertiseChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleSaveExpertise} className="bg-green-500 hover:bg-green-600">
                  <FaSave className="mr-2" /> Save Expertise
                </Button>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Reviews</h3>
                  <Button type="button" onClick={addReview} className="bg-blue-500 hover:bg-blue-600">
                    <FaPlus className="mr-2" /> Add Review
                  </Button>
                </div>
                {reviews.map((review, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`review_patient_name_${index}`}>Patient Name</Label>
                      <Input
                        id={`review_patient_name_${index}`}
                        value={review.patient_name}
                        onChange={(e) => handleReviewChange(index, 'patient_name', e.target.value)}
                        placeholder="Patient Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`review_description_${index}`}>Description</Label>
                      <Input
                        id={`review_description_${index}`}
                        value={review.description}
                        onChange={(e) => handleReviewChange(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`review_rating_${index}`}>Rating (1-5)</Label>
                      <Input
                        id={`review_rating_${index}`}
                        type="number"
                        value={review.rating}
                        onChange={(e) => handleReviewChange(index, 'rating', e.target.value)}
                        placeholder="Rating (1-5)"
                        min="1"
                        max="5"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleSaveReviews} className="bg-green-500 hover:bg-green-600">
                  <FaSave className="mr-2" /> Save Reviews
                </Button>
              </div>

              {/* Videos */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Videos</h3>
                  <Button type="button" onClick={addVideo} className="bg-blue-500 hover:bg-blue-600">
                    <FaPlus className="mr-2" /> Add Video
                  </Button>
                </div>
                {videos.map((video, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`video_url_${index}`}>Video URL</Label>
                      <Input
                        id={`video_url_${index}`}
                        value={video.video_url}
                        onChange={(e) => handleVideoChange(index, 'video_url', e.target.value)}
                        placeholder="e.g., https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleSaveVideos} className="bg-green-500 hover:bg-green-600">
                  <FaSave className="mr-2" /> Save Videos
                </Button>
              </div>

              <div className="flex gap-4 mt-6">
                <Button type="submit" className="bg-gradient-primary">
                  <FaSave className="mr-2" /> Save All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/doctors')}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <FaTimes className="mr-2" /> Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Portfolio Saved</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">Doctor portfolio has been successfully saved.</p>
            <DialogFooter>
              <Button
                type="button"
                className="bg-gradient-primary"
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  navigate('/doctors');
                }}
              >
                Back to Doctors
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddPortfolio;