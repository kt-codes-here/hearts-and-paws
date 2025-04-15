"use client";

export default function Error({
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 