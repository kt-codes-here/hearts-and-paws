"use client";
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { roleNames } from "@/constant/utils";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Edit3, Instagram, Mail, MapPin, Phone, X } from "lucide-react";
import Countdown from "../../components/ui/countDown"; // adjust the path if stored in a separate file
import ReviewComponent from "@/components/ui/ReviewComponent";

// Initialize Stripe outside the component only if the key exists
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) : null;

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<string | null>(null);

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

  // Fetch appointments for this user (using customer's id)
  useEffect(() => {
    if (isLoaded && isSignedIn && user && userData) {
      fetch(`/api/appoinment?customerId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAppointments(Array.isArray(data) ? data : []);

          // Filter for completed appointments (past confirmed appointments)
          const completed = data.filter((apt: any) => apt.status === "completed");
          console.log("Filtered Completed Appointments:", completed); // Debugging
          setCompletedAppointments(completed);
        })
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [isLoaded, isSignedIn, user, userData]);

  // Add a new useEffect to fetch user's reviews
  useEffect(() => {
    const reviews = localStorage.getItem("reviews");
    if (reviews) {
      setUserReviews(JSON.parse(reviews)); // Load reviews from localStorage
    }
    setIsLoadingReviews(false);
  }, []);

  const handlePetClick = (e: React.MouseEvent, petId: string) => {
    e.preventDefault();
    router.push(`/pet/${petId}`);
  };

  // Function to handle payment action for an accepted appointment.
  const handleMakePayment = async (apt: any) => {
    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: apt.service.id,
          customerId: userData?.id,
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
  };

  // Separate appointments into two categories:
  // 1. Requested Appointments: appointments with status NOT "confirmed".
  const requestedAppointments = appointments.filter((apt) => apt.status !== "confirmed");
  // 2. Upcoming Appointments: appointments with status "confirmed" and a future appointment date.
  const upcomingAppointments = appointments.filter((apt) => apt.status === "confirmed" && new Date(apt.appointmentDate) > new Date());

  // Add a function to handle when a new review is created
  const handleReviewCreated = (newReview: any) => {
    setUserReviews((prev) => [newReview, ...prev]); // Add the new review to the list
  };

  // Add a function to handle when a review is updated
  const handleReviewUpdated = (updatedReview: any) => {
    setUserReviews(userReviews.map((review) => (review.id === updatedReview.id ? updatedReview : review)));
  };

  // Add a function to handle when a review is deleted
  const handleReviewDeleted = (reviewId: string) => {
    setUserReviews((prev) => prev.filter((review) => review.id !== reviewId)); // Remove the deleted review
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#675bc8] mb-4">Rehomer Dashboard</h1>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Register New Pet
            </Link>
          </div>
        </div>

        {/* Pets/Rehome Listings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Rehome Listings</h2>
          {loadingRehomes ? (
            <p className="text-gray-600">Loading your pet listings...</p>
          ) : rehomes.length === 0 ? (
            <p className="text-gray-600">You haven't created any rehome listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {rehomes.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
                  onClick={(e) => handlePetClick(e, item.pet.id)}
                >
                  <div className="h-48 w-full relative">
                    <Image
                      src={item.pet.images && item.pet.images.length > 0 ? item.pet.images[0] : "/placeholder.jpg"}
                      alt={item.pet.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-purple-700">{item.pet.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{`${item.pet.city}, ${item.pet.postcode}`}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{item.pet.gender}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{item.pet.breed}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{item.pet.age} years</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{item.pet.additionalInfo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Services for Appointment Booking */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Available Services for Appointment Booking</h2>
          {services.length === 0 ? (
            <p className="text-gray-600">No services available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border rounded p-4 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="mt-2 text-gray-700">{service.description}</p>
                  <p className="mt-2 font-medium">Price: ${service.price.toFixed(2)}</p>
                  <p className="mt-2 font-medium">Duration: {service.duration} minutes</p>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="mt-4 block w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
              if (!open) {
                setSelectedService(null);
                setAppointmentDateTime("");
                setTermsAccepted(false);
                setShowTerms(false);
              }
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                <Dialog.Title className="text-xl font-semibold mb-4">Book Appointment for {selectedService.name}</Dialog.Title>
                <div className="mb-4">
                  <label
                    htmlFor="appointmentDateTime"
                    className="block text-gray-700 mb-1"
                  >
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

                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-700"
                      >
                        I accept the{" "}
                        <button
                          type="button"
                          className="text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTerms(true);
                          }}
                        >
                          Terms and Conditions
                        </button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
                  </Dialog.Close>
                  <button
                    onClick={async () => {
                      if (!selectedService || !appointmentDateTime) return;

                      if (!termsAccepted) {
                        alert("You must accept the terms and conditions to book an appointment.");
                        return;
                      }

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
                          setTermsAccepted(false);
                        } else {
                          const errorData = await res.json();
                          alert("Failed to book appointment: " + (errorData.error || "Unknown error"));
                        }
                      } catch (error) {
                        console.error("Error booking appointment:", error);
                        alert("Error booking appointment.");
                      }
                    }}
                    disabled={!termsAccepted}
                    className={`px-4 py-2 text-white rounded ${termsAccepted ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"}`}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}

        {/* Terms and Conditions Dialog */}
        {showTerms && (
          <Dialog.Root
            open={true}
            onOpenChange={(open) => {
              if (!open) setShowTerms(false);
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white pt-2 pb-4 border-b border-gray-200 z-10">
                  <Dialog.Title className="text-2xl font-bold text-gray-800">Terms and Conditions</Dialog.Title>
                  <p className="text-gray-500 text-sm mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mt-4 prose prose-sm max-w-none text-gray-700">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-700">By booking an appointment with any service provider through Hearts and Paws, you agree to the following terms and conditions. Please read carefully before proceeding.</p>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        1. SERVICE DISCLAIMER
                      </h3>
                      <p>All services booked through Hearts and Paws are provided by independent service providers. Hearts and Paws serves solely as a platform connecting pet owners with service providers and is not responsible for the quality, safety, or outcome of any services provided.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        2. LIABILITY WAIVER
                      </h3>
                      <p className="mb-2">You acknowledge and agree that:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Neither Hearts and Paws nor the service provider shall be held liable for any injury, illness, death, damage, loss, or accident involving your pet that may occur during or as a result of the services provided.</li>
                        <li>You understand that working with animals involves inherent risks, and you voluntarily accept these risks.</li>
                        <li>The service provider will exercise reasonable care while providing services to your pet, but cannot guarantee your pet's behavior, health, or reaction to the service.</li>
                      </ul>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        3. PET HEALTH AND BEHAVIOR
                      </h3>
                      <p className="mb-2">You represent and warrant that:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Your pet is in good health and has not shown aggressive behavior toward people or other animals.</li>
                        <li>You have disclosed all known medical conditions, behavioral issues, and special needs of your pet to the service provider.</li>
                        <li>Your pet's vaccinations are up-to-date as required by local regulations.</li>
                      </ul>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        4. INDEMNIFICATION
                      </h3>
                      <p>You agree to indemnify, defend, and hold harmless Hearts and Paws and the service provider from any claims, damages, liabilities, costs, or expenses (including attorney fees) arising from your pet's actions, your breach of this agreement, or your negligence.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        5. EMERGENCY CARE AUTHORIZATION
                      </h3>
                      <p>In the event of an emergency, you authorize the service provider to seek veterinary care for your pet if deemed necessary. You acknowledge that you will be responsible for any costs associated with such emergency care.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        6. CANCELLATION POLICY
                      </h3>
                      <p>Cancellations must be made at least 24 hours in advance of the scheduled appointment. Late cancellations or no-shows may result in charges up to the full service fee, at the service provider's discretion.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        7. MEDIA RELEASE
                      </h3>
                      <p>Unless explicitly stated otherwise in writing, you grant permission to the service provider and Hearts and Paws to use images or videos of your pet taken during service for promotional purposes.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                        8. DISPUTE RESOLUTION
                      </h3>
                      <p>Any disputes arising from this agreement shall first be addressed through good-faith negotiation. If resolution cannot be reached, disputes shall be resolved through arbitration in accordance with applicable laws.</p>
                    </section>

                    <section className="rounded-lg bg-white p-4 border border-gray-200">
                      <h3 className="text-lg font-bold text-[#675bc8] mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        9. GOVERNING LAW
                      </h3>
                      <p>This agreement shall be governed by and construed in accordance with the laws of the jurisdiction where the service is provided.</p>
                    </section>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800">By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions outlined in this agreement.</p>
                  </div>
                </div>

                <div className="sticky bottom-0 pt-4 pb-2 bg-white border border-gray-200 mt-6 flex justify-end">
                  <Dialog.Close asChild>
                    <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">I Understand</button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}

        {/* Requested Services Section */}
        <div className="mt-12 bg-white shadow rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Services Requested</h2>
          {requestedAppointments.length === 0 ? (
            <p className="text-gray-600">No service requests at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requestedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gray-50 border rounded-lg p-6 transition-shadow hover:shadow-lg"
                >
                  <p className="font-bold text-lg">{apt.service?.name || "Service info unavailable"}</p>
                  <p className="mt-2 text-gray-700">Scheduled At: {new Date(apt.appointmentDate).toLocaleString()}</p>
                  <p className="mt-2 font-medium text-gray-600">
                    Status: <span className={`${apt.status === "pending" ? "text-yellow-500" : "text-blue-500"}`}>{apt.status}</span>
                  </p>
                  {apt.status === "pending" && <p className="mt-2 text-sm text-gray-500">Waiting for service provider approval....</p>}
                  {apt.status === "accepted" && (
                    <button
                      onClick={() => handleMakePayment(apt)}
                      className="mt-4 block w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                      Make payment
                    </button>
                  )}
                  {apt.status === "declined" && <p className="mt-2 text-sm text-red-600">Appointment Declined.</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments Section */}
        <div className="mt-12 bg-white shadow rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gray-50 border rounded-lg p-6 transition-shadow hover:shadow-lg"
                >
                  <p className="font-bold text-lg">{apt.service?.name || "Service info unavailable"}</p>
                  <p className="mt-2 text-gray-700">Scheduled At: {new Date(apt.appointmentDate).toLocaleString()}</p>
                  <p className="mt-2 font-medium text-green-600">Status: {apt.status}</p>
                  {/* Instead of invoice, show time remaining until appointment */}
                  <Countdown appointmentDate={apt.appointmentDate} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Appointments Section */}
        <div className="mt-12 bg-white shadow rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Completed Appointments</h2>
          {completedAppointments.length === 0 ? (
            <p className="text-gray-600">No completed appointments.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-gray-50 border rounded-lg p-6 transition-shadow hover:shadow-lg"
                >
                  <p className="font-bold text-lg">{apt.service?.name || "Service info unavailable"}</p>
                  <p className="mt-2 text-gray-700">Completed At: {new Date(apt.appointmentDate).toLocaleString()}</p>
                  <p className="mt-2 font-medium text-gray-600">Status: {apt.status}</p>

                  {/* Add the "Rate and Review" button for completed appointments */}
                  {apt.status.toLowerCase() === "completed" && (
                    <button
                      onClick={() => setSelectedAppointmentForReview(apt.id)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Rate and Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form Modal */}
        {selectedAppointmentForReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
              <ReviewComponent
                providerId={completedAppointments.find((apt) => apt.id === selectedAppointmentForReview)?.providerId || ""}
                customerId={completedAppointments.find((apt) => apt.id === selectedAppointmentForReview)?.customerId || ""}
                appointmentId={selectedAppointmentForReview}
                serviceName={completedAppointments.find((apt) => apt.id === selectedAppointmentForReview)?.service?.name || "Unknown Service"}
                editable={true}
                onReviewCreated={handleReviewCreated}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
              <button
                onClick={() => setSelectedAppointmentForReview(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* User Reviews Section */}
        <div className="mt-12 bg-white shadow rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
          {isLoadingReviews ? (
            <p className="text-gray-600">Loading your reviews...</p>
          ) : userReviews.length === 0 ? (
            <p className="text-gray-600">You haven't left any reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userReviews.map((review) => (
                <ReviewComponent
                  key={review.id}
                  reviewId={review.id}
                  initialRating={review.rating}
                  initialComment={review.comment}
                  providerId={review.providerId}
                  customerId={review.customerId}
                  appointmentId={review.appointmentId}
                  editable={true}
                  onReviewCreated={handleReviewCreated}
                  onReviewUpdated={handleReviewUpdated}
                  onReviewDeleted={handleReviewDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
