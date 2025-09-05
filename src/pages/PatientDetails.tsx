import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Calendar, Activity } from "lucide-react";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  // Fetch patient details and appointments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [patientResponse, appointmentsResponse] = await Promise.all([
          fetch("https://api.onestepmedi.com:8000/patient/all", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("https://api.onestepmedi.com:8000/appointments/appointments/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Handle patient data
        if (!patientResponse.ok) {
          throw new Error(`Failed to fetch patient details: ${patientResponse.status}`);
        }
        const patientData = await patientResponse.json();
        console.log("Patient API Response:", patientData); // Debug: Log the API response
        console.log("URL Patient ID:", id); // Debug: Log the ID from useParams

        // Access the 'patients' array from the response
        const patients = patientData.patients || [];
        const patient = patients.find((p) => String(p.patient_id).trim() === String(id).trim());
        if (patient) {
          setPatient(patient);
        } else {
          console.log("Patient not found in data:", patients); // Debug: Log patients array
          setError("Patient not found");
        }

        // Handle appointments data
        if (!appointmentsResponse.ok) {
          throw new Error(`Failed to fetch appointments: ${appointmentsResponse.status}`);
        }
        const appointmentsData = await appointmentsResponse.json();
        console.log("Appointments API Response:", appointmentsData); // Debug: Log appointments
        const patientAppointments = appointmentsData.filter((apt) => String(apt.patient_id).trim() === String(id).trim());
        setAppointments(patientAppointments);

        // Fetch prescriptions for each appointment
        const prescriptionPromises = patientAppointments.map(async (apt) => {
          const res = await fetch(
            `https://api.onestepmedi.com:8000/prescription/by-appointment/${apt.appointment_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            console.log(`Failed to fetch prescriptions for appointment ${apt.appointment_id}: ${res.status}`);
            return { appointment_id: apt.appointment_id, prescriptions: [] };
          }
          const prescriptionData = await res.json();
          return { appointment_id: apt.appointment_id, prescriptions: prescriptionData };
        });

        const prescriptionResults = await Promise.all(prescriptionPromises);
        const prescriptionMap = prescriptionResults.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.appointment_id]: curr.prescriptions,
          }),
          {}
        );
        setPrescriptions(prescriptionMap);
      } catch (err) {
        console.error("Fetch Error:", err); // Debug: Log errors
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  if (error && !patient) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!patient) {
    return <div className="text-center text-muted-foreground">No patient data available</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="text-center text-red-500 mb-4">
          Error: {error} (Displaying available patient data)
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Patient Details
        </h1>
        <Badge variant="default">Active Patient</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Profile */}
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={patient.profile_picture || `/avatars/${patient.patient_id}.jpg`} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{patient.name}</CardTitle>
            <div className="text-muted-foreground">ID: {patient.patient_id}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                {Math.floor(
                  (new Date() - new Date(patient.dob)) / (365.25 * 24 * 60 * 60 * 1000)
                )}{" "}
                years old, {patient.gender}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone_number || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email || "Not provided"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-muted-foreground">{patient.address || "Not provided"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Marital Status</h4>
              <p className="text-muted-foreground">{patient.marital_status || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Medical Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Blood Type</h4>
              <Badge variant="destructive">{patient.blood_group || "Not provided"}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Medical History</h4>
              <p className="text-muted-foreground">
                {patient.medical_history ? patient.medical_history : "Not available"}
              </p>
            </div>
            {patient.medical_document && (
              <div>
                <h4 className="font-semibold mb-2">Medical Document</h4>
                <a
                  href={patient.medical_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Medical Document
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vital Signs (from prescriptions) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {appointments.length > 0 &&
              prescriptions[appointments[0].appointment_id]?.[0]?.case_study ? (
                Object.entries(prescriptions[appointments[0].appointment_id][0].case_study).map(
                  ([key, value], index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  )
                )
              ) : (
                <p className="text-muted-foreground">No vital signs available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Prescriptions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointments & Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((visit, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{visit.specialization}</h4>
                      <p className="text-sm text-muted-foreground">{visit.doctor_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{visit.preferred_date}</p>
                      <Badge variant="default">{visit.status}</Badge>
                    </div>
                  </div>
                  {prescriptions[visit.appointment_id]?.length > 0 ? (
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2">Prescription</h5>
                      <ul className="space-y-1 text-sm">
                        {prescriptions[visit.appointment_id][0].items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>
                              {item.medicine_name} - {item.dosage_time}, {item.duration_days} days,{" "}
                              {item.quantity} units
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2">
                        <h6 className="font-semibold">Case Study</h6>
                        <p className="text-sm text-muted-foreground">
                          {prescriptions[visit.appointment_id][0].case_study?.notes ||
                            "No case study notes available"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">No prescriptions available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No appointments available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}