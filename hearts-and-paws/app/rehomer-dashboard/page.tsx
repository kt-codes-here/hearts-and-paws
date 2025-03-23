"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";
import Image from "next/image";
import { roleNames } from "@/constant/utils";
import Link from "next/link";

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
  const [error, setError] = useState<string | null>(null);

  // Fetch the authenticated user's database record
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    if (isSignedIn && user) {
      fetch("/api/auth/user")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("User data received:", data);
          if (!data.role) {
            router.push("/user-registration");
          } else if (data.role !== 2) {
            router.push("/");
          } else {
            setUserData(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setError(err.message);
        });
    }
  }, [isLoaded, isSignedIn, user, router]);

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

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Show unauthorized state
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Please sign in to access this page</p>
      </div>
    );
  }

  // Show loading state while fetching user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading user data...</p>
      </div>
    );
  }

  const handlePetClick = (e: React.MouseEvent, petId: string) => {
    e.preventDefault(); // Prevent accordion from toggling
    router.push(`/pet/${petId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">
            Rehomer Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-lg text-gray-700">
                Welcome, <span className="font-semibold">{userData.firstName}</span>!
              </p>
              <p className="text-lg text-gray-700">
                Role: <span className="font-semibold">{roleNames[userData.role]}</span>
              </p>
            </div>
            <Link
              href="/rehomer-dashboard/pet-registration"
              className="px-6 py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Register New Pet
            </Link>
          </div>
        </div>

        {/* Pets Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Rehome Listings</h2>
          {loadingRehomes ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading rehome listings...</p>
            </div>
          ) : rehomes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">You have not created any rehome listings yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rehomes.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {item.pet.images && item.pet.images.length > 0 && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.pet.images[0]}
                        alt={`${item.pet.name}'s photo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.pet.name}</h3>
                    <div className="space-y-2 text-gray-600 mb-4">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Breed:</span> {item.pet.breed}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Age:</span> {item.pet.age}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Duration:</span> {item.durationToKeepPet}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handlePetClick(e, item.pet.id)}
                      className="w-full bg-purple-50 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
