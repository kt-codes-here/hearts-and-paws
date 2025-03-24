"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { roleNames } from "@/constant/utils";
import * as Dialog from "@radix-ui/react-dialog";

interface UserData {
  id: string;
  role: number;
  email: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export default function ServiceProviderDashboard() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: ""
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
        .then((data) => setAppointments(data))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [userData]);

  const updateAppointmentStatus = (appointmentId: string, status: string, feedback = "") => {
    fetch("/api/appoinment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, status, feedback })
    })
      .then((res) => res.json())
      .then((updated) => {
        // Update the appointments state after update
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === appointmentId ? updated : apt))
        );
      })
      .catch((err) => console.error("Error updating appointment:", err));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const addService = () => {
    if (!userData) return;
    fetch("/api/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...newService,
        providerId: userData.id,
        price: parseFloat(newService.price)
      })
    })
      .then((res) => res.json())
      .then((service: Service) => {
        setServices([...services, service]);
        // Radix Dialog will automatically close via the Close button
      })
      .catch((err) => console.error("Error adding service:", err));
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.status === "confirmed" && new Date(apt.scheduledAt) > new Date()
  );

  if (!userData) {
    return <div className="p-8">Loading Service Provider Dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Service Provider Dashboard</h1>
      <p className="mb-4">
        Welcome, {userData.email}! (Role: {roleNames[userData.role]})
      </p>

      <Dialog.Root onOpenChange={(open) => {
        if (!open) {
          // Reset new service form when dialog closes
          setNewService({ title: "", description: "", price: "" });
        }
      }}>
        <Dialog.Trigger asChild>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add New Service
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Add New Service
            </Dialog.Title>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-1"
                htmlFor="title"
              >
                Service Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newService.title}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-1"
                htmlFor="description"
              >
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
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-1"
                htmlFor="price"
              >
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
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  onClick={addService}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Service
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="mt-2 text-gray-700">{service.description}</p>
              <p className="mt-2 font-medium">
                Price: ${service.price.toFixed(2)}
              </p>
              {/* Additional actions like edit or delete can be added here */}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
  <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
  {appointments.length === 0 ? (
    <p>No appointment requests.</p>
  ) : (
    <div className="space-y-4">
      {appointments.map((apt) => (
  <div key={apt.id} className="border rounded p-4 shadow">
    <p className="font-bold">
      {apt.service?.title || "Service information unavailable"}
    </p>
    <p>
      Scheduled At: {new Date(apt.scheduledAt).toLocaleString()}
    </p>
    <p>Status: {apt.status}</p>
    {apt.status === 'pending' && (
      <div className="flex space-x-4 mt-2">
        <button
          onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={() =>
            updateAppointmentStatus(
              apt.id,
              "declined",
              "Service not available at that time"
            )
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Decline
        </button>
      </div>
    )}
    {apt.feedback && (
      <p className="mt-1 text-sm text-gray-600">
        Feedback: {apt.feedback}
      </p>
    )}
  </div>
))}

    </div>
  )}
</div>
 {/* Upcoming Appointments Section */}
 <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
      {upcomingAppointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="border rounded p-4 shadow">
              <p className="font-bold">
                {apt.service?.title || "Service info unavailable"}
              </p>
              <p>
                Scheduled At: {new Date(apt.scheduledAt).toLocaleString()}
              </p>
              <p>Status: {apt.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
