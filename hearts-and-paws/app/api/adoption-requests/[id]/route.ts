import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    const requestId = params.id;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the user in our database by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the adoption request
    const adoptionRequest = await prisma.adoptionRequest.findUnique({
      where: { id: requestId },
      include: {
        pet: true,
      },
    });

    if (!adoptionRequest) {
      return NextResponse.json({ error: "Adoption request not found" }, { status: 404 });
    }

    // Check if the user is the pet owner
    if (adoptionRequest.pet.ownerId !== user.id) {
      return NextResponse.json({ error: "You are not authorized to update this request" }, { status: 403 });
    }

    // Update the adoption request status
    const updatedRequest = await prisma.adoptionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // If approved, update pet status to adopted
    if (status === "approved") {
      await prisma.pet.update({
        where: { id: adoptionRequest.petId },
        data: {
          status: "adopted",
          isAdopted: true,
          adoptedBy: adoptionRequest.requesterId,
        },
      });

      // Reject all other pending requests for this pet
      await prisma.adoptionRequest.updateMany({
        where: {
          petId: adoptionRequest.petId,
          id: { not: requestId },
          status: "pending",
        },
        data: { status: "rejected" },
      });
    } else if (status === "rejected") {
      // If this was the last pending request, set pet status back to available
      const pendingRequests = await prisma.adoptionRequest.count({
        where: {
          petId: adoptionRequest.petId,
          status: "pending",
        },
      });

      if (pendingRequests === 0) {
        await prisma.pet.update({
          where: { id: adoptionRequest.petId },
          data: { status: "available" },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Adoption request ${status}`,
        adoptionRequest: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating adoption request:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
