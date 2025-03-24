// app/api/auth/pet-registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse the JSON body
    const body = await req.json();
    
    // Destructure required fields from the form data
    const {
      petName,
      category,
      age,
      size,
      gender,
      breed,
      colors,
      shotsUpToDate,
      microchipped,
      houseTrained,
      goodWithDogs,
      goodWithCats,
      goodWithKids,
      purebred,
      specialNeeds,
      behavioralIssues,
      addressLine1,
      addressLine2,
      city,
      postcode,
      petStory,
      images,      // Either an array or comma-separated string
      reason,
      durationToKeepPet,
    } = body;
    
    // Basic validation for required fields
    if (
      !petName ||
      !category ||
      !age ||
      !size ||
      !gender ||
      !breed ||
      !addressLine1 ||
      !city ||
      !postcode ||
      !reason ||
      !durationToKeepPet
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Find the user record in your database using the Clerk userId (stored as clerkId)
    const existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found. Please sign up first." }, { status: 400 });
    }
    
    // Convert health fields from string ("yes"/"no"/"unknown") to booleans.
    // Here, "yes" becomes true; all other values become false.
    const toBool = (val: string) => val.toLowerCase() === "yes";
    
    // Create a new Pet record, using existingUser.id as ownerId
    const pet = await prisma.pet.create({
      data: {
        ownerId: existingUser.id,
        name: petName,
        category: category,
        age: age,
        size: size,
        gender: gender,
        breed: breed,
        colors: colors,
        shotsUpToDate: toBool(shotsUpToDate),
        microchipped: toBool(microchipped),
        houseTrained: toBool(houseTrained),
        goodWithDogs: toBool(goodWithDogs),
        goodWithCats: toBool(goodWithCats),
        goodWithKids: toBool(goodWithKids),
        purebred: toBool(purebred),
        specialNeeds: toBool(specialNeeds),
        behavioralIssues: toBool(behavioralIssues),
        addressLine1: addressLine1,
        addressLine2: addressLine2 || null,
        city: city,
        postcode: postcode,
        additionalInfo: petStory, // storing the pet's story
        images: Array.isArray(images)
          ? images
          : images.split(",").map((s: string) => s.trim()),
      },
    });
    
    // Create a Rehome record for the pet
    const rehome = await prisma.rehome.create({
      data: {
        userId: existingUser.id,
        petId: pet.id,
        reason: reason,
        durationToKeepPet: durationToKeepPet,
      },
    });
    
    return NextResponse.json({ pet, rehome }, { status: 200 });
  } catch (error) {
    console.error("Error saving pet registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
