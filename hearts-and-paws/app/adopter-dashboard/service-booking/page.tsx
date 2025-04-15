"use client";

import { useEffect, useState, ChangeEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "@/context/UserContext";

interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
}

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  feedback?: string | null;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
}

export default function ServiceBookingDashboard() {
  const { user } = useUser();
  const { userData, setUserDatas } = useUserContext();
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Load user data if not already available
  useEffect(() => {
    if (!userData && user) {
      fetch("/api/auth/user")
        .then((res) => res.json())
        .then((data) => {
          setUserDatas(data);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [userData, user, setUserDatas]);

  // Fetch all services (for a full listing)
  useEffect(() => {
    fetch("/api/service")
      .then((res) => res.json())
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  // Fetch appointments requested by this user (adopter)
  useEffect(() => {
    if (userData) {
      fetch(`/api/appoinment?customerId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => {
          // data should be an array of appointments
          setAppointments(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [userData]);

  // Booking a new appointment (from service listing)
  const handleBookAppointment = (service: Service) => {
    setSelectedService(service);
  };

  // Request a date change for an existing appointment
  const handleRequestDateChange = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDateTime(appointment.scheduledAt.slice(0, 16)); // ISO string adjustment
  };

  const handleAppointmentDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAppointmentDateTime(e.target.value);
  };

  // Submit a new appointment (for booking) or update an existing appointment (for date change)
  const submitAppointment = async () => {
    if (!appointmentDateTime) return;

    if (selectedService) {
      // New appointment booking
      if (!userData) {
        alert("User data is still loading. Please try again shortly.");
        return;
      }

      if (!termsAccepted) {
        alert("You must accept the terms and conditions to book an appointment.");
        return;
      }

      const customerId = userData.id;
      try {
        const res = await fetch("/api/appoinment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: selectedService.id,
            customerId,
            providerId: selectedService.providerId,
            appointmentDate: appointmentDateTime,
          }),
        });
        if (res.ok) {
          alert("Appointment request submitted!");
          setSelectedService(null);
          setAppointmentDateTime("");
          setTermsAccepted(false);
          // Optionally, refresh appointments:
          fetch(`/api/appoinment?customerId=${customerId}`)
            .then((res) => res.json())
            .then((data) => setAppointments(Array.isArray(data) ? data : []));
        } else {
          const errorData = await res.json();
          alert("Failed to book appointment: " + (errorData.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment.");
      }
    } else if (selectedAppointment) {
      // Request a date change for an existing appointment
      try {
        const res = await fetch("/api/appoinment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: selectedAppointment.id,
            status: "pending", // or another status indicating date change request
            appointmentDate: appointmentDateTime,
          }),
        });
        if (res.ok) {
          alert("Date change request submitted!");
          setSelectedAppointment(null);
          setAppointmentDateTime("");
          // Optionally, refresh appointments:
          if (userData) {
            fetch(`/api/appoinment?customerId=${userData.id}`)
              .then((res) => res.json())
              .then((data) => setAppointments(Array.isArray(data) ? data : []));
          }
        } else {
          const errorData = await res.json();
          alert("Failed to update appointment date: " + (errorData.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Error updating appointment date:", error);
        alert("Error updating appointment date.");
      }
    }
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Service Booking</h1>
      {services.length === 0 ? (
        <p>No services available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="border rounded p-4 shadow"
            >
              <h2 className="text-xl font-bold">{service.title}</h2>
              <p>{service.description}</p>
              <p className="mt-2 font-medium">Price: ${service.price.toFixed(2)}</p>
              <button
                onClick={() => handleBookAppointment(service)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Booking Dialog for New Appointments */}
      {selectedService && (
        <Dialog.Root
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedService(null);
              setTermsAccepted(false);
              setShowTerms(false);
            }
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">Book Appointment for {selectedService.title}</Dialog.Title>
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
                  onChange={handleAppointmentDateTimeChange}
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
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Cancel</button>
                </Dialog.Close>
                <button
                  onClick={submitAppointment}
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
                      <li>The service provider will exercise reasonable care while providing services to your pet, but cannot guarantee your pet&apos;s behavior, health, or reaction to the service.</li>
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
                      <li>Your pet&apos;s vaccinations are up-to-date as required by local regulations.</li>
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
                    <p>You agree to indemnify, defend, and hold harmless Hearts and Paws and the service provider from any claims, damages, liabilities, costs, or expenses (including attorney fees) arising from your pet&apos;s actions, your breach of this agreement, or your negligence.</p>
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
                    <p>Cancellations must be made at least 24 hours in advance of the scheduled appointment. Late cancellations or no-shows may result in charges up to the full service fee, at the service provider&apos;s discretion.</p>
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

              <div className="sticky bottom-0 pt-4 pb-2 bg-white border-t border-gray-200 mt-6 flex justify-end">
                <Dialog.Close asChild>
                  <button className="px-5 py-2.5 bg-[#675bc8] text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors">I Understand</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Section: Requested Appointments & Date Change Requests */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-[#675bc8] mb-4">My Requested Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">You have no appointment requests yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="border rounded p-4 shadow"
              >
                <h3 className="text-xl font-bold">{apt.service.title}</h3>
                <p className="mt-1 text-gray-700">{apt.service.description}</p>
                <p className="mt-1">Scheduled At: {new Date(apt.scheduledAt).toLocaleString()}</p>
                <p className="mt-1 font-medium">Status: {apt.status}</p>
                {apt.feedback && <p className="mt-1 text-sm text-gray-600">Feedback: {apt.feedback}</p>}
                <button
                  onClick={() => handleRequestDateChange(apt)}
                  className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  Request Date Change
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Date Change Dialog */}
      {selectedAppointment && (
        <Dialog.Root
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedAppointment(null);
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">Request Date Change for {selectedAppointment.service.title}</Dialog.Title>
              <div className="mb-4">
                <label
                  htmlFor="newDateTime"
                  className="block text-gray-700 mb-1"
                >
                  New Date & Time:
                </label>
                <input
                  type="datetime-local"
                  id="newDateTime"
                  value={appointmentDateTime}
                  onChange={handleAppointmentDateTimeChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={submitAppointment}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit Date Change
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
