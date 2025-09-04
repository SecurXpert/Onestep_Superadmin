import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch("https://api.onestepmedi.com:8000/contact/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load contacts");
        }

        const data = await response.json();
        // Normalize data to ensure it's an array
        const contactsArray = Array.isArray(data) ? data : Array.isArray(data.contacts) ? data.contacts : [];
        setContacts(contactsArray);
        setError(null);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError("Failed to load contacts");
        setContacts([]);
      }
    };

    fetchContacts();
  }, []);

  // Handle search by contact ID
  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://api.onestepmedi.com:8000/contact/${searchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Contact not found");
      }

      const data = await response.json();
      setSearchResult(data);
      setError(null);
    } catch (error) {
      console.error("Error searching contact:", error);
      setError("Contact not found");
      setSearchResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-primary shadow-elevated">
        <div className="absolute inset-0 bg-gradient-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Contacts List</h1>
            <p className="text-xl opacity-90">View and manage contact submissions</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Search Contact by ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter Contact ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch}>
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
          {error && <p className="text-danger mt-4">{error}</p>}
          {searchResult && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Search Result</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{searchResult.id}</TableCell>
                    <TableCell>{searchResult.name}</TableCell>
                    <TableCell>{searchResult.email}</TableCell>
                    <TableCell>{searchResult.phone_number}</TableCell>
                    <TableCell>{searchResult.subject}</TableCell>
                    <TableCell>{searchResult.message}</TableCell>
                    <TableCell>{new Date(searchResult.submitted_at).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {error && !contacts.length ? (
            <p className="text-danger">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.id}</TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone_number}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{contact.message}</TableCell>
                    <TableCell>{new Date(contact.submitted_at).toLocaleString()}</TableCell>
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