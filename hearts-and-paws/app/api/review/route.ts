import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch reviews with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  const customerId = searchParams.get("customerId");

  try {
    let reviews;
    if (providerId) {
      // Fetch reviews for a specific service provider
      reviews = await prisma.review.findMany({
        where: { providerId },
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      });
    } else if (customerId) {
      // Fetch reviews written by a specific customer
      reviews = await prisma.review.findMany({
        where: { customerId },
        include: { provider: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({ error: "providerId or customerId query parameter is required" }, { status: 400 });
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Create a new review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, customerId, rating, comment, appointmentId } = body;

    if (!providerId || !customerId || !rating || !appointmentId) {
      return NextResponse.json(
        {
          error: "Missing required fields: providerId, customerId, rating, appointmentId",
        },
        { status: 400 }
      );
    }

    // Check if this customer has a completed appointment with this provider
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        customerId,
        providerId,
        status: "confirmed",
      },
    });

    if (!appointment) {
      return NextResponse.json(
        {
          error: "You can only review providers after completing an appointment with them",
        },
        { status: 403 }
      );
    }

    // Check if a review already exists for this customer-provider-appointment combination
    const existingReview = await prisma.review.findFirst({
      where: {
        providerId,
        customerId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: "You have already reviewed this provider. Please edit your existing review instead.",
        },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        providerId,
        customerId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// PUT: Update an existing review
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, rating, comment } = body;

    if (!reviewId || !rating) {
      return NextResponse.json({ error: "Missing required fields: reviewId, rating" }, { status: 400 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment,
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE: Remove a review
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json({ error: "Missing required parameter: reviewId" }, { status: 400 });
  }

  try {
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
