"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { roleNames } from "@/constant/utils";
import * as Dialog from "@radix-ui/react-dialog";
import AvailabilitySelector from "@/components/global/availability";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside the component.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UserData {
  id: string;
  role: number;
  email: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
}

export default function ServiceProviderDashboard() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });

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
            // Fetch services for this provider
            fetch(`/api/service?providerId=${data.id}`)
              .then((res) => res.json())
              .then((servicesData) => setServices(servicesData))
              .catch((err) => console.error("Error fetching services:", err));
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [isSignedIn, user, router]);

  useEffect(() => {
    if (userData) {
      fetch(`/api/appoinment?providerId=${userData.id}`)
        .then((res) => res.json())
        .then((data) => setAppointments(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [userData]);

  // Handle new service form inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  // Create a new service
  const addService = async () => {
    if (!userData) return;
    try {
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newService,
          providerId: userData.id,
          price: parseFloat(newService.price),
          duration: parseInt(newService.duration)
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding service: " + (errorData.error || "Unknown error"));
        return;
      }
      const service: Service = await res.json();
      setServices([...services, service]);
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service. Please try again later.");
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.status === "confirmed" && new Date(apt.appointmentDate) > new Date()
  );

 

  const updateAppointmentStatus = (appointmentId: string, status: string, feedback = "") => {
    fetch("/api/appoinment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, status, feedback })
    })
      .then((res) => res.json())
      .then((updated) => {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === appointmentId ? updated : apt))
        );
      })
      .catch((err) => console.error("Error updating appointment:", err));
  };

  if (!userData) {
    return <div className="p-8">Loading Service Provider Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">Service Provider Dashboard</h1>
        <p className="text-xl mb-4">Welcome, {userData.email}! (Role: {roleNames[userData.role]})</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/rehomer-dashboard/pet-registration"
            className="px-6 py-3 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Register New Pet
          </Link>
        </div>
      </header>

      {/* New Service Dialog */}
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setNewService({ name: "", description: "", price: "", duration: "" });
          }
        }}
      >
        <Dialog.Trigger asChild>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add New Service
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Service
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newService.price}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={newService.duration}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 border rounded border-gray-300 hover:bg-gray-100 transition">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button onClick={addService} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Add Service
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* My Services Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Services</h2>
        {services.length === 0 ? (
          <p className="text-gray-600">No services available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-6 bg-gray-50 shadow hover:shadow-xl transition">
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="mt-2 text-gray-700">{service.description}</p>
                <p className="mt-2 font-medium">Price: ${service.price.toFixed(2)}</p>
                {service.duration !== undefined && (
                  <p className="mt-2 font-medium">Duration: {service.duration} minutes</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Availability Selector */}
      <section className="mt-8">
        <AvailabilitySelector />
      </section>

      {/* Appointment Requests Section */}
      <section className="mt-12 bg-white shadow rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Appointment Requests</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointment requests.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="border rounded-lg p-6 bg-gray-50 shadow hover:shadow-xl transition">
                <p className="font-bold text-lg">
                  {apt.service?.name || "Service info unavailable"}
                </p>
                <p className="mt-2 text-gray-700">Scheduled: {new Date(apt.appointmentDate).toLocaleString()}</p>
                <p className="mt-2 font-medium text-gray-600">Status: {apt.status}</p>
                {apt.status === "pending" && (
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, "accepted")}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, "declined", "Service not available at that time")}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {apt.feedback && (
                  <p className="mt-1 text-sm text-gray-600">Feedback: {apt.feedback}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Appointments Section */}
      <section className="mt-12 bg-white shadow rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-600">No upcoming appointments.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="border rounded-lg p-6 bg-gray-50 shadow hover:shadow-xl transition">
                <p className="font-bold text-lg">
                  {apt.service?.name || "Service info unavailable"}
                </p>
                <p className="mt-2 text-gray-700">
                  Scheduled: {new Date(apt.appointmentDate).toLocaleString()}
                </p>
                <p className="mt-2 font-medium text-green-600">Status: {apt.status}</p>
                {/* Instead of invoice, show time remaining (Countdown component if implemented) */}
                <div className="mt-2 text-sm text-gray-600">
                  {(() => {
                    const diff = new Date(apt.appointmentDate).getTime() - Date.now();
                    if (diff <= 0) return "Time's up";
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    return `${days}d ${hours}h ${minutes}m remaining`;
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
