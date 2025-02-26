import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
    try {
      const body = await req.json();
      const rehome = await prisma.rehome.create({ data: body });
      return NextResponse.json(rehome, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to create rehome entry" }, { status: 500 });
    }
  }
  