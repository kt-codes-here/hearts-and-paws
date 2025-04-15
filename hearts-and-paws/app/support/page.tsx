"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/support", {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    });

    if (res.ok) {
      alert("Ticket submitted!");
      router.push("/");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-8">
      <h2 className="text-2xl font-bold">Submit a Support Ticket</h2>
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required />
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." rows={5} required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
