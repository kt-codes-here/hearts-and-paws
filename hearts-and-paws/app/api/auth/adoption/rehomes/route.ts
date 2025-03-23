// app/api/adoption/rehomes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Query all rehome listings and include the associated pet data
    const rehomes = await prisma.rehome.findMany({
      include: {
        pet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ rehomes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching rehomes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
