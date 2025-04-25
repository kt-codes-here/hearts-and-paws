// /api/admin/support/route.ts

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
  const { userId } = await auth();
   if (!userId) {
      redirect("/"); // Not logged in
    }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user || user.role !== 4) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}
