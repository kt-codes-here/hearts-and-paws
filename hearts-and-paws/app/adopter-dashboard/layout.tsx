// app/adopter-dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata = {
  title: "Adopter Dashboard",
};

export default async function AdopterDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  console.log("Adopter Layout: userId =", userId);

  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  console.log("Adopter Layout: dbUser =", dbUser);
  if (!dbUser || dbUser.role !== 1) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
