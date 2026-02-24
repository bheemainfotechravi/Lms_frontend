// MyCourses.jsx
// Props:
//   courses   — array from ENROLLED_COURSES in dashboardData.js
//   limit     — optional, number of courses to show (default: show all)
//   title     — optional section title override
//   onViewAll — optional callback for "View All" button

import { useState } from "react";

// ── Circular progress ring ──
function ProgressRing({ percent, size = 40, stroke = 3.5 }) {
  const color  = percent === 100 ? "#10B981" : "#7C3AED";
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function MyCourses({
  courses   = [],
  limit,
  title     = "My Courses",
  onViewAll,
}) {
  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { key: "all",        label: "All"         },
    { key: "progress",   label: "In Progress" },
    { key: "completed",  label: "Completed"   },
    { key: "started",    label: "Just Started"},
  ];

  const filtered = courses
    .filter((c) => {
      if (filter === "all")       return true;
      if (filter === "progress")  return c.progress > 0 && c.progress < 100;
      if (filter === "completed") return c.progress === 100;
      if (filter === "started")   return c.progress <= 15;
      return true;
    })
    .slice(0, limit || courses.length);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 flex-wrap gap-3">
        <h3 className="text-gray-900 font-black text-sm">{title}</h3>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
                  ${filter === f.key
                    ? "bg-white text-primary shadow-sm border border-gray-100"
                    : "text-gray-400 hover:text-gray-700"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View all */}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-primary text-xs font-bold hover:opacity-75 transition-opacity whitespace-nowrap"
            >
              View All →
            </button>
          )}
        </div>
      </div>

      {/* ── Course List ── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-gray-500 text-sm font-semibold">No courses match this filter.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.thumbBg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                {course.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-gray-900 text-sm font-bold truncate">{course.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${course.tagClass}`}>
                    {course.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2">by {course.instructor} · {course.category}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[200px]">
                    <div
                      className={`${course.progressBar} rounded-full h-1.5 transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs font-semibold shrink-0">
                    {course.doneLessons}/{course.totalLessons} lessons
                  </span>
                </div>
              </div>

              {/* Right — ring + hours + action */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                {/* Progress ring with label */}
                <div className="relative">
                  <ProgressRing percent={course.progress} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-gray-700 rotate-90">
                    {course.progress === 100 ? "✓" : `${course.progress}%`}
                  </span>
                </div>

                {/* Hours */}
                <p className="text-gray-400 text-xs">{course.doneHours}h / {course.totalHours}h</p>
              </div>

              {/* Action button */}
              <button className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl border transition-all
                ${course.progress === 100
                  ? "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                  : "border-primary/30 text-primary hover:bg-violet-50"
                }`}>
                {course.progress === 100 ? "Review" : course.progress === 0 ? "Start" : "Resume"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer: summary ── */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-gray-400 text-xs">
          Showing <span className="font-bold text-gray-600">{filtered.length}</span> of{" "}
          <span className="font-bold text-gray-600">{courses.length}</span> courses
        </p>
        <p className="text-gray-400 text-xs">
          {courses.filter((c) => c.progress === 100).length} completed ·{" "}
          {courses.filter((c) => c.progress > 0 && c.progress < 100).length} in progress
        </p>
      </div>
    </div>
  );
}