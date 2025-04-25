import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  role: "user" | "admin";
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  messages: Message[];
}

export default function TicketThread({
  ticket,
  onSend,
}: {
  ticket: Ticket;
  onSend: (ticketId: string, content: string) => void;
}) {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="border rounded shadow-sm p-4 space-y-4 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{ticket.subject}</h2>
          <p className="text-sm text-gray-500">Status: {ticket.status}</p>
        </div>
        <p className="text-sm text-gray-400">
          {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 p-3 rounded space-y-3 max-h-72 overflow-y-auto">
        {ticket.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "admin" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded px-3 py-2 max-w-sm text-sm ${
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

      {/* Reply Box */}
      {ticket.status !== "Closed" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim()) {
              onSend(ticket.id, newMessage);
              setNewMessage("");
            }
          }}
          className="space-y-2"
        >
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">Send Message</Button>
        </form>
      )}
    </div>
  );
}
