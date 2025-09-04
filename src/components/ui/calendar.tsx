import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, AlertTriangle } from "lucide-react";

// Mock calendar data - in a real app, this would come from an API
const calendarEvents = [
  { 
    id: 1, 
    date: "2024-01-15", 
    time: "10:00 AM", 
    type: "appointment", 
    title: "Dr. Johnson - John Smith", 
    status: "confirmed" 
  },
  { 
    id: 2, 
    date: "2024-01-15", 
    time: "11:30 AM", 
    type: "emergency", 
    title: "Emergency - Emma Davis", 
    status: "urgent" 
  },
  { 
    id: 3, 
    date: "2024-01-16", 
    time: "2:00 PM", 
    type: "appointment", 
    title: "Dr. Chen - Robert Johnson", 
    status: "confirmed" 
  },
  { 
    id: 4, 
    date: "2024-01-17", 
    time: "9:00 AM", 
    type: "event", 
    title: "Staff Meeting", 
    status: "scheduled" 
  },
  { 
    id: 5, 
    date: "2024-01-17", 
    time: "3:30 PM", 
    type: "appointment", 
    title: "Dr. Wilson - Maria Garcia", 
    status: "pending" 
  },
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

// Generate calendar days
const generateCalendarDays = () => {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const days = generateCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const getEventTypeColor = (type: string) => {
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

  const getStatusBadge = (status: string) => {
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
              {calendarEvents.filter(e => e.type === "appointment").length}
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
              {calendarEvents.filter(e => e.type === "emergency").length}
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
              {calendarEvents.filter(e => e.type === "event").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{monthNames[currentMonth]} {currentYear}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center font-medium text-muted-foreground">
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
                    ${day === null ? 'invisible' : ''}
                    ${day === currentDate.getDate() ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                    ${day === selectedDate ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className="font-medium">{day}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day).slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
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
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
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