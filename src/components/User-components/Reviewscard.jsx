// ── Add this to your fetchCourse() state mapping ──
// avgRating: parseFloat(res.data.avgRating) || 0,
// totalReviews: res.data.totalReviews || 0,
// reviews: res.data.reviews || [],

// ── Add these fields to your setCourse() call ──
/*
  avgRating: parseFloat(res.data.avgRating) || 0,
  totalReviews: res.data.totalReviews || 0,
  reviews: res.data.reviews || [],
*/

// ── Add this import at top of CourseDetails.jsx ──
// import { FaStar, FaUserCircle } from "react-icons/fa";

// ── Paste this entire ReviewsCard component at the bottom of CourseDetails.jsx ──

function ReviewsCard({ avgRating, totalReviews, reviews }) {
  const filled = Math.floor(avgRating);

  // Calculate star distribution from actual reviews
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
      <h2 className="text-[#0F172A] font-black text-base mb-5 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#E3A83C] rounded-full" />
        Student Reviews
      </h2>

      {/* Rating Summary */}
      <div className="flex items-center gap-6 p-4 bg-[#F6F1E7] rounded-2xl border border-[#EAD7B1] mb-6">

        {/* Big Rating Number */}
        <div className="text-center flex-shrink-0">
          <div className="text-[#E3A83C] font-black text-5xl leading-none">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-0.5 my-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${i < filled ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-xs font-semibold">Course Rating</p>
          <p className="text-gray-400 text-xs">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</p>
        </div>

        {/* Star Bars */}
        <div className="flex-1 space-y-2">
          {starCounts.map(({ star, count }) => {
            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-8 flex-shrink-0">
                  <FaStar className="text-[#E3A83C] text-xs" />
                  <span className="text-xs text-gray-500">{star}</span>
                </div>
                <div className="flex-1 h-2 bg-[#EAD7B1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E3A83C] rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-[#F6F1E7] rounded-xl border border-[#EAD7B1]"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E3A83C] to-[#0F172A] flex items-center justify-center flex-shrink-0">
                <FaUserCircle className="text-white text-xl" />
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <FaStar
                        key={j}
                        className={`text-xs ${j < review.rating ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#0F172A] ml-1">{review.rating}.0</span>
                  </div>
                  {/* Date */}
                  <span className="text-gray-400 text-xs">{formatDate(review.created_at)}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.review_text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaStar className="text-3xl text-[#EAD7B1] mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
}