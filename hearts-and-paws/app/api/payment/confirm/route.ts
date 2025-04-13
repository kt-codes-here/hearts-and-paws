// app/api/payment/confirm/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    
    // Retrieve the session (expand line items if necessary)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    
    // Extract metadata. Note: appointmentId must have been passed at checkout creation.
    const { serviceId, customerId, providerId, appointmentDate, appointmentId } = session.metadata || {};
    const amountCents = session.amount_total;
    const currency = session.currency;
    const transactionId = session.payment_intent; // external transaction id from Stripe
    
    if (!serviceId || !customerId || !providerId || !appointmentId) {
      return NextResponse.json({ error: "Missing required metadata (serviceId, customerId, providerId, appointmentId)" }, { status: 400 });
    }
    
    // Create the Payment record in the database.
    const payment = await prisma.payment.create({
      data: {
        appointmentId,  // Link Payment to the specific Appointment
        serviceId,
        customerId,
        amount: amountCents ? amountCents / 100 : 0, // convert cents to dollars
        currency: currency || "usd",
        status: "completed",
        method: "stripe",
        transactionId: transactionId || "",
      },
    });
    
    // Update the associated Appointment's status to "confirmed"
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "confirmed" },
    });
    
    console.log("Payment record created:", payment.id);
    console.log("Appointment updated to confirmed:", updatedAppointment.id);
    return NextResponse.json(
      { payment, updatedAppointment, message: "Payment recorded and appointment confirmed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm payment" }, { status: 500 });
  }
}
