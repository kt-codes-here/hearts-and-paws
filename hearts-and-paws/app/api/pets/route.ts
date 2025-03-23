import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const breed = searchParams.get("breed");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const goodWithKids = searchParams.get("goodWithKids") === "true";
    const goodWithDogs = searchParams.get("goodWithDogs") === "true";
    const goodWithCats = searchParams.get("goodWithCats") === "true";

    // Build filter conditions
    const where: any = {};
    
    if (breed) where.breed = breed;
    if (gender) where.gender = gender;
    if (size) where.size = size;
    
    // Only add these filters if they're explicitly set to true
    if (searchParams.has("goodWithKids")) where.goodWithKids = goodWithKids;
    if (searchParams.has("goodWithDogs")) where.goodWithDogs = goodWithDogs;
    if (searchParams.has("goodWithCats")) where.goodWithCats = goodWithCats;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.pet.count({ where });

    // Fetch pets with pagination
    const pets = await prisma.pet.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        breed: true,
        age: true,
        gender: true,
        size: true,
        city: true,
        postcode: true,
        images: true,
        goodWithKids: true,
        goodWithDogs: true,
        goodWithCats: true,
        houseTrained: true,
        microchipped: true,
        shotsUpToDate: true,
      },
    });

    // Transform the data for the frontend
    const transformedPets = pets.map(pet => ({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      gender: pet.gender,
      size: pet.size,
      location: `${pet.city}, ${pet.postcode}`,
      mainImage: pet.images.length > 0 ? pet.images[0] : "",
      traits: [
        pet.goodWithDogs ? "Good with dogs" : null,
        pet.goodWithCats ? "Good with cats" : null,
        pet.goodWithKids ? "Good with kids" : null,
        pet.houseTrained ? "House trained" : null,
        pet.microchipped ? "Microchipped" : null,
        pet.shotsUpToDate ? "Shots up to date" : null,
      ].filter(Boolean) as string[],
    }));

    return NextResponse.json({
      pets: transformedPets,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 