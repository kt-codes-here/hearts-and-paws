"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
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
    id:string;
  } | null>(null);
  console.log(userData)
  const [rehomes, setRehomes] = useState<any[]>([]);
  const [loadingRehomes, setLoadingRehomes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for appointment booking
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);

  // Fetch authenticated user record
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

  // Fetch available services (from all service providers)
  useEffect(() => {
    fetch("/api/service")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
      });
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && userData) {
      fetch(`/api/appoinment?customerId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : []);
        })
        .catch((err) =>
          console.error("Error fetching appointments:", err)
        );
    }
  }, [isLoaded, isSignedIn, user, userData]);

  const handlePetClick = (e: React.MouseEvent, petId: string) => {
    e.preventDefault(); // Prevent accordion from toggling
    router.push(`/pet/${petId}`);
  };


  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Please sign in to access this page</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading user data...</p>
      </div>
    );
  }

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

        {/* New Section: Available Services for Appointment Booking */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Available Services for Appointment Booking</h2>
          {services.length === 0 ? (
            <p className="text-gray-600">No services available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="border rounded p-4 shadow">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="mt-2 text-gray-700">{service.description}</p>
                  <p className="mt-2 font-medium">
                    Price: ${service.price.toFixed(2)}
                  </p>
                  <p className="mt-2 font-medium">
                    Duration: {service.duration} minutes
                  </p>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointment Booking Dialog */}
        {selectedService && (
          <Dialog.Root
            open={true}
            onOpenChange={(open) => {
              if (!open) setSelectedService(null);
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Book Appointment for {selectedService.name}
                </Dialog.Title>
                <div className="mb-4">
                  <label htmlFor="appointmentDateTime" className="block text-gray-700 mb-1">
                    Choose Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    id="appointmentDateTime"
                    value={appointmentDateTime}
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <button
                      onClick={async () => {
                        if (!selectedService || !appointmentDateTime) return;
                        try {
                          const res = await fetch("/api/appoinment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              serviceId: selectedService.id,
                              customerId: userData.id,
                              providerId: selectedService.providerId,
                              appointmentDate: appointmentDateTime,
                            }),
                          });
                          if (res.ok) {
                            alert("Appointment request submitted!");
                            setSelectedService(null);
                            setAppointmentDateTime("");
                          } else {
                            const errorData = await res.json();
                            alert(
                              "Failed to book appointment: " +
                                (errorData.error || "Unknown error")
                            );
                          }
                        } catch (error) {
                          console.error("Error booking appointment:", error);
                          alert("Error booking appointment.");
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}

<div className="mt-12">
  <h2 className="text-2xl font-bold mb-4">Services Requested</h2>
  {appointments.length === 0 ? (
    <p className="text-gray-600">No Service Requested Yet.</p>
  ) : (
    <div className="space-y-4">
      {appointments.map((apt) => (
        <div key={apt.id} className="border rounded p-4 shadow">
          <p className="font-bold">
            {apt.service?.name || "Service information unavailable"}
          </p>
          <p>
            Service Provider: <span>{apt.provider.businessName}</span>
          </p>
          <p>
            Contact: <span>{apt.provider.phone}</span>
          </p>
          <p>
            Scheduled At: {new Date(apt.appointmentDate).toLocaleString()}
          </p>
          <p
          >
            Status: <span className={`font-medium ${
              apt.status === "confirmed"
                ? "text-green-600"
                : apt.status === "pending"
                ? "text-yellow-600"
                : apt.status === "declined"
                ? "text-red-600"
                : "text-gray-600"
            }`}>{apt.status}</span>
          </p>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
    </div>
  );
}
