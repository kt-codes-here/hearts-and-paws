"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PetCard } from "@/components/ui/petCard";
import { useUser } from "@clerk/nextjs";

// Define interfaces for our data
interface UserData {
  id: string;
  role: number;
  email: string;
}

interface Pet {
  id: string;
  name: string;
  city: string;
  postcode: string;
  gender: string;
  breed: string;
  age: number;
  size: string;
  images: string[];
  additionalInfo: string;
}

interface Rehome {
  id: string;
  pet: Pet;
}

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  service?: { title: string };
}

export default function AdopterDashboard() {
  // rehomes is an array of Rehome objects
  const [rehomes, setRehomes] = useState<Rehome[]>([]);
  // Remove unused services state.
  // upcomingAppointments is an array of Appointment objects.
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const { user, isSignedIn } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data: UserData) => {
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

  // Fetch adoption listings
  useEffect(() => {
    fetch("/api/auth/adoption/rehomes")
      .then((res) => res.json())
      .then((data: { rehomes: Rehome[] }) => {
        setRehomes(data.rehomes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching adoption listings:", err);
        setLoading(false);
      });
  }, []);

  // Fetch adopter's appointments and filter for upcoming confirmed ones
  useEffect(() => {
    if (userData) {
      fetch(`/api/appoinment?adopterId=${userData.id}`)
        .then((res) => res.json())
        .then((data: Appointment[]) => {
          const upcoming = (Array.isArray(data) ? data : []).filter(
            (apt: Appointment) => apt.status === "confirmed" && new Date(apt.scheduledAt) > new Date()
          );
          setUpcomingAppointments(upcoming);
        })
        .catch((err) => console.error("Error fetching adopter appointments:", err));
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading adoption listings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Adoption Listings Section */}
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Available Pets for Adoption</h1>
        {rehomes.length === 0 ? (
          <p className="text-gray-600">No pets are currently available for adoption.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rehomes.map((item: Rehome) => (
              <PetCard
                key={item.id}
                id={item.pet.id}
                name={item.pet.name}
                location={`${item.pet.city}, ${item.pet.postcode}`}
                gender={item.pet.gender}
                breed={item.pet.breed}
                age={item.pet.age.toString()}
                size={item.pet.size}
                image={item.pet.images && item.pet.images.length > 0 ? item.pet.images[0] : "/placeholder.jpg"}
                description={item.pet.additionalInfo}
                isNew={false}
              />
            ))}
          </div>
        )}

        {/* Upcoming Appointments Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-600">You have no upcoming appointments.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((apt: Appointment) => (
                <div key={apt.id} className="border rounded-lg p-6 shadow hover:shadow-lg transition">
                  <p className="font-bold">{apt.service?.title || "Service information unavailable"}</p>
                  <p>Scheduled At: {new Date(apt.scheduledAt).toLocaleString()}</p>
                  <p>Status: {apt.status}</p>
                  {/* You can add additional details here */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
