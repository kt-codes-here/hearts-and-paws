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
        <Button type="submit">Submit</Button>
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
              <li key={ticket.id} className="p-4 border rounded shadow-sm">
                <p>
                  <strong>Subject:</strong> {ticket.subject}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      ticket.status === "closed"
                        ? "text-red-600"
                        : ticket.status === "in_progress"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }
                  >
                    {ticket.status}
                  </span>
                </p>
                <p className="mt-2">
                  <strong>Message:</strong> {ticket.message}
                </p>
                {ticket.response && (
                  <p className="mt-2 text-green-700">
                    <strong>Admin Response:</strong> {ticket.response}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
