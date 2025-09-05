import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Calendar, DollarSign, User, Siren } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import dashboardHero from "@/assets/dashboard-hero.jpg";

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState([
    { title: "Total Doctors", value: "0", icon: UserCheck, color: "text-primary" },
    { title: "Total Patients", value: "0", icon: Users, color: "text-success" },
    { title: "Appointments", value: "0", icon: Calendar, color: "text-warning" },
    { title: "Revenue Generated", value: "$0", icon: DollarSign, color: "text-primary" },
    { title: "Total Admins", value: "0", icon: User, color: "text-info" },
    { title: "Emergency Appointments", value: "0", icon: Siren, color: "text-danger" },
  ]);

  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Fetch patient counts
    fetch("https://api.onestepmedi.com:8000/patient/count_all", {
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Patient count API failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.title === "Total Doctors") return { ...stat, value: data.doctors.toString() };
            if (stat.title === "Total Patients") return { ...stat, value: data.patients.toString() };
            if (stat.title === "Appointments") return { ...stat, value: data.appointments.toString() };
            if (stat.title === "Total Admins") return { ...stat, value: data.admins.toString() };
            if (stat.title === "Emergency Appointments") return { ...stat, value: data.emergency_appointments.toString() };
            return stat;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
        toast({
          title: "Error",
          description: `Failed to fetch counts: ${error.message}`,
          variant: "destructive",
        });
      });

    // Fetch finance data
    fetch("https://api.onestepmedi.com:8000/finance/appointment-income-summary", {
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Finance API failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          // Update Revenue Generated stat
          setStats((prevStats) =>
            prevStats.map((stat) =>
              stat.title === "Revenue Generated"
                ? { ...stat, value: `$${data.data.totals.total_income.toLocaleString()}` }
                : stat
            )
          );

          // Update revenue data for chart
          setRevenueData(
            data.data.monthly.map((item) => ({
              name: item.month,
              revenue: item.total,
              appointments: item.normal + item.emergency,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching finance data:", error);
        toast({
          title: "Error",
          description: `Failed to fetch finance data: ${error.message}`,
          variant: "destructive",
        });
      });

    // Fetch regular appointments
    fetch("https://api.onestepmedi.com:8000/appointments/appointments/", {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Appointments API failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const normalizedData = Array.isArray(data) ? data : [data].filter(Boolean);
        setStats((prevStats) =>
          prevStats.map((stat) =>
            stat.title === "Appointments" ? { ...stat, value: normalizedData.length.toString() } : stat
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: `Failed to fetch appointments: ${error.message}`,
          variant: "destructive",
        });
      });

    // Fetch emergency appointments
    fetch("https://api.onestepmedi.com:8000/emergency/payment_conf_appointments/", {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Emergency appointments API failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const normalizedData = Array.isArray(data) ? data : [data].filter(Boolean);
        setStats((prevStats) =>
          prevStats.map((stat) =>
            stat.title === "Emergency Appointments" ? { ...stat, value: normalizedData.length.toString() } : stat
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching emergency appointments:", error);
        toast({
          title: "Error",
          description: `Failed to fetch emergency appointments: ${error.message}`,
          variant: "destructive",
        });
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-48 rounded-xl overflow-hidden bg-gradient-primary shadow-elevated"
        style={{ backgroundImage: `url(${dashboardHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome to Super Admin Dashboard</h1>
            <p className="text-xl opacity-90">Manage your healthcare system efficiently</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Appointments Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}