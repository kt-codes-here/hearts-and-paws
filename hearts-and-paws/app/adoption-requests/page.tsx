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
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const filteredRequests = requests
    .filter((request) => {
      if (filterStatus === "all") return true;
      return request.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const getPetAttributes = (pet) => {
    const attributes = [];
    if (pet.age) attributes.push(`${pet.age} years old`);
    if (pet.breed) attributes.push(pet.breed);
    if (pet.gender) attributes.push(pet.gender);
    return attributes.join(" • ");
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Please sign in to view adoption requests</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#675bc8]">
          <span className="relative">
            Adoption Requests
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#675bc8] to-[#8b80e0]"></span>
          </span>
        </h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
            <span>Filter & Sort</span>
            {filterStatus !== "all" && <span className="bg-[#675bc8] text-white text-xs px-2 rounded-full ml-1">1</span>}
          </button>

          <button
            className={`py-2 px-4 rounded-lg transition-all duration-200 ${activeTab === "received" ? "bg-[#675bc8] text-white font-medium shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
        </div>
      </div>

      <div className={`bg-white rounded-xl shadow-md mb-6 overflow-hidden transition-all duration-300 ${isFilterOpen ? "max-h-60" : "max-h-0"}`}>
        {isFilterOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by status</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${filterStatus === status ? "bg-[#675bc8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {status === "all" ? "All Requests" : status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== "all" && <span className="ml-1 bg-white bg-opacity-20 px-1.5 rounded-full text-xs">{requests.filter((r) => r.status === status).length}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort by</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder("newest")}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${sortOrder === "newest" ? "bg-[#675bc8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Newest first
                </button>
                <button
                  onClick={() => setSortOrder("oldest")}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${sortOrder === "oldest" ? "bg-[#675bc8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Oldest first
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending", status: "pending", icon: "⏳", color: "yellow" },
          { label: "Approved", status: "approved", icon: "✅", color: "green" },
          { label: "Rejected", status: "rejected", icon: "❌", color: "red" },
        ].map((item) => {
          const count = requests.filter((r) => r.status === item.status).length;
          return (
            <div
              key={item.status}
              className={`bg-${item.color === "purple" ? "[#f0eefe]" : item.color + "-50"} 
                p-4 rounded-xl shadow-sm flex items-center border 
                ${item.color === "purple" ? "border-[#d0c8fb]" : "border-" + item.color + "-200"}`}
            >
              <div
                className={`w-12 h-12 
                ${item.color === "purple" ? "bg-[#e0dcfb]" : "bg-" + item.color + "-100"} 
                rounded-full flex items-center justify-center text-xl mr-4`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm">{item.label} Requests</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center p-16 bg-white rounded-xl shadow-md">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#675bc8] animate-spin"></div>
            <div
              className="h-16 w-16 rounded-full border-r-4 border-l-4 border-gray-200 animate-spin absolute top-0 left-0"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="mt-4 text-gray-600">Loading your adoption requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-xl shadow-md">
          <div className="inline-flex justify-center items-center w-24 h-24 bg-[#f0eefe] rounded-full mb-6">
            <div className="text-6xl animate-bounce">🐾</div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-800">No matching requests found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">{filterStatus !== "all" ? `You don't have any ${filterStatus} adoption requests.` : "You don't have any adoption requests yet."}</p>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Show all requests
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group ${selectedRequest === request.id ? "ring-2 ring-[#675bc8]" : ""}`}
            >
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <Image
                    src={request.pet.images?.[0] || "/no-image.png"}
                    alt={request.pet.name}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-transparent p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{request.pet.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${request.status === "pending" ? "bg-yellow-400 text-yellow-800" : request.status === "approved" ? "bg-green-400 text-green-800" : "bg-red-400 text-red-800"}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#675bc8] bg-gray-200">
                      <Image
                        src={request.requester.profileImage || "/default-profile.png"}
                        alt={request.requester.firstName || "User"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      {request.requester.firstName} {request.requester.lastName}
                    </span>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">Submitted {formatTimeAgo(request.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-3">{getPetAttributes(request.pet)}</p>

                {request.message && (
                  <div
                    className="mb-4 p-4 bg-[#f8f7fe] rounded-lg border-l-4 border-[#675bc8] cursor-pointer relative group"
                    onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                  >
                    <p className={`text-gray-700 ${selectedRequest === request.id ? "" : "line-clamp-2"}`}>{request.message}</p>
                    {request.message.length > 120 && selectedRequest !== request.id && <span className="text-[#675bc8] text-xs font-medium absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">Show more</span>}
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  {request.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleRequestAction(request.id, "rejected")}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium flex items-center gap-1"
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
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        Decline
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, "approved")}
                        className="px-4 py-2 bg-gradient-to-r from-[#675bc8] to-[#8b80e0] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center gap-1 shadow-md"
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
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Approve
                      </button>
                    </>
                  ) : (
                    <Link
                      href={`/pet/${request.pet.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Pet Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}
