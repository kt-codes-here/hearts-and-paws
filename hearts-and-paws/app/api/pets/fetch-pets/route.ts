import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Extract filter parameters
    const category = searchParams.get("category");
    const breed = searchParams.get("breed");
    const color = searchParams.get("color");
    const gender = searchParams.get("gender");
    const age = searchParams.get("age");
    const size = searchParams.get("size");
    const location = searchParams.get("location");
    
    // Build the filter object
    const where: any = {};
    
    // Use case-insensitive matching for category
    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    
    if (breed) where.breed = breed;
    if (color) where.colors = { contains: color }; // Assuming colors is stored as a string
    if (gender && gender !== "Any") where.gender = gender;
    if (age && !isNaN(parseInt(age))) where.age = { lte: parseInt(age) };
    if (size) where.size = size;
    
    // Handle location filter
    if (location) {
      // Special case for "Current Location" - you might handle this differently in a real app
      if (location === "Current Location") {
        // For demo purposes, you might show pets from a default location
        // or simply don't apply any location filter
        // This could be adjusted based on your requirements
      } else {
        where.OR = [
          { city: { contains: location, mode: 'insensitive' } },
          { postcode: { contains: location, mode: 'insensitive' } }
        ];
      }
    }
    
    // Add debugging
    console.log("Filter conditions:", where);
    
    // Query pets with filters
    const pets = await prisma.pet.findMany({
      where,
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${pets.length} pets matching filters`);
    
    // Format the data for the frontend
    const formattedPets = pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      category: pet.category,
      location: `${pet.city}, ${pet.postcode}`,
      gender: pet.gender,
      breed: pet.breed,
      age: `${pet.age} ${pet.age === 1 ? 'year' : 'years'}`,
      size: pet.size,
      images: pet.images,
      additionalInfo: pet.additionalInfo,
      createdAt: pet.createdAt.toISOString(),
    }));

    return NextResponse.json({ pets: formattedPets });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
