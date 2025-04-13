// app/api/stripe-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  // Get the raw request body as a buffer.
  const buf = Buffer.from(await request.arrayBuffer());
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Received Stripe event:", event.id, event.type);
if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Checkout session metadata:", session.metadata);
    // etc.
}

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Extract metadata
    const { serviceId, customerId, providerId, appointmentDate } = session.metadata || {};
    console.log("Metadata extracted:", { serviceId, customerId, providerId, appointmentDate });

    const amountCents = session.amount_total;
    const currency = session.currency;
    const transactionId = session.payment_intent; // external transaction id from Stripe

    try {
      await prisma.payment.create({
        data: {
          serviceId: serviceId!,
          customerId: customerId!,
          amount: amountCents ? amountCents / 100 : 0,
          currency: currency || "usd",
          status: "completed",
          method: "stripe",
          transactionId: transactionId || "",
        },
      });
      console.log("Payment record created for session:", session.id);
    } catch (dbError: any) {
      console.error("Error saving payment to database:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
