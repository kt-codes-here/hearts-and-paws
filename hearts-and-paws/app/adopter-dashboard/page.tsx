"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { roleNames } from "@/constant/utils";

export default function AdopterDashboard() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<{ role: number; email: string } | null>(null);

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data) => {
          if (!data.role) {
            router.push("/user-registration");
          } else if (data.role !== 1) {
            router.push("/dashboard");
          } else {
            setUserData(data);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [isSignedIn, user, router]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading Adopter Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Adopter Dashboard</h1>
        <p className="text-lg text-gray-700">
          Welcome, <span className="font-semibold">{userData.email}</span>!
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Your role: <span className="font-semibold">{roleNames[userData.role]}</span>
        </p>
        {/* Adopter-specific content */}
        <div className="mt-8">
          <p className="text-gray-600">
            Here you can manage your adoption requests, view your favorite pets, and update your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
