import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!admin || admin.role !== 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { content, status } = await req.json();

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: params.id },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Create admin message
  await prisma.supportMessage.create({
    data: {
      ticketId: ticket.id,
      senderId: admin.id,
      role: "admin",
      content: content.trim(),
    },
  });

  // Optionally update ticket status
  const updatedTicket = await prisma.supportTicket.update({
    where: { id: ticket.id },
    data: {
      status: status || ticket.status,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json(updatedTicket);
}
