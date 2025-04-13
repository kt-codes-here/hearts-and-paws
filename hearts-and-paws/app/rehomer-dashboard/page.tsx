"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { roleNames } from "@/constant/utils";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside the component.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RehomerDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    role: number;
    email: string;
    firstName: string;
    id: string;
  } | null>(null);
  const [rehomes, setRehomes] = useState<any[]>([]);
  const [loadingRehomes, setLoadingRehomes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // States for appointment booking and payment
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);

  // Fetch authenticated user record
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }
    if (isSignedIn && user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data) => {
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

  // Fetch appointments for this user (using customer’s id)
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
    e.preventDefault();
    router.push(`/pet/${petId}`);
  };

  // Function to handle payment action for an appointment that is accepted.
  // Only appointments with status "accepted" will show the payment button.
  const handleMakePayment = async (apt: any) => {
    try {
      // Call checkout API endpoint (which now expects the appointmentId as well).
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: apt.service.id,
          customerId: userData?.id,
          providerId: apt.provider.userId, // adjust if needed
          appointmentDate: apt.appointmentDate,
          servicePrice: apt.service.price,
          appointmentId: apt.id, // Include appointmentId for linking payment
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert("Payment error: " + (errorData.error || "Unknown error"));
        return;
      }
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe error:", error.message);
        alert("Payment failed: " + error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment.");
    }
  };

  // Filter appointments to get upcoming appointments for display.
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) > new Date()
  );

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
          <h1 className="text-4xl font-bold text-purple-700 mb-4">Rehomer Dashboard</h1>
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
          {/* (Existing rehome listings code goes here) */}
        </div>

        {/* Section: Available Services for Appointment Booking */}
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
                  <p className="mt-2 font-medium">Price: ${service.price.toFixed(2)}</p>
                  <p className="mt-2 font-medium">Duration: {service.duration} minutes</p>
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
                    <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
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
                              // Appointment is created with status "pending"
                            }),
                          });
                          if (res.ok) {
                            alert("Appointment request submitted!");
                            setSelectedService(null);
                            setAppointmentDateTime("");
                          } else {
                            const errorData = await res.json();
                            alert("Failed to book appointment: " + (errorData.error || "Unknown error"));
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

        {/* Section: Services Requested (Appointments) with Payment Option */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Services Requested</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No Service Requested Yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => {
                let statusColor = "text-gray-600";
                let additionalAction = null;
                // Show message while waiting for provider's response
                if (apt.status === "pending") {
                  statusColor = "text-yellow-600";
                  additionalAction = (
                    <p className="mt-2 text-sm text-gray-500">
                      Waiting for service provider approval...
                    </p>
                  );
                } else if (apt.status === "accepted") {
                  statusColor = "text-blue-600";
                  // When appointment is accepted, enable payment.
                  additionalAction = (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/payment/checkout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              serviceId: apt.service.id,
                              customerId: userData.id,
                              providerId: apt.provider.userId, // adjust as needed
                              appointmentDate: apt.appointmentDate,
                              servicePrice: apt.service.price,
                              appointmentId: apt.id, // Link payment to the appointment
                            }),
                          });
                          if (!res.ok) {
                            const errorData = await res.json();
                            alert("Payment error: " + (errorData.error || "Unknown error"));
                            return;
                          }
                          const { sessionId } = await res.json();
                          const stripe = await stripePromise;
                          const { error } = await stripe!.redirectToCheckout({ sessionId });
                          if (error) {
                            console.error("Stripe error:", error.message);
                            alert("Payment failed: " + error.message);
                          }
                        } catch (error) {
                          console.error("Error processing payment:", error);
                          alert("Error processing payment.");
                        }
                      }}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Make Payment
                    </button>
                  );
                } else if (apt.status === "confirmed") {
                  statusColor = "text-green-600";
                  additionalAction = (
                    <p className="mt-2 text-sm text-green-600">
                      Payment completed. Appointment confirmed.
                    </p>
                  );
                } else if (apt.status === "declined") {
                  statusColor = "text-red-600";
                  additionalAction = (
                    <p className="mt-2 text-sm text-red-600">
                      Appointment declined.
                    </p>
                  );
                }
                return (
                  <div key={apt.id} className="border rounded p-4 shadow">
                    <p className="font-bold">
                      {apt.service?.name || "Service information unavailable"}
                    </p>
                    <p>
                      Service Provider:{" "}
                      <span>{apt.provider.businessName}</span>
                    </p>
                    <p>
                      Contact: <span>{apt.provider.phone}</span>
                    </p>
                    <p>
                      Scheduled At: {new Date(apt.appointmentDate).toLocaleString()}
                    </p>
                    <p className={`mt-2 font-medium ${statusColor}`}>
                      Status: {apt.status}
                    </p>
                    {additionalAction}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Upcoming Appointments */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="border rounded p-4 shadow">
                  <p className="font-bold">
                    {apt.service?.name || "Service info unavailable"}
                  </p>
                  <p>
                    Scheduled At: {new Date(apt.appointmentDate).toLocaleString()}
                  </p>
                  <p>Status: {apt.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
