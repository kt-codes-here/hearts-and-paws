"use client";

import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-4">
        Your payment was cancelled. If this was a mistake, please try again.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
