// lib/auth.ts
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma instance
import { NextRequest } from "next/server";

// Return the DB user if signed in, or null otherwise
export async function getDbUser(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return null;

  // Look up the user record in your DB by clerkId
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  return existingUser;
}
