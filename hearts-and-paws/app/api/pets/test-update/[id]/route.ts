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
      return NextResponse.json({ error: "Pet ID required" }, { status: 400 });
    }
    
    console.log("Testing update for pet ID:", petId);
    
    // Simple update with minimal data
    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        name: "Test Updated Name " + new Date().toISOString(),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Test update successful",
      pet: updatedPet
    });
  } catch (error) {
    console.error("Test update failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 