// app/api/complete-registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const allowedRoles = [1, 2, 3];

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const role = Number(body.role);
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    await prisma.user.update({
      where: { clerkId: userId },
      data: { role },
    });
    return NextResponse.json({ message: "Registration complete" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
