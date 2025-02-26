import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET() {
    try {
      const pets = await prisma.pet.findMany();
      return NextResponse.json(pets, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
    }
  }
  