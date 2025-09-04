import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Admins from "./pages/Admins";
import ExpenseManagement from "./pages/ExpenseManagement";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorPortfolio from "./pages/DoctorPortfolio";
import PatientDetails from "./pages/PatientDetails";
import PatientReports from "./pages/PatientReports";
import ContactsList from "./components/ui/Contacts";
import AddPortfolio from "./pages/AddPortfolio";
import Calendar from "./pages/Calendar"; // Updated import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<SidebarProvider><AdminLayout /></SidebarProvider>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id/profile" element={<DoctorProfile />} />
            <Route path="/doctors/:doctor_id/portfolio" element={<DoctorPortfolio />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id/details" element={<PatientDetails />} />
            <Route path="/patients/:id/reports" element={<PatientReports />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/expense-management" element={<ExpenseManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/addportfolio" element={<AddPortfolio />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;