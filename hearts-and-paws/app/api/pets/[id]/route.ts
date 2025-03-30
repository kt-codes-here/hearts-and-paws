import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params?.id;

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
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
            createdAt: "desc",
          },
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    // Transform the data for the frontend
    const transformedPet = {
      ...pet,
      owner: {
        name: `${pet.owner.firstName || ""} ${pet.owner.lastName || ""}`.trim(),
        email: pet.owner.email,
        profileImage: pet.owner.profileImage,
      },
      rehomeInfo: pet.rehomes[0]
        ? {
            reason: pet.rehomes[0].reason,
            durationToKeepPet: pet.rehomes[0].durationToKeepPet,
            listedDate: pet.rehomes[0].createdAt,
          }
        : undefined,
    };

    // Add cache control headers to prevent caching
    const response = NextResponse.json(transformedPet);

    // Set cache control headers
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json({ error: "Failed to fetch pet data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT request received for pet ID:", params?.id);

    // Get the authenticated user
    const { userId } = getAuth(request);
    console.log("Authenticated user ID:", userId);

    if (!userId) {
      console.log("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const petId = params?.id;
    if (!petId) {
      console.log("No pet ID in params");
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }

    // Parse the request body and log it
    const requestText = await request.text();
    console.log("Raw request body:", requestText);

    // Parse the JSON
    let body;
    try {
      body = JSON.parse(requestText);
      console.log("Parsed request body:", body);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      return NextResponse.json({ error: "Invalid JSON in request" }, { status: 400 });
    }

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection confirmed");
    } catch (dbConnError) {
      console.error("Database connection error:", dbConnError);
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    // First, verify ownership of the pet
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    console.log("Pet found:", pet ? "yes" : "no");

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    // Ensure the authenticated user is the pet owner
    console.log("Checking ownership - Pet Owner ID:", pet.ownerId, "User ID:", user.id);
    if (pet.ownerId !== user.id) {
      console.log("Ownership check failed - unauthorized");
      return NextResponse.json({ error: "You don't have permission to edit this pet" }, { status: 403 });
    }

    // Create a simplified update data object
    const updateData = {
      name: body.name,
      age: typeof body.age === "number" ? body.age : parseInt(body.age || "0"),
      breed: body.breed,
      size: body.size,
      gender: body.gender,
      colors: body.colors || body.color,
      additionalInfo: body.additionalInfo || body.story,
      city: body.city,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 || null,
      postcode: body.postcode,

      // Include all trait boolean fields from the request
      shotsUpToDate: body.shotsUpToDate !== undefined ? Boolean(body.shotsUpToDate) : undefined,
      microchipped: body.microchipped !== undefined ? Boolean(body.microchipped) : undefined,
      houseTrained: body.houseTrained !== undefined ? Boolean(body.houseTrained) : undefined,
      goodWithDogs: body.goodWithDogs !== undefined ? Boolean(body.goodWithDogs) : undefined,
      goodWithCats: body.goodWithCats !== undefined ? Boolean(body.goodWithCats) : undefined,
      goodWithKids: body.goodWithKids !== undefined ? Boolean(body.goodWithKids) : undefined,
      purebred: body.purebred !== undefined ? Boolean(body.purebred) : undefined,
      specialNeeds: body.specialNeeds !== undefined ? Boolean(body.specialNeeds) : undefined,
      behavioralIssues: body.behavioralIssues !== undefined ? Boolean(body.behavioralIssues) : undefined,
    };

    // Add images if they exist
    if (Array.isArray(body.images)) {
      updateData.images = body.images;
    }

    console.log("Final update data:", updateData);

    // Perform the update
    try {
      console.log("Attempting to update pet in database...");
      const updatedPet = await prisma.pet.update({
        where: { id: petId },
        data: updateData,
      });

      console.log("Pet update successful:", updatedPet.id);

      // Handle rehome info if provided
      if (body.rehomeInfo && (body.rehomeInfo.reason || body.rehomeInfo.durationToKeepPet)) {
        console.log("Processing rehome info update...");
        const existingRehome = await prisma.rehome.findFirst({
          where: { petId },
          orderBy: { createdAt: "desc" },
        });

        if (existingRehome) {
          console.log("Found existing rehome record:", existingRehome.id);
          await prisma.rehome.update({
            where: { id: existingRehome.id },
            data: {
              reason: body.rehomeInfo.reason || existingRehome.reason,
              durationToKeepPet: body.rehomeInfo.durationToKeepPet || existingRehome.durationToKeepPet,
            },
          });
          console.log("Rehome info updated successfully");
        }
      }

      // Return success response with the updated pet
      return NextResponse.json({
        success: true,
        message: "Pet updated successfully",
        petId: updatedPet.id,
      });
    } catch (dbError) {
      console.error("Database error during update:", dbError);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  } finally {
    console.log("Closing database connection");
    await prisma.$disconnect();
  }
}
