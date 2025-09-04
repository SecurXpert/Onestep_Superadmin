import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PatientReports() {
  const { id } = useParams();
  
  // Mock data - in a real app, you'd fetch this based on the ID
  const patientName = "John Smith";
  const patientId = id || "PAT001";
  
  const reports = [
    {
      id: "RPT001",
      type: "Blood Test",
      date: "2024-01-15",
      doctor: "Dr. Michael Chen",
      status: "Complete",
      category: "Lab Results",
      findings: "Normal glucose levels, slightly elevated cholesterol"
    },
    {
      id: "RPT002",
      type: "X-Ray Chest",
      date: "2024-01-10",
      doctor: "Dr. Sarah Johnson",
      status: "Complete",
      category: "Imaging",
      findings: "Clear chest, no abnormalities detected"
    },
    {
      id: "RPT003",
      type: "ECG Report",
      date: "2024-01-08",
      doctor: "Dr. Sarah Johnson",
      status: "Complete",
      category: "Cardiac",
      findings: "Normal sinus rhythm, no irregularities"
    },
    {
      id: "RPT004",
      type: "CT Scan",
      date: "2024-01-05",
      doctor: "Dr. Emily Rodriguez",
      status: "Pending Review",
      category: "Imaging",
      findings: "Awaiting radiologist review"
    },
    {
      id: "RPT005",
      type: "Lipid Profile",
      date: "2023-12-20",
      doctor: "Dr. Michael Chen",
      status: "Complete",
      category: "Lab Results",
      findings: "LDL: 145 mg/dL (slightly elevated), HDL: 45 mg/dL"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "default";
      case "Pending Review":
        return "secondary";
      case "In Progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Lab Results":
        return "bg-primary/10 text-primary";
      case "Imaging":
        return "bg-success/10 text-success";
      case "Cardiac":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Patient Reports
          </h1>
          <p className="text-muted-foreground">{patientName} (ID: {patientId})</p>
        </div>
        <Button className="bg-gradient-primary">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Reports Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {reports.filter(r => r.category === "Lab Results").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imaging</CardTitle>
            <FileText className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {reports.filter(r => r.category === "Imaging").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Calendar className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {reports.filter(r => r.status === "Pending Review").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Medical Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(report.category)}>
                      {report.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.doctor}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reports Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {reports.slice(0, 2).map((report) => (
          <Card key={report.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.type}</CardTitle>
                <Badge variant={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {report.date} • {report.doctor}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Findings:</h4>
                  <p className="text-sm text-muted-foreground">{report.findings}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}