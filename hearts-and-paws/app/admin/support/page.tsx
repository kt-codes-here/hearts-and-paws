"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TicketFilters from "@/components/global/support/TicketFilter";
// import { Select } from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  role: "user" | "admin";
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  messages: Message[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleReply = async (ticketId: string) => {
    const content = responses[ticketId];
    const status = statuses[ticketId];

    if (!content.trim()) return;

    const res = await fetch(`/api/admin/support/${ticketId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, status }),
    });

    if (res.ok) {
      setResponses((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Admin Support Dashboard</h1>
      {!loading && tickets.length > 0 && (
    <TicketFilters
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  )}

      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No support tickets found.</p>
      ) : (
        tickets
          .filter((ticket) =>
            statusFilter === "All" ? true : ticket.status === statusFilter
          )
          .filter((ticket) =>
            searchQuery.trim() === ""
              ? true
              : ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded p-4 shadow-sm space-y-4 bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold">{ticket.subject}</h2>
                  <p className="text-sm text-gray-600">
                    From: {ticket.user.firstName} {ticket.user.lastName} (
                    {ticket.user.email})
                  </p>
                </div>
                <select
                  className="border p-1 rounded"
                  value={statuses[ticket.id] || ticket.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;

                    setStatuses((prev) => ({
                      ...prev,
                      [ticket.id]: newStatus,
                    }));

                    const res = await fetch(`/api/admin/support/${ticket.id}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: newStatus }),
                    });

                    if (res.ok) {
                      fetchTickets();
                    }
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded p-3 space-y-2 max-h-64 overflow-y-auto">
                {ticket.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "admin" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`text-sm px-3 py-2 rounded max-w-sm ${
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

              {!["Pending", "Closed"].includes(ticket.status) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(ticket.id);
                  }}
                  className="space-y-2 mt-2"
                >
                  <Textarea
                    placeholder="Write a reply..."
                    value={responses[ticket.id] || ""}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [ticket.id]: e.target.value,
                      }))
                    }
                  />
                  <Button type="submit">Send Reply</Button>
                </form>
              )}

              {["Pending", "Closed"].includes(ticket.status) && (
                <div className="text-sm text-gray-500 italic mt-2">
                  Change ticket status to <strong>In Progress</strong> or{" "}
                  <strong>Resolved</strong> to respond.
                </div>
              )}
            </div>
          ))
          
      )}
    </div>
  );
}
