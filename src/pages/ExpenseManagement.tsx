import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Home } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function ExpenseManagement() {
  const [financeData, setFinanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch finance data
        const financeResponse = await fetch("https://api.onestepmedi.com:8000/finance/appointment-income-summary", {
          headers,
        });
        if (!financeResponse.ok) {
          throw new Error("Failed to fetch finance data");
        }
        const financeResult = await financeResponse.json();
        setFinanceData(financeResult.data || null);

        // Fetch recent transactions
        const transactionsResponse = await fetch("https://api.onestepmedi.com:8000/payments/summary", {
          headers,
        });
        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions data");
        }
        const transactionsResult = await transactionsResponse.json();

        // Ensure transactionsResult.summary is an array
        const transactionsArray = Array.isArray(transactionsResult.summary) ? transactionsResult.summary : [];

        // Map transactions
        const formattedTransactions = transactionsArray
          .filter(doctor => Array.isArray(doctor.payments) && doctor.payments.length > 0)
          .flatMap(doctor => doctor.payments.map(payment => ({
            id: payment.transaction_id,
            type: payment.amount > 0 ? "Income" : "Settlement",
            amount: payment.amount,
            description: `${payment.description} for ${doctor.doctor_name} (${doctor.specialization.specialization_name})`,
            date: payment.date,
          })));
        setTransactions(formattedTransactions);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load financial data");
        setFinanceData(null);
        setTransactions([]);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a valid Excel (.xlsx) file.",
      });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select an Excel file to upload.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://api.onestepmedi.com:8000/dm-leads/lead_url", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast({
        title: "Success",
        description: "Excel file uploaded successfully!",
      });
      setOpenDialog(false);
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload the Excel file. Please try again.",
      });
    }
  };

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  if (!financeData || !transactions) {
    return <div className="text-center p-6">Loading...</div>;
  }

  const monthlyData = Array.isArray(financeData.monthly) ? financeData.monthly.map((m) => ({
    period: m.month,
    total: m.total,
    normal: m.normal,
    emergency: m.emergency,
  })) : [];

  const weeklyData = Array.isArray(financeData.weekly) ? financeData.weekly.map((w) => ({
    period: w.week,
    total: w.total,
    normal: w.normal,
    emergency: w.emergency,
  })) : [];

  const pieData = financeData.normal_breakdown_by_type_percent ? Object.entries(financeData.normal_breakdown_by_type_percent).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
    value: value,
    color:
      key === "virtual"
        ? "hsl(var(--primary))"
        : key === "home_visit"
        ? "hsl(var(--success))"
        : key === "clinic_visit"
        ? "hsl(var(--warning))"
        : "hsl(var(--info))",
  })) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
         Expense Management
        </h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>With Doctor DM</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Doctor DM Excel</DialogTitle>
              <DialogDescription>
                Please upload an Excel file containing Doctor DM data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
              />
              <Button onClick={handleUpload} disabled={!file}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financeData.totals?.total_income?.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Home Visit Income</CardTitle>
            <Home className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${financeData.totals?.normal_appointments_income?.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Appointments Income</CardTitle>
            <DollarSign className="h-5 w-5 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">${financeData.totals?.emergency_appointments_income?.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Income Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" className="relative mr-auto w-full">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Total Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="normal" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Home Visit Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emergency" 
                      stroke="hsl(var(--info))" 
                      strokeWidth={2}
                      name="Emergency Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="weekly">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Total Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="normal" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Home Visit Income"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emergency" 
                      stroke="hsl(var(--info))" 
                      strokeWidth={2}
                      name="Emergency Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === "Income" ? "default" : "destructive"}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className={transaction.amount > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}