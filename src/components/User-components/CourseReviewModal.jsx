import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { FaStar } from "react-icons/fa";

export default function CourseReviewModal({
  isOpen,
  courseId,
  onClose,
  onSubmitted,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);

      await axiosInstance.post(`/review/add-review/${courseId}`, {
        rating,
        review_text: reviewText,
      });

      setRating(0);
      setHoverRating(0);
      setReviewText("");

      onSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAD7B1] shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#EAD7B1] bg-[#FDFAF5]">
          <h2 className="text-[#0F172A] text-lg font-black">
            Course Completed 🎉
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            You’ve completed all lessons. Rate this course and leave a review.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5">
            <p className="text-[#0F172A] text-sm font-bold mb-3">Your Rating</p>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition hover:scale-110"
                  >
                    <FaStar
                      className={`text-2xl ${
                        active ? "text-[#E3A83C]" : "text-[#EAD7B1]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {rating ? `${rating} out of 5 stars` : "Select 1 to 5 stars"}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-[#0F172A] text-sm font-bold mb-2">
              Your Review
            </label>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              placeholder="Write your feedback about this course..."
              className="w-full bg-[#F6F1E7] border border-[#EAD7B1] rounded-2xl px-4 py-3 text-sm text-[#0F172A] placeholder-gray-400 resize-none focus:outline-none focus:border-[#E3A83C] transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#EAD7B1] text-[#0F172A] text-sm font-bold hover:bg-[#F6F1E7] transition"
            >
              Later
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !rating}
              className="px-5 py-2.5 rounded-xl bg-[#E3A83C] text-[#0F172A] text-sm font-black hover:bg-[#cf962c] transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}