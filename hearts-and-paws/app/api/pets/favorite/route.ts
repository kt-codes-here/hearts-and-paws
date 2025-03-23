import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// This would require extending your schema with a Favorite model
// You would need to add this to your schema.prisma file:
/*
model Favorite {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, petId])
}
*/

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { petId } = await request.json();

    if (!petId) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // Find the user by Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Note: This is a placeholder since the Favorite model doesn't exist yet
    // You would need to add the Favorite model to your schema
    // For now, we'll just return a success message
    
    return NextResponse.json({
      message: "Pet favorited successfully",
      petId,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error favoriting pet:", error);
    return NextResponse.json(
      { error: "Failed to favorite pet" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { petId } = await request.json();

    if (!petId) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // Find the user by Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Note: This is a placeholder since the Favorite model doesn't exist yet
    // You would need to add the Favorite model to your schema
    // For now, we'll just return a success message
    
    return NextResponse.json({
      message: "Pet unfavorited successfully",
      petId,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error unfavoriting pet:", error);
    return NextResponse.json(
      { error: "Failed to unfavorite pet" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 