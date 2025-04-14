
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, message } = await req.json();
  const email = sessionClaims?.email;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user!.id,
      subject,
      message,
    },
  });

  return NextResponse.json(ticket);
}
