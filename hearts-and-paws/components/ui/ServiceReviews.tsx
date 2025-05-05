"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface ServiceReviewsProps {
  providerId: string;
}

export default function ServiceReviews({ providerId }: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/review?providerId=${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service reviews:", err);
        setError("Failed to load reviews");
        setIsLoading(false);
      });
  }, [providerId]);

  if (isLoading) return <div className="py-4 text-center">Loading reviews...</div>;

  if (error) return <div className="py-4 text-center text-red-500">{error}</div>;

  if (reviews.length === 0) {
    return <div className="py-4 text-center text-gray-500">No reviews yet for this service provider</div>;
  }

  // Calculate the average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

      {/* Average rating */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-yellow-600 mr-2">{averageRating.toFixed(1)}</span>
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={`${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-gray-500">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="mr-3">
                  {review.customer?.profileImage ? (
                    <img
                      src={review.customer.profileImage}
                      alt={`${review.customer.firstName || "Customer"}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-semibold">{(review.customer?.firstName?.[0] || "C").toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {review.customer?.firstName} {review.customer?.lastName?.charAt(0) || ""}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            {review.comment && <p className="mt-2 text-gray-700 text-sm">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
