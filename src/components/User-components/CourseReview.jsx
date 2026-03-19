import React, { useState } from "react";
import { Star, Send, AlertCircle } from "lucide-react";

const CourseReviewForm = ({ courseId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  // Validation: Count words
  const getWordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordCount = getWordCount(review);

    // Validation Logic
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (wordCount === 0) {
      setError("Please write a short review.");
      return;
    }
    if (wordCount > 100) {
      setError("Review must be 100 words or less.");
      return;
    }

    setError("");
    const reviewData = {
      course_id: courseId,
      rating: rating,
      comment: review.trim(),
    };

    console.log("Submitting Review:", reviewData);
    if (onSubmit) onSubmit(reviewData);
    
    // Reset form after success
    setReview("");
    setRating(0);
  };

  return (
    <div className="bg-white border border-[#EAD7B1] rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
      <h3 className="text-[#0F172A] font-black text-xl mb-1">Rate this Course</h3>
      <p className="text-gray-500 text-sm mb-6">Share your experience with other students.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hover || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-bold text-gray-600">
                {rating}/5 Stars
              </span>
            )}
          </div>
        </div>

        {/* Review Text Area */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-bold text-gray-700">Written Review</label>
            <span className={`text-[11px] font-bold ${getWordCount(review) > 100 ? "text-red-500" : "text-gray-400"}`}>
              {getWordCount(review)} / 100 Words
            </span>
          </div>
          <textarea
            rows="4"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you like or dislike about this course?"
            className={`w-full p-4 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-[#E3A83C] focus:outline-none ${
              getWordCount(review) > 100 ? "border-red-500 bg-red-50" : "border-[#EAD7B1]"
            }`}
          />
        </div>

        {/* Error Handling */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs font-bold">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#E3A83C] text-white font-black py-3 rounded-xl hover:bg-[#cf962c] transition-all flex items-center justify-center gap-2 shadow-md"
        >
          Submit Review
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default CourseReviewForm;