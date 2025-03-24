"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
      fetch(`/api/appoinment?adopterId=${userData.id}`)
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
    setAppointmentDateTime(appointment.scheduledAt.slice(0,16)); // ISO string adjustment
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
      const adopterId = userData.id;
      try {
        const res = await fetch("/api/appoinment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: selectedService.id,
            adopterId,
            scheduledAt: appointmentDateTime,
          }),
        });
        if (res.ok) {
          alert("Appointment request submitted!");
          setSelectedService(null);
          setAppointmentDateTime("");
          // Optionally, refresh appointments:
          fetch(`/api/appointment?adopterId=${adopterId}`)
            .then((res) => res.json())
            .then((data) => setAppointments(Array.isArray(data) ? data : []));
        } else {
          alert("Failed to book appointment.");
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Error booking appointment.");
      }
    } else if (selectedAppointment) {
      // Request a date change for an existing appointment
      try {
        const res = await fetch("/api/appointment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: selectedAppointment.id,
            status: "pending", // or another status indicating date change request
            scheduledAt: appointmentDateTime,
          }),
        });
        if (res.ok) {
          alert("Date change request submitted!");
          setSelectedAppointment(null);
          setAppointmentDateTime("");
          // Optionally, refresh appointments:
          if (userData) {
            fetch(`/api/appointment?adopterId=${userData.id}`)
              .then((res) => res.json())
              .then((data) => setAppointments(Array.isArray(data) ? data : []));
          }
        } else {
          alert("Failed to update appointment date.");
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
            <div key={service.id} className="border rounded p-4 shadow">
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
            if (!open) setSelectedService(null);
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Book Appointment for {selectedService.title}
              </Dialog.Title>
              <div className="mb-4">
                <label htmlFor="appointmentDateTime" className="block text-gray-700 mb-1">
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
              <div className="flex justify-end space-x-2">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={submitAppointment}
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

      {/* Section: Requested Appointments & Date Change Requests */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">My Requested Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">You have no appointment requests yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="border rounded p-4 shadow">
                <h3 className="text-xl font-bold">{apt.service.title}</h3>
                <p className="mt-1 text-gray-700">{apt.service.description}</p>
                <p className="mt-1">
                  Scheduled At:{" "}
                  {new Date(apt.scheduledAt).toLocaleString()}
                </p>
                <p className="mt-1 font-medium">Status: {apt.status}</p>
                {apt.feedback && (
                  <p className="mt-1 text-sm text-gray-600">
                    Feedback: {apt.feedback}
                  </p>
                )}
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
              <Dialog.Title className="text-xl font-semibold mb-4">
                Request Date Change for {selectedAppointment.service.title}
              </Dialog.Title>
              <div className="mb-4">
                <label htmlFor="newDateTime" className="block text-gray-700 mb-1">
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
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                    Cancel
                  </button>
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
