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
    const { providerId, name, description, price, duration } = body;
    if (!providerId || !name || !description || price === undefined || duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: providerId, name, description, price, duration' },
        { status: 400 }
      );
    }
    const newService = await prisma.service.create({
      data: {
        providerId,
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration) // assuming duration should be an integer
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

