import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Phone, Mail, Calendar, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctor profile");
        }
        const data = await response.json();
        const doctorData = {
          id: data.doctor_id,
          name: data.doctor_name,
          specialization: data.specialization_name,
          experience: `${data.experience_years} years`,
          rating: 4.8,
          phone: data.phone,
          email: data.email,
          address: `${data.clinic_location}, ${data.address}`,
          education: [data.degree.toUpperCase()],
          certifications: [],
          languages: ["English"],
          status: "Active",
          consultation_fee: data.consultation_fee,
          degree: data.degree,
          about: data.about,
          work_location: data.work_location,
          clinic_location: data.clinic_location,
          image: data.image,
        };
        setDoctor(doctorData);
        setFormData({
          address: data.address || "",
          consultation_fee: data.consultation_fee || "",
          degree: data.degree || "",
          about: data.about || "",
          phone: data.phone || "",
          experience_years: data.experience_years || "",
          work_location: data.work_location || "",
          clinic_location: data.clinic_location || "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://api.onestepmedi.com:8000/doctors/profile/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor profile");
      }

      const updatedData = await response.json();
      setDoctor((prev) => ({
        ...prev,
        address: `${updatedData.clinic_location || prev.clinic_location}, ${updatedData.address || prev.address}`,
        consultation_fee: updatedData.consultation_fee || prev.consultation_fee,
        degree: updatedData.degree || prev.degree,
        about: updatedData.about || prev.about,
        phone: updatedData.phone || prev.phone,
        experience: `${updatedData.experience_years || prev.experience_years} years`,
        work_location: updatedData.work_location || prev.work_location,
        clinic_location: updatedData.clinic_location || prev.clinic_location,
        image: updatedData.image || prev.image,
      }));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating doctor profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Doctor Profile
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
            {doctor.status}
          </Badge>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Doctor Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <Label htmlFor="consultation_fee">Consultation Fee</Label>
                  <Input
                    id="consultation_fee"
                    name="consultation_fee"
                    type="number"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    placeholder="Enter consultation fee"
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="Enter degree"
                  />
                </div>
                <div>
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Enter about information"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={handleInputChange}
                    placeholder="Enter years of experience"
                  />
                </div>
                <div>
                  <Label htmlFor="work_location">Work Location</Label>
                  <Input
                    id="work_location"
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleInputChange}
                    placeholder="Enter work location"
                  />
                </div>
                <div>
                  <Label htmlFor="clinic_location">Clinic Location</Label>
                  <Input
                    id="clinic_location"
                    name="clinic_location"
                    value={formData.clinic_location}
                    onChange={handleInputChange}
                    placeholder="Enter clinic location"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Profile Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={doctor.image || `/avatars/${doctor.id}.jpg`} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{doctor.name}</CardTitle>
            <Badge variant="outline" className="mt-2">
              {doctor.specialization}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{doctor.rating}</span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {doctor.experience} of experience
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Fee: ${doctor.consultation_fee}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Available Mon-Fri, 9:00 AM - 6:00 PM</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {doctor.education.map((edu, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.certifications.length > 0 ? (
              <ul className="space-y-2">
                {doctor.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No certifications available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {doctor.languages.map((language, index) => (
              <Badge key={index} variant="secondary">
                {language}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{doctor.about || "No additional information available"}</p>
        </CardContent>
      </Card>
    </div>
  );
}