// ContinueLearning.jsx
// Props:
//   course   — single course object from ENROLLED_COURSES
//   expanded — boolean, shows extra lesson list when on the "learn" tab

export default function ContinueLearning({ course, expanded = false }) {
  if (!course) return null;

  const remainingHours = course.totalHours - course.doneHours;
  const remainingLessons = course.totalLessons - course.doneLessons;

  return (
    <div className="space-y-4">

      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Left — info */}
          <div className="flex-1">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Continue where you left off
            </p>

            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.thumbBg} flex items-center justify-center text-2xl shrink-0`}>
                {course.emoji}
              </div>
              <div>
                <h2 className="text-white font-black text-lg leading-tight">
                  {course.title}
                </h2>
                <p className="text-white/60 text-sm mt-0.5">by {course.instructor}</p>
              </div>
            </div>

            {/* Last lesson */}
            <p className="text-white/70 text-xs mb-4">
              📌 Last lesson: <span className="text-white font-semibold">{course.lastLesson}</span>
            </p>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between mb-1.5">
                <span className="text-white/70 text-xs">Progress</span>
                <span className="text-white text-xs font-black">{course.progress}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-2 w-full max-w-sm">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-700"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* Meta pills */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                ✅ {course.doneLessons} lessons done
              </span>
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                🕐 {remainingHours}h remaining
              </span>
              <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                📖 {remainingLessons} lessons left
              </span>
            </div>
          </div>

          {/* Right — CTA */}
          <div className="flex flex-col items-start md:items-center gap-3 shrink-0">
            <button className="bg-white text-primary font-black text-sm px-8 py-3 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all">
              ▶ Resume Course
            </button>
            <button className="text-white/60 text-xs font-medium hover:text-white transition-colors">
              View course details →
            </button>
          </div>
        </div>
      </div>

      {/* ── Expanded: upcoming lessons list (shown on "learn" tab) ── */}
      {expanded && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-gray-900 font-black text-sm">Up Next in This Course</h3>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              { no: course.doneLessons + 1, title: "REST API Integration",        duration: "22 min", done: false, locked: false },
              { no: course.doneLessons + 2, title: "Authentication with JWT",      duration: "34 min", done: false, locked: false },
              { no: course.doneLessons + 3, title: "Deploying with Vercel",        duration: "18 min", done: false, locked: true  },
              { no: course.doneLessons + 4, title: "Optimizing Performance",       duration: "27 min", done: false, locked: true  },
            ].map((lesson, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-4 transition-colors
                  ${lesson.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
              >
                {/* Lesson number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0
                  ${lesson.locked ? "bg-gray-100 text-gray-400" : "bg-violet-50 text-primary"}`}>
                  {lesson.locked ? "🔒" : lesson.no}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-semibold truncate">{lesson.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">🕐 {lesson.duration}</p>
                </div>

                {/* Action */}
                {!lesson.locked && (
                  <button className="shrink-0 text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-all">
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}