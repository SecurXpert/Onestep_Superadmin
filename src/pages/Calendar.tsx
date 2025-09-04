import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Calendar() {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [appointments, setAppointments] = useState([]);
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const staticEvents = [
    {
      id: 4,
      date: "2025-09-04",
      time: "9:00 AM",
      type: "event",
      title: "Staff Meeting",
      status: "scheduled",
    },
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No auth token found in localStorage");
          toast({
            title: "Authentication Error",
            description: "No authentication token found. Please log in again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetching regular appointments...");
        const regularResponse = await fetch(
          "https://api.onestepmedi.com:8000/appointments/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!regularResponse.ok) {
          throw new Error(
            `Regular appointments API failed: ${regularResponse.status} ${regularResponse.statusText}`
          );
        }

        const regularData = await regularResponse.json();
        console.log("Regular appointments response:", regularData);

        console.log("Fetching emergency appointments...");
        const emergencyResponse = await fetch(
          "https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!emergencyResponse.ok) {
          throw new Error(
            `Emergency appointments API failed: ${emergencyResponse.status} ${emergencyResponse.statusText}`
          );
        }

        const emergencyData = await emergencyResponse.json();
        console.log("Emergency appointments response:", emergencyData);

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
        toast({
          title: "Error",
          description: `Failed to fetch calendar data: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const mappedAppointments = appointments.map((apt) => ({
    id: apt.appointment_id,
    date: apt.preferred_date,
    time: apt.time_slot,
    type: "appointment",
    title: `${apt.doctor_name} - ${apt.name}`,
    status: apt.status,
  }));

  const mappedEmergencies = emergencyAppointments.map((apt) => ({
    id: apt.appointment_id,
    date: apt.created_at.split("T")[0],
    time: apt.created_at.split("T")[1]?.slice(0, 5) || "Unknown",
    type: "emergency",
    title: `Emergency - ${apt.name} - ${apt.specialization}`,
    status: apt.status,
  }));

  const calendarEvents = [...mappedAppointments, ...mappedEmergencies, ...staticEvents];

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = generateCalendarDays();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((event) => event.date === dateStr);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "emergency":
        return "bg-destructive";
      case "appointment":
        return "bg-primary";
      case "event":
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "urgent":
        return "destructive";
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Calendar
        </h1>
        <Button className="bg-gradient-primary">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <CalendarIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getEventsForDate(currentDate.getDate()).length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <User className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {calendarEvents.filter((e) => e.type === "appointment").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Slots</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {calendarEvents.filter((e) => e.type === "emergency").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calendarEvents.filter((e) => e.type === "event").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {monthNames[currentMonth]} {currentYear}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all duration-200
                    ${day === null ? "invisible" : ""}
                    ${day === currentDate.getDate() ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                    ${day === selectedDate ? "ring-2 ring-primary" : ""}
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className="font-medium">{day}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day)
                          .slice(0, 2)
                          .map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                            >
                              {event.time} - {event.title}
                            </div>
                          ))}
                        {getEventsForDate(day).length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{getEventsForDate(day).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              Events for {monthNames[currentMonth]} {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No events for this date
                </p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusBadge(event.status)}>
                        {event.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{event.time}</span>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}
                      ></div>
                      <span className="text-sm capitalize">{event.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}