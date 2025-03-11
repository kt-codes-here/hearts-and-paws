"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import { roleNames } from "@/constant/utils";

export default function RehomerDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    role: number;
    email: string;
    firstName: string;
  } | null>(null);
  const [rehomes, setRehomes] = useState<any[]>([]);
  const [loadingRehomes, setLoadingRehomes] = useState(true);

  // Fetch the authenticated user's database record
  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data) => {
          if (!data.role) {
            router.push("/user-registration");
          } else if (data.role !== 2) {
            router.push("/dashboard");
          } else {
            setUserData(data);
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [isSignedIn, user, router]);

  // Fetch rehome listings for this user
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/auth/rehome")
        .then((res) => res.json())
        .then((data) => {
          setRehomes(data.rehomes || []);
          setLoadingRehomes(false);
        })
        .catch((err) => {
          console.error("Error fetching rehomes:", err);
          setLoadingRehomes(false);
        });
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading Rehomer Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
          Rehomer Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Welcome, <span className="font-semibold">{userData.firstName}</span>!
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Your role:{" "}
          <span className="font-semibold">{roleNames[userData.role]}</span>
        </p>
        <div className="mt-8">
          <p className="text-gray-600">
            Here you can manage your pet rehoming listings, view applications, and
            update your posts.
          </p>
        </div>
        {/* Button to redirect to pet registration */}
        <div className="mt-10">
          <button
            onClick={() => router.push("/rehomer-dashboard/pet-registration")}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Register a New Pet
          </button>
        </div>
        {/* New Section: Rehome Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Rehome Listings</h2>
          {loadingRehomes ? (
            <p className="text-gray-600">Loading rehome listings...</p>
          ) : rehomes.length === 0 ? (
            <p className="text-gray-600">
              You have not created any rehome listings yet.
            </p>
          ) : (
            <Accordion.Root type="multiple" className="space-y-2">
              {rehomes.map((item) => (
                <Accordion.Item
                  key={item.id}
                  value={item.id}
                  className="border rounded"
                >
                  <Accordion.Header className="flex">
                    <Accordion.Trigger className="flex flex-1 items-center justify-between p-4 text-left">
                      <span className="font-semibold text-lg">
                        {item.pet.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        View Details
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="p-4 text-gray-700">
                    <p>
                      <strong>Breed:</strong> {item.pet.breed}
                    </p>
                    <p>
                      <strong>Age:</strong> {item.pet.age}
                    </p>
                    <p>
                      <strong>Reason for Rehoming:</strong>{" "}
                      <span className="font-semibold">{item.reason}</span>
                    </p>
                    <p>
                      <strong>Duration to Keep Pet:</strong>{" "}
                      <span className="font-semibold">
                        {item.durationToKeepPet}
                      </span>
                    </p>
                    {item.pet.images && item.pet.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.pet.images.map((img: string, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Pet image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          )}
        </div>
      </div>
    </div>
  );
}
