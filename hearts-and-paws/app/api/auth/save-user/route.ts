import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, email, firstName, lastName, profileImage } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!existingUser) {
      console.log("Creating new user...");
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          firstName,
          lastName,
          profileImage,
        },
      });
      console.log("User successfully created!");
    } else {
      console.log("User already exists, skipping creation.");
    }

    return NextResponse.json({ success: "User data saved" });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
