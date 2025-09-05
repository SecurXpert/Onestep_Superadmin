import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Calendar() {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [appointments, setAppointments] = useState([]);
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    description: "",
    date: new Date(),
    start_time: "00:00",
    end_time: "00:00",
    location: "",
    tags: "",
    is_all_day: false,
  });

  // Form state for editing event
  const [editEvent, setEditEvent] = useState({
    event_name: "",
    description: "",
    date: new Date(),
    start_time: "00:00",
    end_time: "00:00",
    location: "",
    tags: "",
    is_all_day: false,
    id: null,
  });

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch regular appointments
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

        // Fetch emergency appointments
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

        // Fetch events
        console.log("Fetching events...");
        const eventsResponse = await fetch(
          "https://api.onestepmedi.com:8000/events?limit=200&skip=0",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!eventsResponse.ok) {
          throw new Error(
            `Events API failed: ${eventsResponse.status} ${eventsResponse.statusText}`
          );
        }

        const eventsData = await eventsResponse.json();
        console.log("Events response:", eventsData);

        const normalizedRegular = Array.isArray(regularData)
          ? regularData
          : [regularData].filter(Boolean);

        const normalizedEmergency = Array.isArray(emergencyData)
          ? emergencyData
          : [emergencyData].filter(Boolean);

        const normalizedEvents = Array.isArray(eventsData)
          ? eventsData
          : [eventsData].filter(Boolean);

        setAppointments(normalizedRegular);
        setEmergencyAppointments(normalizedEmergency);
        setEvents(normalizedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: `Failed to fetch calendar data: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const formattedEvent = {
        ...newEvent,
        date: newEvent.date ? format(newEvent.date, "yyyy-MM-dd") : null,
        start_time: newEvent.is_all_day ? "00:00:00.000Z" : `${newEvent.start_time}:00.000Z`,
        end_time: newEvent.is_all_day ? "23:59:59.999Z" : `${newEvent.end_time}:00.000Z`,
      };

      const response = await fetch("https://api.onestepmedi.com:8000/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEvent),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Reset form and close dialog
      setNewEvent({
        event_name: "",
        description: "",
        date: new Date(),
        start_time: "00:00",
        end_time: "00:00",
        location: "",
        tags: "",
        is_all_day: false,
      });
      setOpenAddDialog(false);

      // Refresh events
      const eventsResponse = await fetch(
        "https://api.onestepmedi.com:8000/events?limit=200&skip=0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const eventsData = await eventsResponse.json();
      setEvents(Array.isArray(eventsData) ? eventsData : [eventsData].filter(Boolean));
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: `Failed to create event: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const formattedEvent = {
        ...editEvent,
        date: editEvent.date ? format(editEvent.date, "yyyy-MM-dd") : null,
        start_time: editEvent.is_all_day ? "00:00:00.000Z" : `${editEvent.start_time}:00.000Z`,
        end_time: editEvent.is_all_day ? "23:59:59.999Z" : `${editEvent.end_time}:00.000Z`,
      };

      const response = await fetch(
        `https://api.onestepmedi.com:8000/events/${editEvent.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEvent),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      setOpenEditDialog(false);

      // Refresh events
      const eventsResponse = await fetch(
        "https://api.onestepmedi.com:8000/events?limit=200&skip=0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const eventsData = await eventsResponse.json();
      setEvents(Array.isArray(eventsData) ? eventsData : [eventsData].filter(Boolean));
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: `Failed to update event: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `https://api.onestepmedi.com:8000/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      // Refresh events
      const eventsResponse = await fetch(
        "https://api.onestepmedi.com:8000/events?limit=200&skip=0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const eventsData = await eventsResponse.json();
      setEvents(Array.isArray(eventsData) ? eventsData : [eventsData].filter(Boolean));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleOpenAddDialog = () => {
    console.log("Add Event button clicked, opening dialog");
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (event) => {
    console.log("Edit Event clicked, opening dialog for event:", event);
    setEditEvent({
      event_name: event.event_name,
      description: event.description || "",
      date: event.date ? new Date(event.date) : new Date(),
      start_time: event.start_time ? event.start_time.slice(0, 5) : "00:00",
      end_time: event.end_time ? event.end_time.slice(0, 5) : "00:00",
      location: event.location || "",
      tags: event.tags || "",
      is_all_day: event.is_all_day || false,
      id: event.id,
    });
    setOpenEditDialog(true);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(parseInt(month));
  };

  const handleYearChange = (year) => {
    setCurrentYear(parseInt(year));
  };

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

  const mappedEvents = events.map((evt) => ({
    id: evt.id,
    date: evt.date,
    time: evt.is_all_day ? "All Day" : evt.start_time.slice(0, 5),
    type: "event",
    title: evt.event_name,
    status: "scheduled",
    ...evt,
  }));

  const calendarEvents = [...mappedAppointments, ...mappedEmergencies, ...mappedEvents];

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

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

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
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary"
              onClick={handleOpenAddDialog}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <Label htmlFor="event_name">Event Name</Label>
                <Input
                  id="event_name"
                  value={newEvent.event_name}
                  onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newEvent.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newEvent.date}
                      onSelect={(date) => setNewEvent({ ...newEvent, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_all_day"
                  checked={newEvent.is_all_day}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_all_day: checked })}
                />
                <Label htmlFor="is_all_day">All Day Event</Label>
              </div>
              {!newEvent.is_all_day && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={newEvent.start_time}
                      onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={newEvent.end_time}
                      onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                  placeholder="e.g., meeting, urgent"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
              <div className="flex gap-2">
                <Select value={String(currentMonth)} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={month} value={String(index)}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(currentYear)} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                >
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
                    ${day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
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
              Events for {monthNames[currentMonth]} {selectedDate}, {currentYear}
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
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg space-y-2 cursor-pointer hover:bg-accent"
                    onClick={() => event.type === "event" && handleOpenEditDialog(event)}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusBadge(event.status)}>
                        {event.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                        {event.type === "event" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent edit dialog from opening
                              handleDeleteEvent(event.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
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

      {/* Edit Event Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditEvent} className="space-y-4">
            <div>
              <Label htmlFor="edit_event_name">Event Name</Label>
              <Input
                id="edit_event_name"
                value={editEvent.event_name}
                onChange={(e) => setEditEvent({ ...editEvent, event_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Input
                id="edit_description"
                value={editEvent.description}
                onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit_date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editEvent.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editEvent.date ? format(editEvent.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editEvent.date}
                    onSelect={(date) => setEditEvent({ ...editEvent, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_all_day"
                checked={editEvent.is_all_day}
                onCheckedChange={(checked) => setEditEvent({ ...editEvent, is_all_day: checked })}
              />
              <Label htmlFor="edit_is_all_day">All Day Event</Label>
            </div>
            {!editEvent.is_all_day && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_start_time">Start Time</Label>
                  <Input
                    id="edit_start_time"
                    type="time"
                    value={editEvent.start_time}
                    onChange={(e) => setEditEvent({ ...editEvent, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_end_time">End Time</Label>
                  <Input
                    id="edit_end_time"
                    type="time"
                    value={editEvent.end_time}
                    onChange={(e) => setEditEvent({ ...editEvent, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="edit_location">Location</Label>
              <Input
                id="edit_location"
                value={editEvent.location}
                onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_tags">Tags</Label>
              <Input
                id="edit_tags"
                value={editEvent.tags}
                onChange={(e) => setEditEvent({ ...editEvent, tags: e.target.value })}
                placeholder="e.g., meeting, urgent"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpenEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}