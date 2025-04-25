// app/admin/support/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  response?: string | null;
  createdAt: string;
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>({});
  // Add in the state section
const [statuses, setStatuses] = useState<Record<string, string>>({});


  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/support");
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  };

  const handleRespond = async (ticketId: string) => {
    const responseText = responses[ticketId];
    const newStatus = statuses[ticketId] || "";
  
    if (!responseText.trim() && !newStatus) return;
  
    const res = await fetch(`/api/admin/support/${ticketId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: responseText.trim(),
        status: newStatus,
      }),
    });
  
    if (res.ok) {
      fetchTickets();
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin Support Dashboard</h1>
      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No support tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="border rounded p-4 shadow-sm space-y-3">
            <p>
              <strong>From:</strong> {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
            </p>
            <p>
              <strong>Subject:</strong> {ticket.subject}
            </p>
            <p>
              <strong>Message:</strong> {ticket.message}
            </p>
            <div>
  <strong>Status:</strong>{" "}
  <select
    className="border p-1 rounded"
    value={statuses[ticket.id] || ticket.status}
    onChange={(e) =>
      setStatuses((prev) => ({ ...prev, [ticket.id]: e.target.value }))
    }
  >
    <option value="Pending">Pending</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Closed">Closed</option>
  </select>
</div>

            {ticket.response && (
              <p className="text-green-600">
                <strong>Admin Response:</strong> {ticket.response}
              </p>
            )}
            <Textarea
              placeholder="Write a response..."
              value={responses[ticket.id] || ""}
              onChange={(e) =>
                setResponses((prev) => ({ ...prev, [ticket.id]: e.target.value }))
              }
            />
            <Button onClick={() => handleRespond(ticket.id)}>Send Response</Button>
          </div>
        ))
      )}
    </div>
  );
}
