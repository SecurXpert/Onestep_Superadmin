import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper to format time difference
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  // Fetch notifications from APIs
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Fetch emergency appointments
      const emergencyResponse = await fetch("https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/", {
        headers
      });
      if (!emergencyResponse.ok) {
        throw new Error("Failed to fetch emergency appointments");
      }
      const emergencyData = await emergencyResponse.json();
      
      // Fetch regular appointments
      const appointmentsResponse = await fetch("https://api.onestepmedi.com:8000/appointments/appointments/", {
        headers
      });
      if (!appointmentsResponse.ok) {
        throw new Error("Failed to fetch regular appointments");
      }
      const appointmentsData = await appointmentsResponse.json();

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Process emergency notifications
      const emergencyNotifications = Array.isArray(emergencyData) ? emergencyData.map(appointment => ({
        id: appointment.appointment_id,
        type: "emergency",
        title: "Emergency Appointment Request",
        message: `Patient ${appointment.name || 'Unknown'} has requested an emergency appointment for ${appointment.problem_description || 'No description'}`,
        time: formatTimeAgo(appointment.created_at),
        read: false,
        created_at: appointment.created_at
      })) : [];

      // Process regular appointments (including 30min/5min reminders)
      const appointmentNotifications = Array.isArray(appointmentsData) ? appointmentsData
        .filter(apt => {
          const aptDateTime = new Date(`${apt.preferred_date}T${apt.time_slot}`);
          const timeDiff = (aptDateTime - now) / 60000; // minutes
          return timeDiff <= 30 && timeDiff >= -5; // Notify for 30min and 5min before
        })
        .map(appointment => ({
          id: appointment.appointment_id,
          type: appointment.status === "confirmed" ? "success" : "info",
          title: appointment.status === "confirmed" ? "Appointment Confirmed" : "Appointment Scheduled",
          message: `Appointment with ${appointment.doctor_name || 'Unknown'} for ${appointment.name || 'Unknown'} at ${appointment.time_slot || 'N/A'}`,
          time: formatTimeAgo(appointment.created_at),
          read: false,
          created_at: appointment.created_at
        })) : [];

      // Combine and sort notifications by created_at
      const allNotifications = [...emergencyNotifications, ...appointmentNotifications]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case "emergency":
        return "destructive";
      case "warning":
        return "outline";
      case "success":
        return "default";
      case "info":
      default:
        return "secondary";
    }
  };

  // Count today's notifications
  const todayCount = notifications.filter(n => {
    const notificationDate = new Date(n.created_at).toISOString().split("T")[0];
    return notificationDate === new Date().toISOString().split("T")[0];
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-2 py-1">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      {/* Notification Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === "emergency").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Bell className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`shadow-card transition-all duration-200 ${
              !notification.read 
                ? "border-l-4 border-l-primary bg-accent/10" 
                : "hover:shadow-elevated"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-card-foreground">
                        {notification.title}
                      </h3>
                      <Badge variant={getNotificationBadge(notification.type)} className="text-xs">
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {notification.message || 'No message available'} {/* Ensure message is displayed */}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => markAsRead(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}