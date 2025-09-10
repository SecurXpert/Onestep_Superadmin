// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, FileText, Calendar, DollarSign } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function Doctors() {
//   const [searchId, setSearchId] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
//   const [isSpecializationDialogOpen, setIsSpecializationDialogOpen] = useState(false);
//   const [isAddSlotsDialogOpen, setIsAddSlotsDialogOpen] = useState(false);
//   const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false);
//   const [isPaymentSummaryDialogOpen, setIsPaymentSummaryDialogOpen] = useState(false);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [paymentSummaries, setPaymentSummaries] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [formData, setFormData] = useState({
//     doctor_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     specialization_id: "",
//     experience_years: "",
//     address: "",
//     consultation_fee: "",
//     degree: "",
//     about: "",
//     work_location: "",
//     clinic_location: "",
//     dm_amount: "",
//     image: null,
//   });
//   const [specializationFormData, setSpecializationFormData] = useState({
//     specialization_name: "",
//     emergency_consultation_fee: 0,
//   });
//   const [slotFile, setSlotFile] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [slotsData, setSlotsData] = useState({ available_slots: [], booked_slots: [], doctor_id: "", date: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/doctors/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch doctors");
//         }
//         const data = await response.json();
//         setDoctors(data);
//         setFilteredDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setError(error.message || "Failed to fetch doctors");
//         setDoctors([]);
//         setFilteredDoctors([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchSpecializations = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/specializations/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch specializations");
//         }
//         const data = await response.json();
//         setSpecializations(data);
//       } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setError(error.message || "Failed to fetch specializations");
//         setSpecializations([]);
//       }
//     };

//     fetchDoctors();
//     fetchSpecializations();
//   }, []);

//   const handleSearch = () => {
//     if (searchId.trim()) {
//       setFilteredDoctors(
//         doctors.filter((doc) =>
//           doc.doctor_id.toLowerCase().includes(searchId.toLowerCase())
//         )
//       );
//     } else {
//       setFilteredDoctors(doctors);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSpecializationInputChange = (e) => {
//     const { name, value } = e.target;
//     setSpecializationFormData((prev) => ({
//       ...prev,
//       [name]: name === "emergency_consultation_fee" ? Number(value) : value,
//     }));
//   };

//   const handleSlotFileChange = (e) => {
//     setSlotFile(e.target.files ? e.target.files[0] : null);
//   };

//   const handleSpecializationChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       specialization_id: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== "") {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch("https://api.onestepmedi.com:8000/doctors/admin-create-doctor", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to create doctor");
//       }

//       const newDoctor = await response.json();
//       setDoctors([...doctors, newDoctor]);
//       setFilteredDoctors([...doctors, newDoctor]);
//       setIsDoctorDialogOpen(false);
//       setFormData({
//         doctor_name: "",
//         email: "",
//         phone: "",
//         password: "",
//         specialization_id: "",
//         experience_years: "",
//         address: "",
//         consultation_fee: "",
//         degree: "",
//         about: "",
//         work_location: "",
//         clinic_location: "",
//         dm_amount: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       setError(error.message || "Failed to create doctor");
//     }
//   };

//   const handleSpecializationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       if (specializationFormData.emergency_consultation_fee < 0) {
//         setError("Emergency consultation fee cannot be negative");
//         return;
//       }

//       const response = await fetch("https://api.onestepmedi.com:8000/specializations/add", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           specialization_name: specializationFormData.specialization_name,
//           emergency_consultation_fee: specializationFormData.emergency_consultation_fee,
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to add specialization");
//       }

//       await response.json();
//       setIsSpecializationDialogOpen(false);
//       setSpecializationFormData({
//         specialization_name: "",
//         emergency_consultation_fee: 0,
//       });
//     } catch (error) {
//       console.error("Error adding specialization:", error);
//       setError(error.message || "Failed to add specialization");
//     }
//   };

//   const handleAddSlotsSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }
//       if (!slotFile) {
//         throw new Error("No file selected");
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append("file", slotFile);

//       const response = await fetch("https://api.onestepmedi.com:8000/slots/upload-excel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to upload slots");
//       }

//       setIsAddSlotsDialogOpen(false);
//       setSlotFile(null);
//     } catch (error) {
//       console.error("Error uploading slots:", error);
//       setError(error.message || "Failed to upload slots");
//     }
//   };

//   const handleViewSlots = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       const response = await fetch(
//         `https://api.onestepmedi.com:8000/slots/available-slots?preferred_date=${formattedDate}&doctor_id=${doctorId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch slots");
//       }

//       const data = await response.json();
//       setSlotsData(data);
//       setIsViewSlotsDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setError(error.message || "Failed to fetch slots");
//     }
//   };

//   const handlePaymentSummary = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch payment summaries");
//       }

//       const data = await response.json();
//       const summaries = Array.isArray(data.summary) ? data.summary : [data.summary];
//       const transformedSummaries = summaries.map((summary) => ({
//         ...summary,
//         total_appointments:
//           typeof summary.total_appointments === "object"
//             ? summary.total_appointments.total
//             : summary.total_appointments,
//         confirmed_appointments:
//           typeof summary.confirmed_appointments === "object"
//             ? summary.confirmed_appointments.total
//             : summary.confirmed_appointments,
//         total_payment_expected:
//           typeof summary.total_payment_expected === "object"
//             ? summary.total_payment_expected.total
//             : summary.total_payment_expected,
//         amount_transferred:
//           typeof summary.amount_transferred === "object"
//             ? summary.amount_transferred.total
//             : summary.amount_transferred,
//         amount_due:
//           typeof summary.amount_due === "object"
//             ? summary.amount_due.total
//             : summary.amount_due,
//       }));
//       setPaymentSummaries(transformedSummaries);
//       setIsPaymentSummaryDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching payment summaries:", error);
//       setError(error.message || "Failed to fetch payment summaries");
//       setPaymentSummaries([]);
//     }
//   };

//   if (isLoading) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;
//   if (error) return <div className="text-red-600 text-center p-6 text-lg">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Doctors Management
//         </h1>
//         <div className="flex gap-2">
//           <Button onClick={() => setIsDoctorDialogOpen(true)} className="bg-gradient-primary">
//             Add Doctor
//           </Button>
//           <Button onClick={() => navigate('/addportfolio')} className="bg-gradient-primary">
//             Add Doctor Portfolio
//           </Button>
//           <Button onClick={() => setIsSpecializationDialogOpen(true)} className="bg-gradient-primary">
//             Add Specialization
//           </Button>
//         </div>
//       </div>

//       {/* Add Doctor Dialog */}
//       <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Add New Doctor</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="doctor_name">Doctor Name *</Label>
//                 <Input
//                   id="doctor_name"
//                   name="doctor_name"
//                   value={formData.doctor_name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone *</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password *</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="specialization_id">Specialization *</Label>
//                 <Select
//                   name="specialization_id"
//                   value={formData.specialization_id}
//                   onValueChange={handleSpecializationChange}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select specialization" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {specializations.map((spec) => (
//                       <SelectItem key={spec.id} value={spec.id.toString()}>
//                         {spec.specialization_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="experience_years">Experience Years *</Label>
//                 <Input
//                   id="experience_years"
//                   name="experience_years"
//                   type="number"
//                   value={formData.experience_years}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="address">Address *</Label>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="consultation_fee">Consultation Fee *</Label>
//                 <Input
//                   id="consultation_fee"
//                   name="consultation_fee"
//                   type="number"
//                   value={formData.consultation_fee}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="degree">Degree *</Label>
//                 <Input
//                   id="degree"
//                   name="degree"
//                   value={formData.degree}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="about">About *</Label>
//                 <Input
//                   id="about"
//                   name="about"
//                   value={formData.about}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="work_location">Work Location *</Label>
//                 <Input
//                   id="work_location"
//                   name="work_location"
//                   value={formData.work_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="clinic_location">Clinic Location *</Label>
//                 <Input
//                   id="clinic_location"
//                   name="clinic_location"
//                   value={formData.clinic_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dm_amount">DM Amount *</Label>
//                 <Input
//                   id="dm_amount"
//                   name="dm_amount"
//                   value={formData.dm_amount}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="image">Image</Label>
//                 <Input
//                   id="image"
//                   name="image"
//                   type="file"
//                   onChange={handleInputChange}
//                   accept="image/*"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsDoctorDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Doctor
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Specialization Dialog */}
//       <Dialog open={isSpecializationDialogOpen} onOpenChange={setIsSpecializationDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add New Specialization</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSpecializationSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="specialization_name">Specialization Name *</Label>
//               <Input
//                 id="specialization_name"
//                 name="specialization_name"
//                 value={specializationFormData.specialization_name}
//                 onChange={handleSpecializationInputChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="emergency_consultation_fee">Emergency Consultation Fee *</Label>
//               <Input
//                 id="emergency_consultation_fee"
//                 name="emergency_consultation_fee"
//                 type="number"
//                 value={specializationFormData.emergency_consultation_fee}
//                 onChange={handleSpecializationInputChange}
//                 required
//                 min="0"
//                 step="1"
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsSpecializationDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Specialization
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Slots Dialog */}
//       <Dialog open={isAddSlotsDialogOpen} onOpenChange={setIsAddSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add Slots for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddSlotsSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="slot_file">Upload Excel File *</Label>
//               <Input
//                 id="slot_file"
//                 name="slot_file"
//                 type="file"
//                 onChange={handleSlotFileChange}
//                 accept=".xlsx,.xls"
//                 required
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsAddSlotsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Upload Slots
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* View Slots Dialog */}
//       <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>View Slots for Doctor {slotsData.doctor_id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Select Date</Label>
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => {
//                   setSelectedDate(date);
//                   if (selectedDoctorId) {
//                     handleViewSlots(selectedDoctorId);
//                   }
//                 }}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold">Available Slots</h3>
//                 {slotsData.available_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.available_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No available slots</p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold">Booked Slots</h3>
//                 {slotsData.booked_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.booked_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No booked slots</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Payment Summary Dialog */}
//       <Dialog open={isPaymentSummaryDialogOpen} onOpenChange={setIsPaymentSummaryDialogOpen}>
//         <DialogContent className="sm:max-w-[1000px]">
//           <DialogHeader>
//             <DialogTitle>Payment Summaries for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {paymentSummaries.length > 0 ? (
//               <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
//                 <Table className="min-w-full">
//                   <TableHeader className="sticky top-0 bg-gray-100">
//                     <TableRow>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Doctor Name</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialization</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Consultation Fee</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Confirmed Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Payment Expected</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Transferred</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Due</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {paymentSummaries.map((summary, index) => (
//                       <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.doctor_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.specialization.specialization_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.consultation_fee}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.total_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.confirmed_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.total_payment_expected || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_transferred || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_due || "0"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <p className="text-gray-600 text-center">No payment summaries available</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsPaymentSummaryDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Search */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Search Doctor</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by Doctor ID..."
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

//       {/* Doctors Table */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Doctors List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Specialization</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredDoctors.map((doctor) => (
//                 <TableRow key={doctor.doctor_id}>
//                   <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
//                   <TableCell>{doctor.doctor_name}</TableCell>
//                   <TableCell>{doctor.specialization_name}</TableCell>
//                   <TableCell>{doctor.work_location}</TableCell>
//                   <TableCell>
//                     <Badge variant="default">Active</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/profile`)}
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         Profile
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/portfolio`)}
//                       >
//                         <FileText className="w-4 h-4 mr-1" />
//                         Portfolio
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           setIsAddSlotsDialogOpen(true);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         Add Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handleViewSlots(doctor.doctor_id);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         View Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handlePaymentSummary(doctor.doctor_id);
//                         }}
//                       >
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         Payment Summary
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }































// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, FileText, Calendar, DollarSign } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function Doctors() {
//   const [searchId, setSearchId] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
//   const [isSpecializationDialogOpen, setIsSpecializationDialogOpen] = useState(false);
//   const [isAddSlotsDialogOpen, setIsAddSlotsDialogOpen] = useState(false);
//   const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false);
//   const [isPaymentSummaryDialogOpen, setIsPaymentSummaryDialogOpen] = useState(false);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [paymentSummaries, setPaymentSummaries] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [formData, setFormData] = useState({
//     doctor_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     specialization_id: "",
//     experience_years: "",
//     address: "",
//     consultation_fee: "",
//     degree: "",
//     about: "",
//     work_location: "",
//     clinic_location: "",
//     dm_amount: "",
//     image: null,
//   });
//   const [specializationFormData, setSpecializationFormData] = useState({
//     specialization_name: "",
//     emergency_consultation_fee: 0,
//   });
//   const [slotFile, setSlotFile] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [slotsData, setSlotsData] = useState({ available_slots: [], booked_slots: [], doctor_id: "", date: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/doctors/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch doctors");
//         }
//         const data = await response.json();
//         setDoctors(data);
//         setFilteredDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setError(error.message || "Failed to fetch doctors");
//         setDoctors([]);
//         setFilteredDoctors([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchSpecializations = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/specializations/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch specializations");
//         }
//         const data = await response.json();
//         setSpecializations(data);
//       } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setError(error.message || "Failed to fetch specializations");
//         setSpecializations([]);
//       }
//     };

//     fetchDoctors();
//     fetchSpecializations();
//   }, []);

//   const handleSearch = () => {
//     if (searchId.trim()) {
//       const filtered = doctors.filter((doc) =>
//         doc.doctor_id.toLowerCase().includes(searchId.toLowerCase())
//       );
//       setFilteredDoctors(filtered);
//       if (filtered.length === 0) {
//         setError("No doctor found with the provided ID");
//       } else {
//         setError(null);
//       }
//     } else {
//       setFilteredDoctors(doctors);
//       setError(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSpecializationInputChange = (e) => {
//     const { name, value } = e.target;
//     setSpecializationFormData((prev) => ({
//       ...prev,
//       [name]: name === "emergency_consultation_fee" ? Number(value) : value,
//     }));
//   };

//   const handleSlotFileChange = (e) => {
//     setSlotFile(e.target.files ? e.target.files[0] : null);
//   };

//   const handleSpecializationChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       specialization_id: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== "") {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch("https://api.onestepmedi.com:8000/doctors/admin-create-doctor", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to create doctor");
//       }

//       const newDoctor = await response.json();
//       setDoctors([...doctors, newDoctor]);
//       setFilteredDoctors([...doctors, newDoctor]);
//       setIsDoctorDialogOpen(false);
//       setFormData({
//         doctor_name: "",
//         email: "",
//         phone: "",
//         password: "",
//         specialization_id: "",
//         experience_years: "",
//         address: "",
//         consultation_fee: "",
//         degree: "",
//         about: "",
//         work_location: "",
//         clinic_location: "",
//         dm_amount: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       setError(error.message || "Failed to create doctor");
//     }
//   };

//   const handleSpecializationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       if (specializationFormData.emergency_consultation_fee < 0) {
//         setError("Emergency consultation fee cannot be negative");
//         return;
//       }

//       const response = await fetch("https://api.onestepmedi.com:8000/specializations/add", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           specialization_name: specializationFormData.specialization_name,
//           emergency_consultation_fee: specializationFormData.emergency_consultation_fee,
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to add specialization");
//       }

//       await response.json();
//       setIsSpecializationDialogOpen(false);
//       setSpecializationFormData({
//         specialization_name: "",
//         emergency_consultation_fee: 0,
//       });
//     } catch (error) {
//       console.error("Error adding specialization:", error);
//       setError(error.message || "Failed to add specialization");
//     }
//   };

//   const handleAddSlotsSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }
//       if (!slotFile) {
//         throw new Error("No file selected");
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append("file", slotFile);

//       const response = await fetch("https://api.onestepmedi.com:8000/slots/upload-excel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to upload slots");
//       }

//       setIsAddSlotsDialogOpen(false);
//       setSlotFile(null);
//     } catch (error) {
//       console.error("Error uploading slots:", error);
//       setError(error.message || "Failed to upload slots");
//     }
//   };

//   const handleViewSlots = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       const response = await fetch(
//         `https://api.onestepmedi.com:8000/slots/available-slots?preferred_date=${formattedDate}&doctor_id=${doctorId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch slots");
//       }

//       const data = await response.json();
//       setSlotsData(data);
//       setIsViewSlotsDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setError(error.message || "Failed to fetch slots");
//     }
//   };

//   const handlePaymentSummary = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch payment summaries");
//       }

//       const data = await response.json();
//       const summaries = Array.isArray(data.summary) ? data.summary : [data.summary];
//       const transformedSummaries = summaries.map((summary) => ({
//         ...summary,
//         total_appointments:
//           typeof summary.total_appointments === "object"
//             ? summary.total_appointments.total
//             : summary.total_appointments,
//         confirmed_appointments:
//           typeof summary.confirmed_appointments === "object"
//             ? summary.confirmed_appointments.total
//             : summary.confirmed_appointments,
//         total_payment_expected:
//           typeof summary.total_payment_expected === "object"
//             ? summary.total_payment_expected.total
//             : summary.total_payment_expected,
//         amount_transferred:
//           typeof summary.amount_transferred === "object"
//             ? summary.amount_transferred.total
//             : summary.amount_transferred,
//         amount_due:
//           typeof summary.amount_due === "object"
//             ? summary.amount_due.total
//             : summary.amount_due,
//       }));
//       setPaymentSummaries(transformedSummaries);
//       setIsPaymentSummaryDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching payment summaries:", error);
//       setError(error.message || "Failed to fetch payment summaries");
//       setPaymentSummaries([]);
//     }
//   };

//   if (isLoading) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Doctors Management
//         </h1>
//         <div className="flex gap-2">
//           <Button onClick={() => setIsDoctorDialogOpen(true)} className="bg-gradient-primary">
//             Add Doctor
//           </Button>
//           <Button onClick={() => navigate('/addportfolio')} className="bg-gradient-primary">
//             Add Doctor Portfolio
//           </Button>
//           <Button onClick={() => setIsSpecializationDialogOpen(true)} className="bg-gradient-primary">
//             Add Specialization
//           </Button>
//         </div>
//       </div>

//       {/* Add Doctor Dialog */}
//       <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Add New Doctor</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="doctor_name">Doctor Name *</Label>
//                 <Input
//                   id="doctor_name"
//                   name="doctor_name"
//                   value={formData.doctor_name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone *</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password *</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="specialization_id">Specialization *</Label>
//                 <Select
//                   name="specialization_id"
//                   value={formData.specialization_id}
//                   onValueChange={handleSpecializationChange}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select specialization" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {specializations.map((spec) => (
//                       <SelectItem key={spec.id} value={spec.id.toString()}>
//                         {spec.specialization_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="experience_years">Experience Years *</Label>
//                 <Input
//                   id="experience_years"
//                   name="experience_years"
//                   type="number"
//                   value={formData.experience_years}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="address">Address *</Label>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="consultation_fee">Consultation Fee *</Label>
//                 <Input
//                   id="consultation_fee"
//                   name="consultation_fee"
//                   type="number"
//                   value={formData.consultation_fee}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="degree">Degree *</Label>
//                 <Input
//                   id="degree"
//                   name="degree"
//                   value={formData.degree}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="about">About *</Label>
//                 <Input
//                   id="about"
//                   name="about"
//                   value={formData.about}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="work_location">Work Location *</Label>
//                 <Input
//                   id="work_location"
//                   name="work_location"
//                   value={formData.work_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="clinic_location">Clinic Location *</Label>
//                 <Input
//                   id="clinic_location"
//                   name="clinic_location"
//                   value={formData.clinic_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dm_amount">DM Amount *</Label>
//                 <Input
//                   id="dm_amount"
//                   name="dm_amount"
//                   value={formData.dm_amount}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="image">Image</Label>
//                 <Input
//                   id="image"
//                   name="image"
//                   type="file"
//                   onChange={handleInputChange}
//                   accept="image/*"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsDoctorDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Doctor
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Specialization Dialog */}
//       <Dialog open={isSpecializationDialogOpen} onOpenChange={setIsSpecializationDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add New Specialization</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSpecializationSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="specialization_name">Specialization Name *</Label>
//               <Input
//                 id="specialization_name"
//                 name="specialization_name"
//                 value={specializationFormData.specialization_name}
//                 onChange={handleSpecializationInputChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="emergency_consultation_fee">Emergency Consultation Fee *</Label>
//               <Input
//                 id="emergency_consultation_fee"
//                 name="emergency_consultation_fee"
//                 type="number"
//                 value={specializationFormData.emergency_consultation_fee}
//                 onChange={handleSpecializationInputChange}
//                 required
//                 min="0"
//                 step="1"
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsSpecializationDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Specialization
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Slots Dialog */}
//       <Dialog open={isAddSlotsDialogOpen} onOpenChange={setIsAddSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add Slots for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddSlotsSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="slot_file">Upload Excel File *</Label>
//               <Input
//                 id="slot_file"
//                 name="slot_file"
//                 type="file"
//                 onChange={handleSlotFileChange}
//                 accept=".xlsx,.xls"
//                 required
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsAddSlotsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Upload Slots
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* View Slots Dialog */}
//       <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>View Slots for Doctor {slotsData.doctor_id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Select Date</Label>
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => {
//                   setSelectedDate(date);
//                   if (selectedDoctorId) {
//                     handleViewSlots(selectedDoctorId);
//                   }
//                 }}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold">Available Slots</h3>
//                 {slotsData.available_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.available_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No available slots</p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold">Booked Slots</h3>
//                 {slotsData.booked_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.booked_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No booked slots</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Payment Summary Dialog */}
//       <Dialog open={isPaymentSummaryDialogOpen} onOpenChange={setIsPaymentSummaryDialogOpen}>
//         <DialogContent className="sm:max-w-[1000px]">
//           <DialogHeader>
//             <DialogTitle>Payment Summaries for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {paymentSummaries.length > 0 ? (
//               <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
//                 <Table className="min-w-full">
//                   <TableHeader className="sticky top-0 bg-gray-100">
//                     <TableRow>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Doctor Name</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialization</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Consultation Fee</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Confirmed Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Payment Expected</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Transferred</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Due</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {paymentSummaries.map((summary, index) => (
//                       <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.doctor_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.specialization.specialization_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.consultation_fee}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.total_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.confirmed_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.total_payment_expected || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_transferred || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_due || "0"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <p className="text-gray-600 text-center">No payment summaries available</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsPaymentSummaryDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Search */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Search Doctor</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by Doctor ID..."
//                   value={searchId}
//                   onChange={(e) => setSearchId(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button onClick={handleSearch} className="bg-gradient-primary">
//                 Search
//               </Button>
//             </div>
//             {error && <p className="text-red-600 text-sm">{error}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Doctors Table */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Doctors List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Specialization</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredDoctors.map((doctor) => (
//                 <TableRow key={doctor.doctor_id}>
//                   <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
//                   <TableCell>{doctor.doctor_name}</TableCell>
//                   <TableCell>{doctor.specialization_name}</TableCell>
//                   <TableCell>{doctor.work_location}</TableCell>
//                   <TableCell>
//                     <Badge variant="default">Active</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/profile`)}
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         Profile
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/portfolio`)}
//                       >
//                         <FileText className="w-4 h-4 mr-1" />
//                         Portfolio
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           setIsAddSlotsDialogOpen(true);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         Add Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handleViewSlots(doctor.doctor_id);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         View Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handlePaymentSummary(doctor.doctor_id);
//                         }}
//                       >
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         Payment Summary
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, FileText, Calendar, DollarSign } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function Doctors() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
//   const [isSpecializationDialogOpen, setIsSpecializationDialogOpen] = useState(false);
//   const [isAddSlotsDialogOpen, setIsAddSlotsDialogOpen] = useState(false);
//   const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false);
//   const [isPaymentSummaryDialogOpen, setIsPaymentSummaryDialogOpen] = useState(false);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [paymentSummaries, setPaymentSummaries] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [formData, setFormData] = useState({
//     doctor_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     specialization_id: "",
//     experience_years: "",
//     address: "",
//     consultation_fee: "",
//     degree: "",
//     about: "",
//     work_location: "",
//     clinic_location: "",
//     dm_amount: "",
//     image: null,
//   });
//   const [specializationFormData, setSpecializationFormData] = useState({
//     specialization_name: "",
//     emergency_consultation_fee: 0,
//   });
//   const [slotFile, setSlotFile] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [slotsData, setSlotsData] = useState({ available_slots: [], booked_slots: [], doctor_id: "", date: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/doctors/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch doctors");
//         }
//         const data = await response.json();
//         setDoctors(data);
//         setFilteredDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setError(error.message || "Failed to fetch doctors");
//         setDoctors([]);
//         setFilteredDoctors([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchSpecializations = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/specializations/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch specializations");
//         }
//         const data = await response.json();
//         setSpecializations(data);
//       } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setError(error.message || "Failed to fetch specializations");
//         setSpecializations([]);
//       }
//     };

//     fetchDoctors();
//     fetchSpecializations();
//   }, []);

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       const filtered = doctors.filter((doc) =>
//         doc.doctor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.specialization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.work_location.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredDoctors(filtered);
//       if (filtered.length === 0) {
//         setError("No doctor found with the provided criteria");
//       } else {
//         setError(null);
//       }
//     } else {
//       setFilteredDoctors(doctors);
//       setError(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSpecializationInputChange = (e) => {
//     const { name, value } = e.target;
//     setSpecializationFormData((prev) => ({
//       ...prev,
//       [name]: name === "emergency_consultation_fee" ? Number(value) : value,
//     }));
//   };

//   const handleSlotFileChange = (e) => {
//     setSlotFile(e.target.files ? e.target.files[0] : null);
//   };

//   const handleSpecializationChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       specialization_id: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== "") {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch("https://api.onestepmedi.com:8000/doctors/admin-create-doctor", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to create doctor");
//       }

//       const newDoctor = await response.json();
//       setDoctors([...doctors, newDoctor]);
//       setFilteredDoctors([...doctors, newDoctor]);
//       setIsDoctorDialogOpen(false);
//       setFormData({
//         doctor_name: "",
//         email: "",
//         phone: "",
//         password: "",
//         specialization_id: "",
//         experience_years: "",
//         address: "",
//         consultation_fee: "",
//         degree: "",
//         about: "",
//         work_location: "",
//         clinic_location: "",
//         dm_amount: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       setError(error.message || "Failed to create doctor");
//     }
//   };

//   const handleSpecializationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       if (specializationFormData.emergency_consultation_fee < 0) {
//         setError("Emergency consultation fee cannot be negative");
//         return;
//       }

//       const response = await fetch("https://api.onestepmedi.com:8000/specializations/add", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           specialization_name: specializationFormData.specialization_name,
//           emergency_consultation_fee: specializationFormData.emergency_consultation_fee,
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to add specialization");
//       }

//       await response.json();
//       setIsSpecializationDialogOpen(false);
//       setSpecializationFormData({
//         specialization_name: "",
//         emergency_consultation_fee: 0,
//       });
//     } catch (error) {
//       console.error("Error adding specialization:", error);
//       setError(error.message || "Failed to add specialization");
//     }
//   };

//   const handleAddSlotsSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }
//       if (!slotFile) {
//         throw new Error("No file selected");
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append("file", slotFile);

//       const response = await fetch("https://api.onestepmedi.com:8000/slots/upload-excel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to upload slots");
//       }

//       setIsAddSlotsDialogOpen(false);
//       setSlotFile(null);
//     } catch (error) {
//       console.error("Error uploading slots:", error);
//       setError(error.message || "Failed to upload slots");
//     }
//   };

//   const handleViewSlots = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       const response = await fetch(
//         `https://api.onestepmedi.com:8000/slots/available-slots?preferred_date=${formattedDate}&doctor_id=${doctorId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch slots");
//       }

//       const data = await response.json();
//       setSlotsData(data);
//       setIsViewSlotsDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setError(error.message || "Failed to fetch slots");
//     }
//   };

//   const handlePaymentSummary = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch payment summaries");
//       }

//       const data = await response.json();
//       const summaries = Array.isArray(data.summary) ? data.summary : [data.summary];
//       const transformedSummaries = summaries.map((summary) => ({
//         ...summary,
//         total_appointments:
//           typeof summary.total_appointments === "object"
//             ? summary.total_appointments.total
//             : summary.total_appointments,
//         confirmed_appointments:
//           typeof summary.confirmed_appointments === "object"
//             ? summary.confirmed_appointments.total
//             : summary.confirmed_appointments,
//         total_payment_expected:
//           typeof summary.total_payment_expected === "object"
//             ? summary.total_payment_expected.total
//             : summary.total_payment_expected,
//         amount_transferred:
//           typeof summary.amount_transferred === "object"
//             ? summary.amount_transferred.total
//             : summary.amount_transferred,
//         amount_due:
//           typeof summary.amount_due === "object"
//             ? summary.amount_due.total
//             : summary.amount_due,
//       }));
//       setPaymentSummaries(transformedSummaries);
//       setIsPaymentSummaryDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching payment summaries:", error);
//       setError(error.message || "Failed to fetch payment summaries");
//       setPaymentSummaries([]);
//     }
//   };

//   if (isLoading) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Doctors Management
//         </h1>
//         <div className="flex gap-2">
//           <Button onClick={() => setIsDoctorDialogOpen(true)} className="bg-gradient-primary">
//             Add Doctor
//           </Button>
//           <Button onClick={() => navigate('/addportfolio')} className="bg-gradient-primary">
//             Add Doctor Portfolio
//           </Button>
//           <Button onClick={() => setIsSpecializationDialogOpen(true)} className="bg-gradient-primary">
//             Add Specialization
//           </Button>
//         </div>
//       </div>

//       {/* Add Doctor Dialog */}
//       <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Add New Doctor</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="doctor_name">Doctor Name *</Label>
//                 <Input
//                   id="doctor_name"
//                   name="doctor_name"
//                   value={formData.doctor_name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone *</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password *</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="specialization_id">Specialization *</Label>
//                 <Select
//                   name="specialization_id"
//                   value={formData.specialization_id}
//                   onValueChange={handleSpecializationChange}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select specialization" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {specializations.map((spec) => (
//                       <SelectItem key={spec.id} value={spec.id.toString()}>
//                         {spec.specialization_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="experience_years">Experience Years *</Label>
//                 <Input
//                   id="experience_years"
//                   name="experience_years"
//                   type="number"
//                   value={formData.experience_years}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="address">Address *</Label>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="consultation_fee">Consultation Fee *</Label>
//                 <Input
//                   id="consultation_fee"
//                   name="consultation_fee"
//                   type="number"
//                   value={formData.consultation_fee}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="degree">Degree *</Label>
//                 <Input
//                   id="degree"
//                   name="degree"
//                   value={formData.degree}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="about">About *</Label>
//                 <Input
//                   id="about"
//                   name="about"
//                   value={formData.about}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="work_location">Work Location *</Label>
//                 <Input
//                   id="work_location"
//                   name="work_location"
//                   value={formData.work_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="clinic_location">Clinic Location *</Label>
//                 <Input
//                   id="clinic_location"
//                   name="clinic_location"
//                   value={formData.clinic_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dm_amount">DM Amount *</Label>
//                 <Input
//                   id="dm_amount"
//                   name="dm_amount"
//                   value={formData.dm_amount}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="image">Image</Label>
//                 <Input
//                   id="image"
//                   name="image"
//                   type="file"
//                   onChange={handleInputChange}
//                   accept="image/*"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsDoctorDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Doctor
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Specialization Dialog */}
//       <Dialog open={isSpecializationDialogOpen} onOpenChange={setIsSpecializationDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add New Specialization</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSpecializationSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="specialization_name">Specialization Name *</Label>
//               <Input
//                 id="specialization_name"
//                 name="specialization_name"
//                 value={specializationFormData.specialization_name}
//                 onChange={handleSpecializationInputChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="emergency_consultation_fee">Emergency Consultation Fee *</Label>
//               <Input
//                 id="emergency_consultation_fee"
//                 name="emergency_consultation_fee"
//                 type="number"
//                 value={specializationFormData.emergency_consultation_fee}
//                 onChange={handleSpecializationInputChange}
//                 required
//                 min="0"
//                 step="1"
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsSpecializationDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Specialization
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Slots Dialog */}
//       <Dialog open={isAddSlotsDialogOpen} onOpenChange={setIsAddSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add Slots for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddSlotsSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="slot_file">Upload Excel File *</Label>
//               <Input
//                 id="slot_file"
//                 name="slot_file"
//                 type="file"
//                 onChange={handleSlotFileChange}
//                 accept=".xlsx,.xls"
//                 required
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsAddSlotsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Upload Slots
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* View Slots Dialog */}
//       <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>View Slots for Doctor {slotsData.doctor_id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Select Date</Label>
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => {
//                   setSelectedDate(date);
//                   if (selectedDoctorId) {
//                     handleViewSlots(selectedDoctorId);
//                   }
//                 }}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold">Available Slots</h3>
//                 {slotsData.available_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.available_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No available slots</p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold">Booked Slots</h3>
//                 {slotsData.booked_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.booked_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No booked slots</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Payment Summary Dialog */}
//       <Dialog open={isPaymentSummaryDialogOpen} onOpenChange={setIsPaymentSummaryDialogOpen}>
//         <DialogContent className="sm:max-w-[1000px]">
//           <DialogHeader>
//             <DialogTitle>Payment Summaries for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {paymentSummaries.length > 0 ? (
//               <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
//                 <Table className="min-w-full">
//                   <TableHeader className="sticky top-0 bg-gray-100">
//                     <TableRow>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Doctor Name</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialization</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Consultation Fee</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Confirmed Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Payment Expected</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Transferred</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Due</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {paymentSummaries.map((summary, index) => (
//                       <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.doctor_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.specialization.specialization_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.consultation_fee}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.total_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.confirmed_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.total_payment_expected || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_transferred || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_due || "0"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <p className="text-gray-600 text-center">No payment summaries available</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsPaymentSummaryDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Search */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Search Doctor</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by Doctor ID, Name, Specialization, or Location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button onClick={handleSearch} className="bg-gradient-primary">
//                 Search
//               </Button>
//             </div>
//             {error && <p className="text-red-600 text-sm">{error}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Doctors Table */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Doctors List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Specialization</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredDoctors.map((doctor) => (
//                 <TableRow key={doctor.doctor_id}>
//                   <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
//                   <TableCell>{doctor.doctor_name}</TableCell>
//                   <TableCell>{doctor.specialization_name}</TableCell>
//                   <TableCell>{doctor.work_location}</TableCell>
//                   <TableCell>
//                     <Badge variant="default">Active</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/profile`)}
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         Profile
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/portfolio`)}
//                       >
//                         <FileText className="w-4 h-4 mr-1" />
//                         Portfolio
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           setIsAddSlotsDialogOpen(true);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         Add Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handleViewSlots(doctor.doctor_id);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         View Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handlePaymentSummary(doctor.doctor_id);
//                         }}
//                       >
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         Payment Summary
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






























































// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, FileText, Calendar, DollarSign, ToggleRight } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function Doctors() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
//   const [isSpecializationDialogOpen, setIsSpecializationDialogOpen] = useState(false);
//   const [isAddSlotsDialogOpen, setIsAddSlotsDialogOpen] = useState(false);
//   const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false);
//   const [isPaymentSummaryDialogOpen, setIsPaymentSummaryDialogOpen] = useState(false);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [paymentSummaries, setPaymentSummaries] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [formData, setFormData] = useState({
//     doctor_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     specialization_id: "",
//     experience_years: "",
//     address: "",
//     consultation_fee: "",
//     degree: "",
//     about: "",
//     work_location: "",
//     clinic_location: "",
//     dm_amount: "",
//     image: null,
//   });
//   const [specializationFormData, setSpecializationFormData] = useState({
//     specialization_name: "",
//     emergency_consultation_fee: 0,
//   });
//   const [slotFile, setSlotFile] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [slotsData, setSlotsData] = useState({ available_slots: [], booked_slots: [], doctor_id: "", date: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/doctors/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch doctors");
//         }
//         const data = await response.json();
//         setDoctors(data);
//         setFilteredDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setError(error.message || "Failed to fetch doctors");
//         setDoctors([]);
//         setFilteredDoctors([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchSpecializations = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No access token found");
//         }

//         const response = await fetch("https://api.onestepmedi.com:8000/specializations/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("Unauthorized: Invalid or expired token");
//           }
//           throw new Error("Failed to fetch specializations");
//         }
//         const data = await response.json();
//         setSpecializations(data);
//       } catch (error) {
//         console.error("Error fetching specializations:", error);
//         setError(error.message || "Failed to fetch specializations");
//         setSpecializations([]);
//       }
//     };

//     fetchDoctors();
//     fetchSpecializations();
//   }, []);

//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       const filtered = doctors.filter((doc) =>
//         doc.doctor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.specialization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doc.work_location.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredDoctors(filtered);
//       if (filtered.length === 0) {
//         setError("No doctor found with the provided criteria");
//       } else {
//         setError(null);
//       }
//     } else {
//       setFilteredDoctors(doctors);
//       setError(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSpecializationInputChange = (e) => {
//     const { name, value } = e.target;
//     setSpecializationFormData((prev) => ({
//       ...prev,
//       [name]: name === "emergency_consultation_fee" ? Number(value) : value,
//     }));
//   };

//   const handleSlotFileChange = (e) => {
//     setSlotFile(e.target.files ? e.target.files[0] : null);
//   };

//   const handleSpecializationChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       specialization_id: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== "") {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch("https://api.onestepmedi.com:8000/doctors/admin-create-doctor", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to create doctor");
//       }

//       const newDoctor = await response.json();
//       setDoctors([...doctors, newDoctor]);
//       setFilteredDoctors([...doctors, newDoctor]);
//       setIsDoctorDialogOpen(false);
//       setFormData({
//         doctor_name: "",
//         email: "",
//         phone: "",
//         password: "",
//         specialization_id: "",
//         experience_years: "",
//         address: "",
//         consultation_fee: "",
//         degree: "",
//         about: "",
//         work_location: "",
//         clinic_location: "",
//         dm_amount: "",
//         image: null,
//       });
//     } catch (error) {
//       console.error("Error creating doctor:", error);
//       setError(error.message || "Failed to create doctor");
//     }
//   };

//   const handleSpecializationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       if (specializationFormData.emergency_consultation_fee < 0) {
//         setError("Emergency consultation fee cannot be negative");
//         return;
//       }

//       const response = await fetch("https://api.onestepmedi.com:8000/specializations/add", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           specialization_name: specializationFormData.specialization_name,
//           emergency_consultation_fee: specializationFormData.emergency_consultation_fee,
//         }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to add specialization");
//       }

//       await response.json();
//       setIsSpecializationDialogOpen(false);
//       setSpecializationFormData({
//         specialization_name: "",
//         emergency_consultation_fee: 0,
//       });
//     } catch (error) {
//       console.error("Error adding specialization:", error);
//       setError(error.message || "Failed to add specialization");
//     }
//   };

//   const handleAddSlotsSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }
//       if (!slotFile) {
//         throw new Error("No file selected");
//       }

//       const formDataToSend = new FormData();
//       formDataToSend.append("file", slotFile);

//       const response = await fetch("https://api.onestepmedi.com:8000/slots/upload-excel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to upload slots");
//       }

//       setIsAddSlotsDialogOpen(false);
//       setSlotFile(null);
//     } catch (error) {
//       console.error("Error uploading slots:", error);
//       setError(error.message || "Failed to upload slots");
//     }
//   };

//   const handleViewSlots = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       const response = await fetch(
//         `https://api.onestepmedi.com:8000/slots/available-slots?preferred_date=${formattedDate}&doctor_id=${doctorId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch slots");
//       }

//       const data = await response.json();
//       setSlotsData(data);
//       setIsViewSlotsDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       setError(error.message || "Failed to fetch slots");
//     }
//   };

//   const handlePaymentSummary = async (doctorId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Unauthorized: Invalid or expired token");
//         }
//         throw new Error("Failed to fetch payment summaries");
//       }

//       const data = await response.json();
//       const summaries = Array.isArray(data.summary) ? data.summary : [data.summary];
//       const transformedSummaries = summaries.map((summary) => ({
//         ...summary,
//         total_appointments:
//           typeof summary.total_appointments === "object"
//             ? summary.total_appointments.total
//             : summary.total_appointments,
//         confirmed_appointments:
//           typeof summary.confirmed_appointments === "object"
//             ? summary.confirmed_appointments.total
//             : summary.confirmed_appointments,
//         total_payment_expected:
//           typeof summary.total_payment_expected === "object"
//             ? summary.total_payment_expected.total
//             : summary.total_payment_expected,
//         amount_transferred:
//           typeof summary.amount_transferred === "object"
//             ? summary.amount_transferred.total
//             : summary.amount_transferred,
//         amount_due:
//           typeof summary.amount_due === "object"
//             ? summary.amount_due.total
//             : summary.amount_due,
//       }));
//       setPaymentSummaries(transformedSummaries);
//       setIsPaymentSummaryDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching payment summaries:", error);
//       setError(error.message || "Failed to fetch payment summaries");
//       setPaymentSummaries([]);
//     }
//   };

//   const handleStatusToggle = async (doctor) => {
//     const newStatus = doctor.status === "active" ? "inactive" : "active";

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const response = await fetch("https://api.onestepmedi.com:8000/superadmin/users/status", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           user_id: doctor.doctor_id,
//           status: newStatus,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update doctor status");
//       }

//       setDoctors((prev) =>
//         prev.map((d) =>
//           d.doctor_id === doctor.doctor_id ? { ...d, status: newStatus } : d
//         )
//       );
//       setFilteredDoctors((prev) =>
//         prev.map((d) =>
//           d.doctor_id === doctor.doctor_id ? { ...d, status: newStatus } : d
//         )
//       );
//     } catch (error) {
//       console.error("Error updating doctor status:", error);
//       setError(error.message || "Failed to update doctor status");
//     }
//   };

//   if (isLoading) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//           Doctors Management
//         </h1>
//         <div className="flex gap-2">
//           <Button onClick={() => setIsDoctorDialogOpen(true)} className="bg-gradient-primary">
//             Add Doctor
//           </Button>
//           <Button onClick={() => navigate('/addportfolio')} className="bg-gradient-primary">
//             Add Doctor Portfolio
//           </Button>
//           <Button onClick={() => setIsSpecializationDialogOpen(true)} className="bg-gradient-primary">
//             Add Specialization
//           </Button>
//         </div>
//       </div>

//       {/* Add Doctor Dialog */}
//       <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Add New Doctor</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="doctor_name">Doctor Name *</Label>
//                 <Input
//                   id="doctor_name"
//                   name="doctor_name"
//                   value={formData.doctor_name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone *</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password *</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="specialization_id">Specialization *</Label>
//                 <Select
//                   name="specialization_id"
//                   value={formData.specialization_id}
//                   onValueChange={handleSpecializationChange}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select specialization" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {specializations.map((spec) => (
//                       <SelectItem key={spec.id} value={spec.id.toString()}>
//                         {spec.specialization_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="experience_years">Experience Years *</Label>
//                 <Input
//                   id="experience_years"
//                   name="experience_years"
//                   type="number"
//                   value={formData.experience_years}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="address">Address *</Label>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="consultation_fee">Consultation Fee *</Label>
//                 <Input
//                   id="consultation_fee"
//                   name="consultation_fee"
//                   type="number"
//                   value={formData.consultation_fee}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="degree">Degree *</Label>
//                 <Input
//                   id="degree"
//                   name="degree"
//                   value={formData.degree}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2 col-span-2">
//                 <Label htmlFor="about">About *</Label>
//                 <Input
//                   id="about"
//                   name="about"
//                   value={formData.about}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="work_location">Work Location *</Label>
//                 <Input
//                   id="work_location"
//                   name="work_location"
//                   value={formData.work_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="clinic_location">Clinic Location *</Label>
//                 <Input
//                   id="clinic_location"
//                   name="clinic_location"
//                   value={formData.clinic_location}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dm_amount">DM Amount *</Label>
//                 <Input
//                   id="dm_amount"
//                   name="dm_amount"
//                   value={formData.dm_amount}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="image">Image</Label>
//                 <Input
//                   id="image"
//                   name="image"
//                   type="file"
//                   onChange={handleInputChange}
//                   accept="image/*"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsDoctorDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Doctor
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Specialization Dialog */}
//       <Dialog open={isSpecializationDialogOpen} onOpenChange={setIsSpecializationDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add New Specialization</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSpecializationSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="specialization_name">Specialization Name *</Label>
//               <Input
//                 id="specialization_name"
//                 name="specialization_name"
//                 value={specializationFormData.specialization_name}
//                 onChange={handleSpecializationInputChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="emergency_consultation_fee">Emergency Consultation Fee *</Label>
//               <Input
//                 id="emergency_consultation_fee"
//                 name="emergency_consultation_fee"
//                 type="number"
//                 value={specializationFormData.emergency_consultation_fee}
//                 onChange={handleSpecializationInputChange}
//                 required
//                 min="0"
//                 step="1"
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsSpecializationDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Add Specialization
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Slots Dialog */}
//       <Dialog open={isAddSlotsDialogOpen} onOpenChange={setIsAddSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Add Slots for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddSlotsSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="slot_file">Upload Excel File *</Label>
//               <Input
//                 id="slot_file"
//                 name="slot_file"
//                 type="file"
//                 onChange={handleSlotFileChange}
//                 accept=".xlsx,.xls"
//                 required
//               />
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsAddSlotsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" className="bg-gradient-primary">
//                 Upload Slots
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* View Slots Dialog */}
//       <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>View Slots for Doctor {slotsData.doctor_id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Select Date</Label>
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => {
//                   setSelectedDate(date);
//                   if (selectedDoctorId) {
//                     handleViewSlots(selectedDoctorId);
//                   }
//                 }}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold">Available Slots</h3>
//                 {slotsData.available_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.available_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No available slots</p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold">Booked Slots</h3>
//                 {slotsData.booked_slots?.length > 0 ? (
//                   <ul className="list-disc pl-5">
//                     {slotsData.booked_slots.map((slot, index) => (
//                       <li key={index}>{slot.time_slot}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No booked slots</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Payment Summary Dialog */}
//       <Dialog open={isPaymentSummaryDialogOpen} onOpenChange={setIsPaymentSummaryDialogOpen}>
//         <DialogContent className="sm:max-w-[1000px]">
//           <DialogHeader>
//             <DialogTitle>Payment Summaries for Doctor {selectedDoctorId}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             {paymentSummaries.length > 0 ? (
//               <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
//                 <Table className="min-w-full">
//                   <TableHeader className="sticky top-0 bg-gray-100">
//                     <TableRow>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Doctor Name</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialization</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Consultation Fee</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Confirmed Appointments</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Payment Expected</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Transferred</TableHead>
//                       <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Due</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {paymentSummaries.map((summary, index) => (
//                       <TableRow key={index} className="hover:bg-gray-50 transition-colors">
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.doctor_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.specialization.specialization_name}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.consultation_fee}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.total_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.confirmed_appointments || "N/A"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.total_payment_expected || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_transferred || "0"}</TableCell>
//                         <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_due || "0"}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <p className="text-gray-600 text-center">No payment summaries available</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setIsPaymentSummaryDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Search */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Search Doctor</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by Doctor ID, Name, Specialization, or Location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button onClick={handleSearch} className="bg-gradient-primary">
//                 Search
//               </Button>
//             </div>
//             {error && <p className="text-red-600 text-sm">{error}</p>}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Doctors Table */}
//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle>Doctors List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Specialization</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredDoctors.map((doctor) => (
//                 <TableRow key={doctor.doctor_id} className={doctor.status === "inactive" ? "opacity-50" : ""}>
//                   <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
//                   <TableCell>{doctor.doctor_name}</TableCell>
//                   <TableCell>{doctor.specialization_name}</TableCell>
//                   <TableCell>{doctor.work_location}</TableCell>
//                   <TableCell>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={doctor.status === "active"}
//                         onChange={() => handleStatusToggle(doctor)}
//                         className="sr-only peer"
//                       />
//                       <div
//                         className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-600 transition-all duration-200 ease-in-out relative
//                           after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:bg-white`}
//                       ></div>
//                       <span className="ml-2 text-sm font-medium text-gray-700">
//                         {doctor.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </label>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/profile`)}
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         Profile
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => navigate(`/doctors/${doctor.doctor_id}/portfolio`)}
//                       >
//                         <FileText className="w-4 h-4 mr-1" />
//                         Portfolio
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           setIsAddSlotsDialogOpen(true);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         Add Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handleViewSlots(doctor.doctor_id);
//                         }}
//                       >
//                         <Calendar className="w-4 h-4 mr-1" />
//                         View Slots
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedDoctorId(doctor.doctor_id);
//                           handlePaymentSummary(doctor.doctor_id);
//                         }}
//                       >
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         Payment Summary
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, FileText, Calendar, DollarSign, ToggleRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
  const [isSpecializationDialogOpen, setIsSpecializationDialogOpen] = useState(false);
  const [isAddSlotsDialogOpen, setIsAddSlotsDialogOpen] = useState(false);
  const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false);
  const [isPaymentSummaryDialogOpen, setIsPaymentSummaryDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [paymentSummaries, setPaymentSummaries] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    doctor_name: "",
    email: "",
    phone: "",
    password: "",
    specialization_id: "",
    experience_years: "",
    address: "",
    consultation_fee: "",
    degree: "",
    about: "",
    work_location: "",
    clinic_location: "",
    dm_amount: "",
    image: null,
  });
  const [specializationFormData, setSpecializationFormData] = useState({
    specialization_name: "",
    emergency_consultation_fee: "",
  });
  const [slotFile, setSlotFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotsData, setSlotsData] = useState({ available_slots: [], booked_slots: [], doctor_id: "", date: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch("https://api.onestepmedi.com:8000/doctors/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token");
          }
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.message || "Failed to fetch doctors");
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch("https://api.onestepmedi.com:8000/specializations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token");
          }
          throw new Error("Failed to fetch specializations");
        }
        const data = await response.json();
        setSpecializations(data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
        setError(error.message || "Failed to fetch specializations");
        setSpecializations([]);
      }
    };

    fetchDoctors();
    fetchSpecializations();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = doctors.filter((doc) =>
        doc.doctor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.work_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
      if (filtered.length === 0) {
        setError("No doctor found with the provided criteria");
      } else {
        setError(null);
      }
    } else {
      setFilteredDoctors(doctors);
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSpecializationInputChange = (e) => {
    const { name, value } = e.target;
    setSpecializationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotFileChange = (e) => {
    setSlotFile(e.target.files ? e.target.files[0] : null);
  };

  const handleSpecializationChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      specialization_id: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("https://api.onestepmedi.com:8000/doctors/admin-create-doctor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to create doctor");
      }

      const newDoctor = await response.json();
      setDoctors([...doctors, newDoctor]);
      setFilteredDoctors([...doctors, newDoctor]);
      setIsDoctorDialogOpen(false);
      setFormData({
        doctor_name: "",
        email: "",
        phone: "",
        password: "",
        specialization_id: "",
        experience_years: "",
        address: "",
        consultation_fee: "",
        degree: "",
        about: "",
        work_location: "",
        clinic_location: "",
        dm_amount: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating doctor:", error);
      setError(error.message || "Failed to create doctor");
    }
  };

  const handleSpecializationSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const emergencyFee = Number(specializationFormData.emergency_consultation_fee);
      if (isNaN(emergencyFee) || emergencyFee < 0) {
        setError("Emergency consultation fee must be a valid non-negative number");
        return;
      }

      const response = await fetch("https://api.onestepmedi.com:8000/specializations/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialization_name: specializationFormData.specialization_name,
          emergency_consultation_fee: emergencyFee,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to add specialization");
      }

      await response.json();
      setIsSpecializationDialogOpen(false);
      setSpecializationFormData({
        specialization_name: "",
        emergency_consultation_fee: "",
      });
    } catch (error) {
      console.error("Error adding specialization:", error);
      setError(error.message || "Failed to add specialization");
    }
  };

  const handleAddSlotsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }
      if (!slotFile) {
        throw new Error("No file selected");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("file", slotFile);

      const response = await fetch("https://api.onestepmedi.com:8000/slots/upload-excel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to upload slots");
      }

      setIsAddSlotsDialogOpen(false);
      setSlotFile(null);
    } catch (error) {
      console.error("Error uploading slots:", error);
      setError(error.message || "Failed to upload slots");
    }
  };

  const handleViewSlots = async (doctorId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `https://api.onestepmedi.com:8000/slots/available-slots?preferred_date=${formattedDate}&doctor_id=${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to fetch slots");
      }

      const data = await response.json();
      setSlotsData(data);
      setIsViewSlotsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setError(error.message || "Failed to fetch slots");
    }
  };

  const handlePaymentSummary = async (doctorId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`https://api.onestepmedi.com:8000/payments/summary/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error("Failed to fetch payment summaries");
      }

      const data = await response.json();
      const summaries = Array.isArray(data.summary) ? data.summary : [data.summary];
      const transformedSummaries = summaries.map((summary) => ({
        ...summary,
        total_appointments:
          typeof summary.total_appointments === "object"
            ? summary.total_appointments.total
            : summary.total_appointments,
        confirmed_appointments:
          typeof summary.confirmed_appointments === "object"
            ? summary.confirmed_appointments.total
            : summary.confirmed_appointments,
        total_payment_expected:
          typeof summary.total_payment_expected === "object"
            ? summary.total_payment_expected.total
            : summary.total_payment_expected,
        amount_transferred:
          typeof summary.amount_transferred === "object"
            ? summary.amount_transferred.total
            : summary.amount_transferred,
        amount_due:
          typeof summary.amount_due === "object"
            ? summary.amount_due.total
            : summary.amount_due,
      }));
      setPaymentSummaries(transformedSummaries);
      setIsPaymentSummaryDialogOpen(true);
    } catch (error) {
      console.error("Error fetching payment summaries:", error);
      setError(error.message || "Failed to fetch payment summaries");
      setPaymentSummaries([]);
    }
  };

  const handleStatusToggle = async (doctor) => {
    const newStatus = doctor.status === "active" ? "inactive" : "active";

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch("https://api.onestepmedi.com:8000/superadmin/users/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: doctor.doctor_id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor status");
      }

      setDoctors((prev) =>
        prev.map((d) =>
          d.doctor_id === doctor.doctor_id ? { ...d, status: newStatus } : d
        )
      );
      setFilteredDoctors((prev) =>
        prev.map((d) =>
          d.doctor_id === doctor.doctor_id ? { ...d, status: newStatus } : d
        )
      );
    } catch (error) {
      console.error("Error updating doctor status:", error);
      setError(error.message || "Failed to update doctor status");
    }
  };

  if (isLoading) return <div className="text-gray-600 text-center p-6 text-lg">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Doctors Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsDoctorDialogOpen(true)} className="bg-gradient-primary">
            Add Doctor
          </Button>
          <Button onClick={() => navigate('/addportfolio')} className="bg-gradient-primary">
            Add Doctor Portfolio
          </Button>
          <Button onClick={() => setIsSpecializationDialogOpen(true)} className="bg-gradient-primary">
            Add Specialization
          </Button>
        </div>
      </div>

      {/* Add Doctor Dialog */}
      <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Doctor Name *</Label>
                <Input
                  id="doctor_name"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization_id">Specialization *</Label>
                <Select
                  name="specialization_id"
                  value={formData.specialization_id}
                  onValueChange={handleSpecializationChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id.toString()}>
                        {spec.specialization_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_years">Experience Years *</Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultation_fee">Consultation Fee *</Label>
                <Input
                  id="consultation_fee"
                  name="consultation_fee"
                  type="text"
                  value={formData.consultation_fee}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="about">About *</Label>
                <Input
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_location">Work Location *</Label>
                <Input
                  id="work_location"
                  name="work_location"
                  value={formData.work_location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic_location">Clinic Location *</Label>
                <Input
                  id="clinic_location"
                  name="clinic_location"
                  value={formData.clinic_location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dm_amount">DM Amount *</Label>
                <Input
                  id="dm_amount"
                  name="dm_amount"
                  value={formData.dm_amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleInputChange}
                  accept="image/*"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDoctorDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Add Doctor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Specialization Dialog */}
      <Dialog open={isSpecializationDialogOpen} onOpenChange={setIsSpecializationDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Specialization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSpecializationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialization_name">Specialization Name *</Label>
              <Input
                id="specialization_name"
                name="specialization_name"
                value={specializationFormData.specialization_name}
                onChange={handleSpecializationInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_consultation_fee">Emergency Consultation Fee *</Label>
              <Input
                id="emergency_consultation_fee"
                name="emergency_consultation_fee"
                type="text"
                value={specializationFormData.emergency_consultation_fee}
                onChange={handleSpecializationInputChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSpecializationDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Add Specialization
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Slots Dialog */}
      <Dialog open={isAddSlotsDialogOpen} onOpenChange={setIsAddSlotsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Slots for Doctor {selectedDoctorId}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSlotsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slot_file">Upload Excel File *</Label>
              <Input
                id="slot_file"
                name="slot_file"
                type="file"
                onChange={handleSlotFileChange}
                accept=".xlsx,.xls"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddSlotsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Upload Slots
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Slots Dialog */}
      <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>View Slots for Doctor {slotsData.doctor_id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  if (selectedDoctorId) {
                    handleViewSlots(selectedDoctorId);
                  }
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Available Slots</h3>
                {slotsData.available_slots?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {slotsData.available_slots.map((slot, index) => (
                      <li key={index}>{slot.time_slot}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No available slots</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Booked Slots</h3>
                {slotsData.booked_slots?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {slotsData.booked_slots.map((slot, index) => (
                      <li key={index}>{slot.time_slot}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No booked slots</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Summary Dialog */}
      <Dialog open={isPaymentSummaryDialogOpen} onOpenChange={setIsPaymentSummaryDialogOpen}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Payment Summaries for Doctor {selectedDoctorId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {paymentSummaries.length > 0 ? (
              <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-200">
                <Table className="min-w-full">
                  <TableHeader className="sticky top-0 bg-gray-100">
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Doctor Name</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Specialization</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Consultation Fee</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Appointments</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Confirmed Appointments</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Payment Expected</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Transferred</TableHead>
                      <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentSummaries.map((summary, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.doctor_name}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.specialization.specialization_name}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.consultation_fee}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.total_appointments || "N/A"}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">{summary.confirmed_appointments || "N/A"}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.total_payment_expected || "0"}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_transferred || "0"}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-600">₹{summary.amount_due || "0"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-600 text-center">No payment summaries available</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPaymentSummaryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Search Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Doctor ID, Name, Specialization, or Location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="bg-gradient-primary">
                Search
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Doctors List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.doctor_id} className={doctor.status === "inactive" ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{doctor.doctor_id}</TableCell>
                  <TableCell>{doctor.doctor_name}</TableCell>
                  <TableCell>{doctor.specialization_name}</TableCell>
                  <TableCell>{doctor.work_location}</TableCell>
                  <TableCell>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={doctor.status === "active"}
                        onChange={() => handleStatusToggle(doctor)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-600 transition-all duration-200 ease-in-out relative
                          after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:bg-white`}
                      ></div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {doctor.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/doctors/${doctor.doctor_id}/profile`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/doctors/${doctor.doctor_id}/portfolio`)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Portfolio
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorId(doctor.doctor_id);
                          setIsAddSlotsDialogOpen(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Add Slots
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorId(doctor.doctor_id);
                          handleViewSlots(doctor.doctor_id);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        View Slots
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctorId(doctor.doctor_id);
                          handlePaymentSummary(doctor.doctor_id);
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Payment Summary
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}