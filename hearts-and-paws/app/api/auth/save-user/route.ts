import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse incoming data including role (as a number)
    const { userId, email, firstName, lastName, profileImage, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check if user already exists based on clerkId
    const existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!existingUser) {
      console.log("Creating new user with registration details...");
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          firstName,
          lastName,
          profileImage,
          role, 
        },
      });
      console.log("User successfully created!");
    } else {
      console.log("User already exists. Updating registration details...");
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email, // Optional: update email if needed
          firstName,
          lastName,
          profileImage,
          role, // Update the user's role based on registration form data
        },
      });
      console.log("User registration data updated!");
    }

    return NextResponse.json({ success: "User data saved" });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
