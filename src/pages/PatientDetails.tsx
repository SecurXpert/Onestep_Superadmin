import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Calendar, Heart, Activity } from "lucide-react";

export default function PatientDetails() {
  const { id } = useParams();
  
  // Mock data - in a real app, you'd fetch this based on the ID
  const patient = {
    id: id || "PAT001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    address: "456 Oak Street, City, State 12345",
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1 (555) 123-4568"
    },
    medicalInfo: {
      bloodType: "A+",
      allergies: ["Penicillin", "Shellfish"],
      conditions: ["Hypertension", "Diabetes Type 2"],
      medications: ["Metformin 500mg", "Lisinopril 10mg"]
    },
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "180 lbs",
      height: "5'10\"",
      lastUpdated: "2024-01-15 10:30 AM"
    },
    recentVisits: [
      { date: "2024-01-10", doctor: "Dr. Sarah Johnson", reason: "Regular Checkup", status: "Completed" },
      { date: "2024-01-05", doctor: "Dr. Michael Chen", reason: "Blood Work", status: "Completed" },
      { date: "2023-12-15", doctor: "Dr. Sarah Johnson", reason: "Follow-up", status: "Completed" },
    ]
  };

  return (
    <div className="space-y-6">
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
              <AvatarImage src={`/avatars/${patient.id}.jpg`} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{patient.name}</CardTitle>
            <div className="text-muted-foreground">ID: {patient.id}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{patient.age} years old, {patient.gender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Contact & Emergency Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-muted-foreground">{patient.address}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Emergency Contact</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {patient.emergencyContact.name}</p>
                <p><strong>Relationship:</strong> {patient.emergencyContact.relationship}</p>
                <p><strong>Phone:</strong> {patient.emergencyContact.phone}</p>
              </div>
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
              <Badge variant="destructive">{patient.medicalInfo.bloodType}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Allergies</h4>
              <div className="flex gap-2 flex-wrap">
                {patient.medicalInfo.allergies.map((allergy, index) => (
                  <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Conditions</h4>
              <div className="flex gap-2 flex-wrap">
                {patient.medicalInfo.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Current Medications</h4>
              <ul className="space-y-1 text-sm">
                {patient.medicalInfo.medications.map((medication, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>{medication}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Vital Signs
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {patient.vitals.lastUpdated}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Blood Pressure</span>
                </div>
                <span className="font-semibold">{patient.vitals.bloodPressure}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">Heart Rate</span>
                </div>
                <span className="font-semibold">{patient.vitals.heartRate}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Temperature</span>
                <span className="font-semibold">{patient.vitals.temperature}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Weight</span>
                <span className="font-semibold">{patient.vitals.weight}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Height</span>
                <span className="font-semibold">{patient.vitals.height}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patient.recentVisits.map((visit, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{visit.reason}</h4>
                  <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{visit.date}</p>
                  <Badge variant="default">{visit.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}