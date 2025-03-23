// app/api/auth/rehomes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the User record using the clerkId field
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Query all rehome records for this user and include the pet data
    const rehomes = await prisma.rehome.findMany({
      where: { userId: existingUser.id },
      include: { pet: true },
    });

    return NextResponse.json({ rehomes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rehomes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
