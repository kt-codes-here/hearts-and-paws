import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const allowedRoles = [1, 2, 3];

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { role, firstName, lastName, businessName, address, serviceType, contact } = body;

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    
    await prisma.$transaction(async (tx) => {
      // Update user with role and basic details
      const updatedUser = await tx.user.update({
        where: { clerkId: userId },
        data: { role, firstName, lastName },
      });

      if (role === 3) {
        // Create a new ServiceProvider entry
        await tx.serviceProvider.create({
          data: {
            userId: updatedUser.id,
            businessName,
            address,
            city: "Unknown", // You may modify this based on your needs
            postcode: "000000", // Modify if necessary
            phone: contact,
            services: {
              create: [
                {
                  name: serviceType,
                  description: `${serviceType} service offered by ${businessName}`,
                  price: 0, // Default price, update if needed
                  duration: 30, // Default duration, update if needed
                },
              ],
            },
          },
        });
      }
    });

    return NextResponse.json({ message: "Registration complete" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
