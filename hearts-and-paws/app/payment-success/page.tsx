"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function confirmPayment() {
      if (!sessionId) {
        router.push("/rehomer-dashboard");
        return;
      }
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Payment confirmation error:", errorData.error);
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("Payment confirmation result:", data);
        setLoading(false);
        // Redirect after showing success message for 2 seconds.
        setTimeout(() => {
          router.push("/rehomer-dashboard");
        }, 2000);
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    }
    confirmPayment();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Processing Payment...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700">
        Thank you for your purchase. Your payment session ID is:{" "}
        <span className="font-semibold">{sessionId}</span>
      </p>
      <p className="mt-2 text-gray-600">Your appointment is now confirmed.</p>
    </div>
  );
}
