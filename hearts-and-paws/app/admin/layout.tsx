// app/admin/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user || user.role !== 4) {
    redirect("/");
  }

  return <>{children}</>;
}
