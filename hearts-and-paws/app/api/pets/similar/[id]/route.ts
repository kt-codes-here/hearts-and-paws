import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const petId =  params?.id;

    if (!petId) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // First, get the current pet to find similar ones
    const currentPet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
      select: {
        breed: true,
        size: true,
        gender: true,
      },
    });

    if (!currentPet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    // Find similar pets based on breed, excluding the current pet
    const similarPets = await prisma.pet.findMany({
      where: {
        AND: [
          { id: { not: petId } },
          { breed: currentPet.breed },
        ],
      },
      take: 4, // Limit to 4 similar pets
      select: {
        id: true,
        name: true,
        gender: true,
        breed: true,
        images: true,
      },
    });

    // Transform the data for the frontend
    const transformedPets = similarPets.map(pet => ({
      id: pet.id,
      name: pet.name,
      gender: pet.gender,
      breed: pet.breed,
      image: pet.images.length > 0 ? pet.images[0] : "",
    }));

    return NextResponse.json(transformedPets);
  } catch (error) {
    console.error("Error fetching similar pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar pets" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 