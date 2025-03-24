// app/api/service/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('providerId');

  try {
    let services;
    if (providerId) {
      services = await prisma.service.findMany({
        where: { providerId }
      });
    } else {
      // No providerId provided, return all services
      services = await prisma.service.findMany();
    }
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, title, description, price } = body;
    if (!providerId || !title || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: providerId, title, description, price' },
        { status: 400 }
      );
    }
    const newService = await prisma.service.create({
      data: {
        providerId,
        title,
        description,
        price: parseFloat(price)
      }
    });
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
