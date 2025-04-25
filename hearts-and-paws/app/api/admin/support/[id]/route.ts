// /api/admin/support/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
   if (!userId) {
        redirect("/"); // Not logged in
      }
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user || user.role !== 4) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { response, status } = await req.json();
  const allowedStatuses = ["Open", "In Progress", "Resolved", "Closed"];

  if (status && !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.supportTicket.update({
    where: { id: params.id },
    data: {
     
      status: status || undefined,
    },
  });

  return NextResponse.json(updated);
}
