// RecommendedCourses.jsx
// Props:
//   courses   — array from RECOMMENDED_COURSES in dashboardData.js
//   limit     — optional, number of courses to show (default: show all)
//   onViewAll — optional callback for "Browse All" button

import { useState } from "react";

const CATEGORY_FILTERS = ["All", "Development", "AI & ML", "Design", "Cloud"];

export default function RecommendedCourses({
  courses   = [],
  limit,
  onViewAll,
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist]         = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const filtered = courses
    .filter((c) =>
      activeFilter === "All" ? true : c.category === activeFilter
    )
    .slice(0, limit || courses.length);

  const discount = (orig, price) =>
    Math.round(((orig - price) / orig) * 100);

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-gray-900 font-black text-sm">
            Recommended for You ✨
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Based on your enrolled courses
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary text-xs font-bold hover:opacity-75 transition-opacity"
          >
            Browse All →
          </button>
        )}
      </div>

      {/* ── Category filter pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200
              ${activeFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Course Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-gray-500 text-sm font-semibold">
            No courses found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col"
            >
              {/* Thumbnail */}
              <div className={`h-32 bg-gradient-to-br ${course.thumbBg} flex items-center justify-center relative`}>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                  {course.emoji}
                </div>

                {/* Tag badge */}
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${course.tagClass}`}>
                  {course.tag}
                </span>

                {/* Wishlist button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(course.id); }}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all
                    ${wishlist.includes(course.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-400 hover:text-red-400"
                    }`}
                >
                  {wishlist.includes(course.id) ? "♥" : "♡"}
                </button>

                {/* Discount badge */}
                <span className="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                  -{discount(course.originalPrice, course.price)}%
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                {/* Category */}
                <p className={`text-xs font-bold tracking-wide uppercase mb-1.5 ${course.accentClass}`}>
                  {course.category}
                </p>

                {/* Title */}
                <h4 className="text-gray-900 text-sm font-bold leading-snug mb-1 flex-1">
                  {course.title}
                </h4>

                {/* Instructor */}
                <p className="text-gray-400 text-xs mb-3">by {course.instructor}</p>

                {/* Rating + students */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-gray-700 text-xs font-black">{course.rating}</span>
                    <span className="text-gray-400 text-xs">({course.students})</span>
                  </div>
                  <span className="text-gray-400 text-xs">🕐 {course.hours}h</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-900 text-base font-black">₹{course.price}</span>
                  <span className="text-gray-400 text-xs line-through">₹{course.originalPrice}</span>
                </div>

                {/* Enroll button */}
                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}