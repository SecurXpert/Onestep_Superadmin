import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function Appointments() {
  const [searchId, setSearchId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rebookDialogOpen, setRebookDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rebookForm, setRebookForm] = useState({
    new_doctor_id: "",
    new_date: "",
    new_time: "",
    mode: ""
  });
  const { toast } = useToast();

  const currentDate = "2025-08-22";

  const doctors = [
    { id: "doc1", name: "Dr. Smith" },
    { id: "doc2", name: "Dr. Johnson" },
    { id: "doc3", name: "Dr. Brown" }
  ];

  const modes = ["in-person", "virtual"];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const regularResponse = await fetch("https://api.onestepmedi.com:8000/appointments/appointments/", {
          headers
        });
        const regularData = await regularResponse.json();
        
        const emergencyResponse = await fetch("https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/", {
          headers
        });
        const emergencyData = await emergencyResponse.json();

        const normalizedRegular = Array.isArray(regularData)
          ? regularData
          : [regularData].filter(Boolean);

        const normalizedEmergency = Array.isArray(emergencyData)
          ? emergencyData
          : [emergencyData].filter(Boolean);

        setAppointments(normalizedRegular);
        setEmergencyAppointments(normalizedEmergency);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleRebook = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams({
        old_appointment_id: selectedAppointment?.appointment_id,
        new_doctor_id: rebookForm.new_doctor_id,
        new_date: rebookForm.new_date,
        new_time: rebookForm.new_time,
        mode: rebookForm.mode
      }).toString();

      const response = await fetch(`https://api.onestepmedi.com:8000/admin/rebook-appointment?${queryParams}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment rebooked successfully"
        });
        setRebookDialogOpen(false);
        const token = localStorage.getItem('authToken');
        const regularResponse = await fetch("https://api.onestepmedi.com:8000/appointments/appointments/", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const regularData = await regularResponse.json();
        setAppointments(Array.isArray(regularData) ? regularData : [regularData].filter(Boolean));
      } else {
        throw new Error("Failed to rebook appointment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rebook appointment",
        variant: "destructive"
      });
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesId = !searchId || apt.appointment_id.toLowerCase().includes(searchId.toLowerCase());
    const matchesDate = !searchDate || apt.preferred_date.includes(searchDate);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" && apt.preferred_date === currentDate && apt.status === "confirmed") ||
      (activeTab === "rejected" && apt.status === "rejected") ||
      (activeTab === "rescheduled" && apt.status === "cancelled_by_hold");

    return matchesId && matchesDate && matchesTab;
  });

  const filteredEmergencyAppointments = emergencyAppointments.filter((apt) => {
    const matchesId = !searchId || apt.appointment_id.toLowerCase().includes(searchId.toLowerCase());
    const matchesDate = !searchDate || apt.created_at.includes(searchDate);
    return matchesId && matchesDate && activeTab === "emergency";
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
      case "confirmed":
        return "default";
      case "emergency":
      case "pending":
        return "destructive";
      case "completed":
        return "default";
      case "rejected":
        return "secondary";
      case "rescheduled":
      case "cancelled_by_hold":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Appointments Management
        </h1>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Search Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Appointment ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="rescheduled">Rescheduled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab === "emergency"
                      ? filteredEmergencyAppointments
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((appointment) => (
                            <TableRow key={appointment.appointment_id}>
                              <TableCell className="font-medium">{appointment.appointment_id}</TableCell>
                              <TableCell>{appointment.name}</TableCell>
                              <TableCell>{appointment.specialization}</TableCell>
                              <TableCell>{appointment.created_at.split("T")[0]}</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          ))
                      : filteredAppointments
                          .sort((a, b) => new Date(b.preferred_date).getTime() - new Date(a.preferred_date).getTime())
                          .map((appointment) => (
                            <TableRow key={appointment.appointment_id}>
                              <TableCell className="font-medium">{appointment.appointment_id}</TableCell>
                              <TableCell>{appointment.name}</TableCell>
                              <TableCell>{appointment.doctor_name}</TableCell>
                              <TableCell>{appointment.preferred_date}</TableCell>
                              <TableCell>{appointment.time_slot}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {appointment.status === "cancelled_by_hold" && (
                                  <Dialog open={rebookDialogOpen} onOpenChange={setRebookDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() => setSelectedAppointment(appointment)}
                                      >
                                        Rebook
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Rebook Appointment</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="doctor" className="text-right">
                                            Doctor ID
                                          </Label>
                                          <Input
                                            id="doctor"
                                            type="text"
                                            className="col-span-3"
                                            placeholder="Enter doctor ID"
                                            value={rebookForm.new_doctor_id}
                                            onChange={(e) =>
                                              setRebookForm({ ...rebookForm, new_doctor_id: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="date" className="text-right">
                                            Date
                                          </Label>
                                          <Input
                                            id="date"
                                            type="date"
                                            className="col-span-3"
                                            onChange={(e) =>
                                              setRebookForm({ ...rebookForm, new_date: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="time" className="text-right">
                                            Time
                                          </Label>
                                          <Input
                                            id="time"
                                            type="time"
                                            className="col-span-3"
                                            onChange={(e) =>
                                              setRebookForm({ ...rebookForm, new_time: e.target.value })
                                            }
                                          />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label htmlFor="mode" className="text-right">
                                            Mode
                                          </Label>
                                          <Select
                                            onValueChange={(value) =>
                                              setRebookForm({ ...rebookForm, mode: value })
                                            }
                                          >
                                            <SelectTrigger className="col-span-3">
                                              <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {modes.map((mode) => (
                                                <SelectItem key={mode} value={mode}>
                                                  {mode}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <Button onClick={handleRebook}>Confirm Rebooking</Button>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}