// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, FileText, ToggleRight } from "lucide-react";

// export default function Patients() {
//   const [searchId, setSearchId] = useState("");
//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch patients data from API
//   useEffect(() => {
//     const fetchPatients = async () => {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await fetch("https://api.onestepmedi.com:8000/patient/all", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch patients data");
//         }

//         const data = await response.json();
//         // Extract patients array from response
//         const patientsArray = Array.isArray(data.patients) ? data.patients : [];
//         setPatients(patientsArray);
//         setFilteredPatients(patientsArray);
//       } catch (err) {
//         setError(err.message);
//         setPatients([]);
//         setFilteredPatients([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   // Handle search functionality
//   const handleSearch = () => {
//     if (searchId.trim()) {
//       setFilteredPatients(
//         patients.filter((patient) =>
//           patient.patient_id.toLowerCase().includes(searchId.toLowerCase())
//         )
//       );
//     } else {
//       setFilteredPatients(patients);
//     }
//   };

//   // Calculate age from DOB
//   const calculateAge = (dob) => {
//     if (!dob) return "N/A";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (patient) => {
//     const newStatus = patient.status === "active" ? "inactive" : "active";
    
//     if (newStatus === "inactive") {
//       const confirmInactive = window.confirm(
//         `Are you sure you want to mark patient ${patient.name} (ID: ${patient.patient_id}) as inactive?`
//       );
//       if (!confirmInactive) return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch("https://api.onestepmedi.com:8000/superadmin/users/status", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           user_id: patient.patient_id,
//           status: newStatus,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update patient status");
//       }

//       // Update patient status in state
//       setPatients((prev) =>
//         prev.map((p) =>
//           p.patient_id === patient.patient_id ? { ...p, status: newStatus } : p
//         )
//       );
//       setFilteredPatients((prev) =>
//         prev.map((p) =>
//           p.patient_id === patient.patient_id ? { ...p, status: newStatus } : p
//         )
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Patients Management
//         </h1>
//       </div>

//       {/* Search */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Search Patient</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by Patient ID..."
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Button onClick={handleSearch} className="bg-gradient-primary">
//               Search
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Patients Table */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Patients List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading && <p>Loading patients...</p>}
//           {error && <p className="text-red-500">{error}</p>}
//           {!isLoading && !error && filteredPatients.length === 0 && (
//             <p>No patients found.</p>
//           )}
//           {!isLoading && !error && filteredPatients.length > 0 && (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Patient ID</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Age</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Phone</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredPatients.map((patient, index) => (
//                   <TableRow 
//                     key={patient.patient_id || `patient-${index}`}
//                     className={patient.status === "Inactive" ? "opacity-50" : ""}
//                   >
//                     <TableCell className="font-medium">{patient.patient_id || "N/A"}</TableCell>
//                     <TableCell>{patient.name || "N/A"}</TableCell>
//                     <TableCell>{calculateAge(patient.dob)}</TableCell>
//                     <TableCell>{patient.email || "N/A"}</TableCell>
//                     <TableCell>{patient.phone_number || "N/A"}</TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => navigate(`/patients/${patient.patient_id || `patient-${index}`}/details`)}
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           Details
//                         </Button>
//                         {/* <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => navigate(`/patients/${patient.patient_id || `patient-${index}`}/reports`)}
//                         >
//                           <FileText className="w-4 h-4 mr-1" />
//                           Reports
//                         </Button> */}
//                         <Button
//                           size="sm"
//                           variant={patient.status === "Active" ? "default" : "outline"}
//                           onClick={() => handleStatusToggle(patient)}
//                           className={patient.status === "Active" ? "bg-green-500 hover:bg-green-600" : ""}
//                         >
//                           <ToggleRight className="w-4 h-4 mr-1" />
//                           {patient.status || "Inactive"}
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, FileText, ToggleRight } from "lucide-react";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch patients data from API
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("https://api.onestepmedi.com:8000/patient/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients data");
        }

        const data = await response.json();
        // Extract patients array from response
        const patientsArray = Array.isArray(data.patients) ? data.patients : [];
        setPatients(patientsArray);
        setFilteredPatients(patientsArray);
      } catch (err) {
        setError(err.message);
        setPatients([]);
        setFilteredPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle search functionality
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = patients.filter((patient) =>
        patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calculateAge(patient.dob).toString().includes(searchTerm) ||
        patient.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
      if (filtered.length === 0) {
        setError("No patient found with the provided criteria");
      } else {
        setError(null);
      }
    } else {
      setFilteredPatients(patients);
      setError(null);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (patient) => {
    const newStatus = patient.status === "active" ? "inactive" : "active";
    
    if (newStatus === "inactive") {
      const confirmInactive = window.confirm(
        `Are you sure you want to mark patient ${patient.name} (ID: ${patient.patient_id}) as inactive?`
      );
      if (!confirmInactive) return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://api.onestepmedi.com:8000/superadmin/users/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: patient.patient_id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient status");
      }

      // Update patient status in state
      setPatients((prev) =>
        prev.map((p) =>
          p.patient_id === patient.patient_id ? { ...p, status: newStatus } : p
        )
      );
      setFilteredPatients((prev) =>
        prev.map((p) =>
          p.patient_id === patient.patient_id ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Patients Management
        </h1>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Search Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Patient ID, Name, Age, or Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="bg-gradient-primary">
                Search
              </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Patients List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading patients...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && filteredPatients.length === 0 && (
            <p>No patients found.</p>
          )}
          {!isLoading && !error && filteredPatients.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <TableRow 
                    key={patient.patient_id || `patient-${index}`}
                    className={patient.status === "inactive" ? "opacity-50" : ""}
                  >
                    <TableCell className="font-medium">{patient.patient_id || "N/A"}</TableCell>
                    <TableCell>{patient.name || "N/A"}</TableCell>
                    <TableCell>{calculateAge(patient.dob)}</TableCell>
                    <TableCell>{patient.email || "N/A"}</TableCell>
                    <TableCell>{patient.phone_number || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/patients/${patient.patient_id || `patient-${index}`}/details`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant={patient.status === "active" ? "default" : "outline"}
                          onClick={() => handleStatusToggle(patient)}
                          className={patient.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          <ToggleRight className="w-4 h-4 mr-1" />
                          {patient.status || "inactive"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}