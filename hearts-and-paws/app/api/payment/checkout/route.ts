import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, customerId, providerId, appointmentDate, servicePrice, appointmentId } = body;

    if (!serviceId || !customerId || !providerId || !appointmentDate || !servicePrice || !appointmentId) {
      return NextResponse.json(
        { error: "Missing required fields: serviceId, customerId, providerId, appointmentDate, servicePrice, appointmentId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Service Payment: ${serviceId}`,
            },
            unit_amount: Math.round(parseFloat(servicePrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      metadata: { serviceId, customerId, providerId, appointmentDate, appointmentId },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
