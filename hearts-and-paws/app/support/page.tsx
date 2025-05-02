"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  content: string;
  role: "user" | "admin";
  createdAt: string;
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  messages: Message[];
};

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<Record<string, string>>({});

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
  
  const handleReply = async (
    e: React.FormEvent,
    ticketId: string
  ) => {
    e.preventDefault();
    const content = reply[ticketId];
    if (!content.trim()) return;
  
    const res = await fetch(`/api/support/${ticketId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  
    if (res.ok) {
      setReply((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } else {
      alert("Failed to send message.");
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
      className="p-4 border rounded shadow-sm bg-white space-y-3"
    >
      <div className="flex justify-between items-center">
        <h4 className="font-bold">{ticket.subject}</h4>
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

      <div className="bg-gray-50 rounded p-3 space-y-2 max-h-64 overflow-y-auto">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "admin" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`text-sm px-3 py-2 rounded max-w-xs ${
                msg.role === "admin"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== "Closed" && (
        <form
          onSubmit={(e) => handleReply(e, ticket.id)}
          className="space-y-2 mt-2"
        >
          <Textarea
            placeholder="Write a message..."
            value={reply[ticket.id] || ""}
            onChange={(e) =>
              setReply((prev) => ({ ...prev, [ticket.id]: e.target.value }))
            }
          />
          <Button type="submit" disabled={!reply[ticket.id]?.trim()}>
            Send
          </Button>
        </form>
      )}
    </li>
  ))}
</ul>

        )}
      </div>
    </div>
  );
  
}
