import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const petId = params?.id;

    if (!petId) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // Fetch the pet with owner and rehome information
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
        rehomes: {
          select: {
            reason: true,
            durationToKeepPet: true,
            createdAt: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    // Transform the data for the frontend
    const transformedPet = {
      ...pet,
      owner: {
        name: `${pet.owner.firstName || ""} ${pet.owner.lastName || ""}`.trim(),
        email: pet.owner.email,
        profileImage: pet.owner.profileImage,
      },
      rehomeInfo: pet.rehomes[0] ? {
        reason: pet.rehomes[0].reason,
        durationToKeepPet: pet.rehomes[0].durationToKeepPet,
        listedDate: pet.rehomes[0].createdAt,
      } : undefined,
    };

    return NextResponse.json(transformedPet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { error: "Failed to fetch pet data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 