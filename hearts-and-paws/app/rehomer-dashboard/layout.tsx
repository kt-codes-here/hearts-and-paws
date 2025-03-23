// app/rehomer-dashboard/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata = {
  title: "Rehomer Dashboard",
};

export default function RehomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="rehomer-dashboard-layout">{children}</div>;
}
