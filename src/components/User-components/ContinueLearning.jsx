import {
  FiPlay,
  FiClock,
  FiLock,
  FiBookmark,
  FiBookOpen,
  FiCheckCircle
} from "react-icons/fi";

export default function ContinueLearning({ course, expanded = false }) {
  if (!course) return null;

  const remainingHours = course.totalHours - course.doneHours;
  const remainingLessons = course.totalLessons - course.doneLessons;

  return (
    <div className="space-y-4">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, #E3A83C 0%, #F5C96A 100%)"
        }}
      >

        {/* Decorative shapes */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Course info */}
          <div className="flex-1">

            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">
              Continue where you left off
            </p>

            <div className="flex items-center gap-3 mb-3">

              <div className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0`}>
                {course.emoji}
              </div>

              <div>
                <h2 className="text-white font-black text-lg leading-tight">
                  {course.title}
                </h2>

                <p className="text-white/80 text-sm mt-0.5">
                  by {course.instructor}
                </p>
              </div>
            </div>

            {/* Last lesson */}
            <p className="text-white/80 text-xs mb-4 flex items-center gap-2">
              <FiBookmark className="text-sm" />
              Last lesson:
              <span className="text-white font-semibold">
                {course.lastLesson}
              </span>
            </p>

            {/* Progress */}
            <div className="mb-2">

              <div className="flex justify-between mb-1.5">
                <span className="text-white/80 text-xs">Progress</span>
                <span className="text-white text-xs font-black">
                  {course.progress}%
                </span>
              </div>

              <div className="bg-white/30 rounded-full h-2 w-full max-w-sm">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-700"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

            </div>

            {/* Meta pills */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">

              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <FiCheckCircle className="text-xs" />
                {course.doneLessons} lessons done
              </span>

              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <FiClock className="text-xs" />
                {remainingHours}h remaining
              </span>

              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <FiBookOpen className="text-xs" />
                {remainingLessons} lessons left
              </span>

            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start md:items-center gap-3 shrink-0">

            <button className="flex items-center gap-2 bg-white text-[#0F172A] font-bold text-sm px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <FiPlay />
              Resume Course
            </button>

            <button className="text-white/80 text-xs font-medium hover:text-white transition-colors">
              View course details →
            </button>

          </div>
        </div>
      </div>

      {/* Expanded lesson list */}
      {expanded && (
        <div className="bg-white rounded-2xl border border-[#EAD7B1] shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-[#F0E3C7]">
            <h3 className="text-[#0F172A] font-black text-sm">
              Up Next in This Course
            </h3>
          </div>

          <div className="divide-y divide-[#F3E7CC]">

            {[
              { no: course.doneLessons + 1, title: "REST API Integration", duration: "22 min", locked: false },
              { no: course.doneLessons + 2, title: "Authentication with JWT", duration: "34 min", locked: false },
              { no: course.doneLessons + 3, title: "Deploying with Vercel", duration: "18 min", locked: true },
              { no: course.doneLessons + 4, title: "Optimizing Performance", duration: "27 min", locked: true },
            ].map((lesson, i) => (

              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-4 transition-colors
                ${lesson.locked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#F9F4E8] cursor-pointer"
                  }`}
              >

                {/* Lesson number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0
                  ${lesson.locked
                      ? "bg-gray-100 text-gray-400"
                      : "bg-[#F6E4B5] text-[#E3A83C]"
                    }`}
                >
                  {lesson.locked ? <FiLock /> : lesson.no}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#0F172A] text-sm font-semibold truncate">
                    {lesson.title}
                  </p>

                  <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                    <FiClock className="text-xs" />
                    {lesson.duration}
                  </p>
                </div>

                {/* Action */}
                {!lesson.locked && (
                  <button className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-[#E3A83C] border border-[#E3A83C] px-3 py-1.5 rounded-lg hover:bg-[#F6E4B5] transition-all">
                    <FiPlay className="text-xs" />
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