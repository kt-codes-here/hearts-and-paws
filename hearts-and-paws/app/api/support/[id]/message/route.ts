import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const { content } = await req.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  // Optional: confirm ticket belongs to this user
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: params.id },
  });

  if (!ticket || ticket.userId !== user!.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const message = await prisma.supportMessage.create({
    data: {
      ticketId: params.id,
      senderId: user!.id,
      content: content.trim(),
      role: "user",
    },
  });

  return NextResponse.json(message, { status: 201 });
}
