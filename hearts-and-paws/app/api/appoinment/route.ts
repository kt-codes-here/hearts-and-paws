// app/api/appoinment/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch appointments with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  const customerId = searchParams.get("customerId");
  const filter = searchParams.get("filter"); // "upcoming" or "requests"

  try {
    let appointments;
    if (providerId) {
      // For service providers: fetch appointments for services they own
      appointments = await prisma.appointment.findMany({
        where: { providerId },
        include: { service: true, customer: true },
      });
    } else if (customerId) {
      // For pet owners: fetch appointments they have requested
      appointments = await prisma.appointment.findMany({
        where: { customerId },
        include: { service: true , provider:true}
      });
    } else {
      return NextResponse.json({ error: "providerId or customerId query parameter is required" }, { status: 400 });
    }

    // Apply optional filtering
    if (filter === "upcoming") {
      appointments = appointments.filter((apt) => apt.status === "confirmed" && new Date(apt.appointmentDate) > new Date());
    } else if (filter === "requests") {
      appointments = appointments.filter((apt) => apt.status === "pending");
    }
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// POST: Create a new appointment request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, providerId, customerId, appointmentDate } = body;
    if (!serviceId || !providerId || !customerId || !appointmentDate) {
      return NextResponse.json({ error: "Missing required fields: serviceId, providerId, customerId, appointmentDate, status" }, { status: 400 });
    }
    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        providerId,
        customerId,
        appointmentDate: new Date(appointmentDate),
        status: "pending",
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

// PUT: Update appointment status, feedback, and (optionally) the appointment date
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, status, appointmentDate } = body;
    if (!appointmentId || !status) {
      return NextResponse.json({ error: "Missing required fields: appointmentId, status" }, { status: 400 });
    }
    const updateData: any = {
      status,
    };
    if (appointmentDate) {
      updateData.appointmentDate = new Date(appointmentDate);
    }
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });
    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
