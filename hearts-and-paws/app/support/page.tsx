"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  response?: string | null;
  createdAt: string;
};

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTickets = async () => {
    setLoading(true);
    const res = await fetch("/api/support");
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Required!
      },
      body: JSON.stringify({ subject, message }),
    });
  
    if (res.ok) {
      setSubject("");
      setMessage("");
      fetchTickets(); // 🔄 Refresh ticket list
    } else {
      alert("Something went wrong");
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-8">
      {/* Support Ticket Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">Submit a Support Ticket</h2>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          rows={4}
          required
        />
        <Button type="submit" disabled={!subject || !message}>
          Submit
        </Button>
      </form>
  
      {/* Submitted Ticket History */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Your Submitted Tickets</h3>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">No tickets submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="p-4 border rounded shadow-sm bg-white space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p>
                    <strong>Subject:</strong> {ticket.subject}
                  </p>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      ticket.status === "Closed"
                        ? "bg-red-100 text-red-700"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p>
                  <strong>Message:</strong> {ticket.message}
                </p>
                {ticket.response && (
                  <p className="text-green-700">
                    <strong>Admin Response:</strong> {ticket.response}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Submitted on: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
}
