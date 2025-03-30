"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AdoptionNotifications() {
  const { user, isLoaded } = useUser();
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      checkApprovedRequests();
    }
  }, [isLoaded, user]);

  const checkApprovedRequests = async () => {
    try {
      const response = await fetch("/api/adoption-requests?type=sent&status=approved&unread=true");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch adoption notifications");
      }

      setApprovedRequests(data.requests);
      setHasChecked(true);

      // Show notification for each approved request
      if (data.requests.length > 0) {
        data.requests.forEach((request) => {
          toast(
            <div>
              <p className="font-medium">Adoption Approved!</p>
              <p>Your request to adopt {request.pet.name} has been approved.</p>
              <Link
                href="/requests"
                className="text-blue-600 hover:underline block mt-1"
              >
                View details
              </Link>
            </div>,
            {
              duration: 8000,
              style: {
                borderLeft: "4px solid #10b981",
              },
            }
          );
        });

        // Mark notifications as read
        markNotificationsAsRead(data.requests.map((req) => req.id));
      }
    } catch (error) {
      console.error("Error checking adoption notifications:", error);
    }
  };

  const markNotificationsAsRead = async (requestIds) => {
    try {
      await fetch("/api/adoption-requests/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestIds }),
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return null; // This component doesn't render anything, it just shows toasts
}
