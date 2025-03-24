// app/api/appointment/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch appointments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('providerId');
  const adopterId = searchParams.get('adopterId');

  try {
    let appointments;
    if (providerId) {
      // For service providers: fetch appointments for services they own
      appointments = await prisma.appointment.findMany({
        where: {
          service: { providerId }
        },
        include: { service: true, adopter: true }
      });
    } else if (adopterId) {
      // For adopters: fetch appointments they have requested
      appointments = await prisma.appointment.findMany({
        where: { adopterId },
        include: { service: true }
      });
    } else {
      return NextResponse.json(
        { error: 'providerId or adopterId query parameter is required' },
        { status: 400 }
      );
    }
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST: Create a new appointment request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, adopterId, scheduledAt } = body;
    if (!serviceId || !adopterId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, adopterId, scheduledAt' },
        { status: 400 }
      );
    }
    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        adopterId,
        scheduledAt: new Date(scheduledAt),
        status: 'pending'
      }
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

// In your app/api/appointment/route.ts (for PUT)
export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const { appointmentId, status, feedback, scheduledAt } = body;
      if (!appointmentId || !status) {
        return NextResponse.json(
          { error: 'Missing required fields: appointmentId, status' },
          { status: 400 }
        );
      }
      const updateData: any = {
        status,
        feedback: feedback || null,
      };
      if (scheduledAt) {
        updateData.scheduledAt = new Date(scheduledAt);
      }
      const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: updateData,
      });
      return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
  }
  