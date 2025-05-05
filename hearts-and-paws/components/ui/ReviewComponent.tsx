"use client";

import { useState, useEffect } from "react";
import { Star, Edit, Trash, X, Check } from "lucide-react";

interface ReviewComponentProps {
  reviewId?: string;
  initialRating?: number;
  initialComment?: string;
  providerId: string;
  customerId: string;
  appointmentId: string;
  serviceName: string;
  editable: boolean;
  onReviewCreated?: (review: any) => void;
  onReviewUpdated?: (review: any) => void;
  onReviewDeleted?: (reviewId: string) => void;
}

export default function ReviewComponent({ reviewId, initialRating = 0, initialComment = "", providerId, customerId, appointmentId, serviceName, editable, onReviewCreated, onReviewUpdated, onReviewDeleted }: ReviewComponentProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(!reviewId); // New reviews start in edit mode
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load reviews from local storage
  const getReviews = () => {
    const reviews = localStorage.getItem("reviews");
    return reviews ? JSON.parse(reviews) : [];
  };

  // Save reviews to local storage
  const saveReview = (review: any) => {
    const reviews = getReviews();
    const existingIndex = reviews.findIndex((r: any) => r.id === review.id);
    if (existingIndex >= 0) {
      reviews[existingIndex] = review; // Update existing review
    } else {
      reviews.push(review); // Add new review
    }
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  // Delete review from local storage
  const deleteReviewFromStorage = (reviewId: string) => {
    const reviews = getReviews().filter((r: any) => r.id !== reviewId);
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  const handleRatingChange = (newRating: number) => {
    if (isEditing) setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const submitReview = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const review = {
        id: reviewId || crypto.randomUUID(), // Generate a unique ID for new reviews
        providerId,
        customerId,
        appointmentId,
        serviceName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      saveReview(review); // Save to local storage

      if (reviewId) {
        if (onReviewUpdated) onReviewUpdated(review); // Trigger update callback
      } else {
        if (onReviewCreated) onReviewCreated(review); // Trigger create callback
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!reviewId) return;

    if (!confirm("Are you sure you want to delete this review?")) return;

    setIsSubmitting(true);

    try {
      deleteReviewFromStorage(reviewId); // Delete from local storage

      if (onReviewDeleted) onReviewDeleted(reviewId); // Trigger delete callback

      // Reset the component state to allow a new review
      setRating(0);
      setComment("");
      setIsEditing(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {/* Display error message if any */}
      {error && <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">{error}</div>}

      {/* Service Name */}
      <p className="font-bold text-lg mb-2">{serviceName}</p>

      {/* Rating stars */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer ${isEditing ? "hover:text-yellow-400" : ""} ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            onClick={() => handleRatingChange(star)}
          />
        ))}
        {rating > 0 && <span className="ml-2 text-gray-600">({rating}/5)</span>}
      </div>

      {/* Comment section */}
      {isEditing ? (
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience with this service provider..."
          className="w-full p-2 border rounded min-h-[100px] mb-4"
        />
      ) : (
        comment && <p className="text-gray-700 mb-4">{comment}</p>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        {editable && (
          <>
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    if (reviewId) {
                      setRating(initialRating);
                      setComment(initialComment);
                      setIsEditing(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center text-gray-500 hover:text-gray-700 p-1"
                >
                  <X
                    size={18}
                    className="mr-1"
                  />
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={isSubmitting}
                  className="flex items-center bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check
                        size={18}
                        className="mr-1"
                      />
                      Save
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit
                    size={18}
                    className="mr-1"
                  />
                  Edit
                </button>
                <button
                  onClick={deleteReview}
                  disabled={isSubmitting}
                  className="flex items-center text-red-600 hover:text-red-800 p-1"
                >
                  <Trash
                    size={18}
                    className="mr-1"
                  />
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
