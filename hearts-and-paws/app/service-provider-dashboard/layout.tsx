// app/service-provider-dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata = {
  title: "Service Provider Dashboard",
};

export default async function ServiceProviderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  console.log("Service Provider Layout: userId =", userId);

  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  console.log("Service Provider Layout: dbUser =", dbUser);
  if (!dbUser || dbUser.role !== 3) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
