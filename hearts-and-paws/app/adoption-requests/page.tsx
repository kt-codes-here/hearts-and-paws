"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function AdoptionRequestsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchRequests(activeTab);
    }
  }, [isLoaded, user, activeTab]);

  const fetchRequests = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/adoption-requests?type=${type}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch adoption requests");
      }

      setRequests(data.requests);
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      toast.error(error.message || "Failed to fetch adoption requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`/api/adoption-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${status} request`);
      }

      toast.success(`Request ${status} successfully`);
      fetchRequests(activeTab);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(error.message || `Failed to ${status} request`);
    }
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Please sign in to view adoption requests</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Adoption Requests</h1>

      <div className="border-b mb-6">
        <div className="flex space-x-4">
          <button
            className={`pb-2 px-4 ${activeTab === "received" ? "border-b-2 border-[#675bc8] font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("received")}
          >
            Requests Received
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8">Loading adoption requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p>No {activeTab} adoption requests found.</p>
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
                    src={request.pet.images[0] || "/no-image.png"}
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
                        src={request.requester.profileImage || "/default-profile.png"}
                        alt={request.requester.firstName || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>
                      {request.requester.firstName} {request.requester.lastName}
                    </span>
                  </div>

                  {request.message && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm italic">{request.message}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleRequestAction(request.id, "rejected")}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, "approved")}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                      </>
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
