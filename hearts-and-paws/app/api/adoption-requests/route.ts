import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// Create a new adoption request
export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { petId, message } = await req.json();

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }

    // Find the user in our database by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if pet exists and is available
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    if (pet.status !== "available") {
      return NextResponse.json({ error: "Pet is not available for adoption" }, { status: 400 });
    }

    // Check if user already has a pending request for this pet
    const existingRequest = await prisma.adoptionRequest.findFirst({
      where: {
        petId,
        requesterId: user.id,
        status: "pending",
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "You already have a pending request for this pet" }, { status: 400 });
    }

    // Create the adoption request
    const adoptionRequest = await prisma.adoptionRequest.create({
      data: {
        petId,
        requesterId: user.id,
        message,
      },
    });

    // Update pet status to pending
    await prisma.pet.update({
      where: { id: petId },
      data: { status: "pending" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Adoption request submitted successfully",
        adoptionRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating adoption request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all adoption requests for a user (as requester or pet owner)
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "all"; // 'sent', 'received', or 'all'

    let requests = [];

    if (type === "sent" || type === "all") {
      // Requests sent by the user
      const sentRequests = await prisma.adoptionRequest.findMany({
        where: { requesterId: user.id },
        include: {
          pet: {
            include: {
              owner: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (type === "sent") {
        requests = sentRequests;
      } else {
        requests = [...sentRequests];
      }
    }

    if (type === "received" || type === "all") {
      // Requests received by the user (as pet owner)
      const receivedRequests = await prisma.adoptionRequest.findMany({
        where: {
          pet: {
            ownerId: user.id,
          },
        },
        include: {
          pet: true,
          requester: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (type === "received") {
        requests = receivedRequests;
      } else {
        requests = [...requests, ...receivedRequests];
      }
    }

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
