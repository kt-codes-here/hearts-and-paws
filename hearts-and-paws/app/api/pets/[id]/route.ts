import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is awaited before accessing properties
    const petId = params?.id;

    if (!petId) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // Fetch the pet with owner information
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
      },
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the format expected by the PetProfile component
    const transformedPet = {
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      color: pet.colors,
      weight: "", // Not in schema, could be added later
      height: "", // Not in schema, could be added later
      gender: pet.gender,
      location: `${pet.city}, ${pet.postcode}`,
      images: pet.images,
      mainImage: pet.images.length > 0 ? pet.images[0] : "",
      story: pet.additionalInfo || "",
      vaccination: {
        week8: pet.shotsUpToDate ? "Complete" : "Incomplete",
        week14: pet.shotsUpToDate ? "Complete" : "Incomplete",
        week22: pet.shotsUpToDate ? "Complete" : "Incomplete",
      },
      traits: [
        pet.goodWithDogs ? "Good with dogs" : null,
        pet.goodWithCats ? "Good with cats" : null,
        pet.goodWithKids ? "Good with kids" : null,
        pet.houseTrained ? "House trained" : null,
        pet.microchipped ? "Microchipped" : null,
        pet.shotsUpToDate ? "Shots up to date" : null,
        pet.specialNeeds ? "Special needs" : null,
      ].filter(Boolean) as string[],
      distance: "", // Could calculate based on user location
      country: "United States Of America", // Hardcoded for now, could be added to schema
      owner: {
        name: `${pet.owner.firstName || ""} ${pet.owner.lastName || ""}`.trim(),
        email: pet.owner.email,
        profileImage: pet.owner.profileImage,
      }
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