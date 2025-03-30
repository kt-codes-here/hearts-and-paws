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
      <h1 className="text-3xl font-bold mb-8 text-[#675bc8] border-b pb-4">My Adoption Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#675bc8]"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-6">🐱</div>
          <p className="text-xl text-gray-600 mb-4">You haven't made any adoption requests yet.</p>
          <Link
            href="/pets"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#675bc8] to-[#8b80e0] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            Browse Available Pets
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 lg:w-1/4 relative">
                  <Image
                    src={request.pet.images?.[0] || "/no-image.png"}
                    alt={request.pet.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover md:h-64"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : request.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold">
                      <Link
                        href={`/pet/${request.pet.id}`}
                        className="text-[#675bc8] hover:text-[#8b80e0] transition-colors duration-200"
                      >
                        {request.pet.name}
                      </Link>
                    </h3>
                    <div className="text-sm bg-gray-50 px-3 py-1 rounded-lg">Requested on {new Date(request.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="mt-4">
                    {request.status === "pending" ? (
                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <svg
                              className="w-5 h-5 text-yellow-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <p className="font-semibold text-yellow-800">Your request is under review</p>
                        </div>
                        <p className="text-yellow-700 ml-10">The pet owner will review your adoption request soon.</p>
                      </div>
                    ) : request.status === "approved" ? (
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg
                              className="w-5 h-5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          </div>
                          <p className="font-semibold text-green-800">Congratulations! Your adoption request has been approved.</p>
                        </div>
                        <p className="text-green-700 ml-10 mb-3">Please contact the pet owner to arrange the adoption details.</p>
                        <div className="ml-10">
                          <Link
                            href={`/pet/${request.pet.id}`}
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            View pet details
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <svg
                              className="w-5 h-5 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-red-800">Your request was not approved</p>
                            <p className="text-sm text-red-700">Don't worry, there are many other pets looking for a loving home.</p>
                          </div>
                        </div>
                        <div className="mt-3 ml-10">
                          <Link
                            href="/pet-listing"
                            className="px-4 py-2 bg-gradient-to-r from-[#675bc8] to-[#8b80e0] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-sm inline-flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              ></path>
                            </svg>
                            Find More Pets
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pet Owner Information for approved requests */}
                  {request.status === "approved" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Pet Owner Information</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                          <Image
                            src={request.pet.owner?.profileImage || "/default-profile.png"}
                            alt={request.pet.owner?.firstName || "Owner"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {request.pet.owner?.firstName} {request.pet.owner?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{request.pet.owner?.email || "Contact through the platform"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline for the request */}
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500 border-t pt-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>Request submitted on {new Date(request.createdAt).toLocaleDateString()}</span>

                      {request.status !== "pending" && (
                        <>
                          <svg
                            className="w-4 h-4 ml-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                          <span>
                            Status updated to {request.status} on {new Date(request.updatedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
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
