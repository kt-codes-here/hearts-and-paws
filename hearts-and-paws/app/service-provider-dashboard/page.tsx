"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { roleNames } from "@/constant/utils";

export default function ServiceProviderDashboard() {
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
          } else if (data.role !== 3) {
            router.push("/dashboard");
          } else {
            setUserData(data);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [isSignedIn, user, router]);

  if (!userData) {
    return <div>Loading Service Provider Dashboard...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Service Provider Dashboard</h1>
      <p>Welcome, {userData.email}!</p>
      <p>Your role: {roleNames[userData.role]}</p>
      {/* Service Provider-specific content goes here */}
    </div>
  );
}
