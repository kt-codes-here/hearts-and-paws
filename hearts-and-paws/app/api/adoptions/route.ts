import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
    try {
      const body = await req.json();
      const adoption = await prisma.adoption.create({ data: body });
      return NextResponse.json(adoption, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to create adoption entry" }, { status: 500 });
    }
  }
  