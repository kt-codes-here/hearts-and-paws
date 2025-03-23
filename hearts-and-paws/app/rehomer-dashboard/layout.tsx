// app/rehomer-dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata = {
  title: "Rehomer Dashboard",
};

export default async function RehomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  console.log("Rehomer Layout: userId =", userId);

  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  console.log("Rehomer Layout: dbUser =", dbUser);
  if (!dbUser || dbUser.role !== 2) {
    redirect("/");
  }

  return <>{children}</>;
}
