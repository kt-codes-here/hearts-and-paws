"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function MyRequestsPage() {
  const { user, isLoaded } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchRequests();
    }
  }, [isLoaded, user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/adoption-requests?type=sent");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      setRequests(data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Please sign in to view your requests</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">My Adoption Requests</h1>

      {loading ? (
        <div className="text-center p-8">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p>You haven't made any adoption requests yet.</p>
          <Link
            href="/pets"
            className="text-[#675bc8] hover:underline mt-2 inline-block"
          >
            Browse Available Pets
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4">
                  <Image
                    src={request.pet.images?.[0] || "/no-image.png"}
                    alt={request.pet.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">
                      <Link
                        href={`/pet/${request.pet.id}`}
                        className="text-[#675bc8] hover:underline"
                      >
                        {request.pet.name}
                      </Link>
                    </h3>
                    <span className={`px-2 py-1 rounded text-sm ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : request.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={request.pet.owner?.profileImage || "/default-profile.png"}
                        alt={request.pet.owner?.firstName || "Owner"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>
                      Owner: {request.pet.owner?.firstName} {request.pet.owner?.lastName}
                    </span>
                  </div>

                  {request.message && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm italic">Your message: {request.message}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    {request.status === "pending" ? (
                      <p className="text-sm text-gray-500">Your request is pending review by the pet owner.</p>
                    ) : request.status === "approved" ? (
                      <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                        <p className="font-semibold">Congratulations! Your adoption request has been approved.</p>
                        <p className="mt-1">Please contact the pet owner to arrange the adoption details.</p>
                        <p className="mt-2">
                          <Link
                            href={`/pet/${request.pet.id}`}
                            className="text-[#675bc8] hover:underline"
                          >
                            View pet details
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Sorry, your adoption request was not approved.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
