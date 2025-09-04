import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Define interfaces for TypeScript
interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string[];
  status: string;
}

interface AdminForm {
  name: string;
  phone_number: string;
  dob: string;
  email: string;
  password: string;
}

interface SuperAdminForm {
  name: string;
  phone_number: string;
  dob: string;
  email: string;
  password: string;
  role: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState<AdminForm>({
    name: "",
    phone_number: "",
    dob: "2025-08-30",
    email: "",
    password: "",
  });
  const [superAdminForm, setSuperAdminForm] = useState<SuperAdminForm>({
    name: "",
    phone_number: "",
    dob: "2025-08-30",
    email: "",
    password: "",
    role: "patient",
  });
  const [openAdminDialog, setOpenAdminDialog] = useState<boolean>(false);
  const [openSuperAdminDialog, setOpenSuperAdminDialog] = useState<boolean>(false);

  // Fetch admin and superadmin data
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch("https://api.onestepmedi.com:8000/patient/admin_superadmin_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const data = await response.json();
        const adminList: Admin[] = [
          ...(Array.isArray(data.admins) ? data.admins.map((email: string, index: number) => ({
            id: `ADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Admin",
            email,
            role: "Admin",
            access: ["Doctors", "Patients", "Appointments"],
            status: "Active",
          })) : []),
          ...(Array.isArray(data.superadmin_emails) ? data.superadmin_emails.map((email: string, index: number) => ({
            id: `SADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Super Admin",
            email,
            role: "Super Admin",
            access: ["All Access"],
            status: "Active",
          })) : []),
        ];

        setAdmins(adminList);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const getRoleColor = (role: string): string => {
    switch (role) {
      case "Super Admin": return "destructive";
      case "Manager": return "default";
      case "Moderator": return "secondary";
      case "Assistant": return "outline";
      default: return "default";
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("https://api.onestepmedi.com:8000/superadmin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(adminForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin created successfully",
        });
        setOpenAdminDialog(false);
        setAdminForm({
          name: "",
          phone_number: "",
          dob: "2025-08-30",
          email: "",
          password: "",
        });
        // Refresh admin list
        const refreshResponse = await fetch("https://api.onestepmedi.com:8000/patient/admin_superadmin_data", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await refreshResponse.json();
        const adminList: Admin[] = [
          ...(Array.isArray(data.admins) ? data.admins.map((email: string, index: number) => ({
            id: `ADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Admin",
            email,
            role: "Admin",
            access: ["Doctors", "Patients", "Appointments"],
            status: "Active",
          })) : []),
          ...(Array.isArray(data.superadmin_emails) ? data.superadmin_emails.map((email: string, index: number) => ({
            id: `SADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Super Admin",
            email,
            role: "Super Admin",
            access: ["All Access"],
            status: "Active",
          })) : []),
        ];
        setAdmins(adminList);
      } else {
        throw new Error("Failed to create admin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSuperAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("https://api.onestepmedi.com:8000/superadmin/create-superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(superAdminForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Super Admin created successfully",
        });
        setOpenSuperAdminDialog(false);
        setSuperAdminForm({
          name: "",
          phone_number: "",
          dob: "2025-08-30",
          email: "",
          password: "",
          role: "patient",
        });
        // Refresh admin list
        const refreshResponse = await fetch("https://api.onestepmedi.com:8000/patient/admin_superadmin_data", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await refreshResponse.json();
        const adminList: Admin[] = [
          ...(Array.isArray(data.admins) ? data.admins.map((email: string, index: number) => ({
            id: `ADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Admin",
            email,
            role: "Admin",
            access: ["Doctors", "Patients", "Appointments"],
            status: "Active",
          })) : []),
          ...(Array.isArray(data.superadmin_emails) ? data.superadmin_emails.map((email: string, index: number) => ({
            id: `SADM${String(index + 1).padStart(3, "0")}`,
            name: email.split("@")[0] || "Super Admin",
            email,
            role: "Super Admin",
            access: ["All Access"],
            status: "Active",
          })) : []),
        ];
        setAdmins(adminList);
      } else {
        throw new Error("Failed to create super admin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Admins Management
        </h1>
        <div className="space-x-2">
          <Dialog open={openAdminDialog} onOpenChange={setOpenAdminDialog}>
            <DialogTrigger asChild>
              <Button>Add Admin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={adminForm.phone_number}
                    onChange={(e) => setAdminForm({ ...adminForm, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Create Admin</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={openSuperAdminDialog} onOpenChange={setOpenSuperAdminDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">Add Super Admin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Super Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSuperAdminSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="super_name">Name</Label>
                  <Input
                    id="super_name"
                    value={superAdminForm.name}
                    onChange={(e) => setSuperAdminForm({ ...superAdminForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="super_phone_number">Phone Number</Label>
                  <Input
                    id="super_phone_number"
                    value={superAdminForm.phone_number}
                    onChange={(e) => setSuperAdminForm({ ...superAdminForm, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="super_email">Email</Label>
                  <Input
                    id="super_email"
                    type="email"
                    value={superAdminForm.email}
                    onChange={(e) => setSuperAdminForm({ ...superAdminForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="super_password">Password</Label>
                  <Input
                    id="super_password"
                    type="password"
                    value={superAdminForm.password}
                    onChange={(e) => setSuperAdminForm({ ...superAdminForm, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="super_role">Role</Label>
                  <Input
                    id="super_role"
                    value={superAdminForm.role}
                    onChange={(e) => setSuperAdminForm({ ...superAdminForm, role: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Create Super Admin</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{admins.filter(admin => admin.status === "Active").length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(admins.map(admin => admin.role)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Admin List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center p-6">Loading...</div>}
          {error && <div className="text-red-500 text-center p-6">{error}</div>}
          {!loading && !error && admins.length === 0 && <div className="text-center p-6">No admins found.</div>}
          {!loading && !error && admins.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access Permissions</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/avatars/${admin.id}.jpg`} />
                          <AvatarFallback>{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(admin.role)}>
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {admin.access.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.status === "Active" ? "default" : "secondary"}>
                        {admin.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}