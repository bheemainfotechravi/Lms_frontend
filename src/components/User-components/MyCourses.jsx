import { useState, useEffect } from "react";
import axiosInstance, { image_URL } from "../../utils/axiosinstance";
import { useAuth } from "../../context/AuthContext";

// ── Circular progress ring ──
function ProgressRing({ percent, size = 40, stroke = 3.5 }) {
  const color = percent === 100 ? "#16A34A" : "#E3A83C";

  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#EFE6D3"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function MyCourses({ limit, title = "My Courses", onViewAll }) {

  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Fetch My Courses
  =============================== */

  useEffect(() => {

    if (!user?.id) return;

    const fetchMyCourses = async () => {

      try {

        const res = await axiosInstance.get(`/course/mycourses/${user.id}`);

        const formatted = res.data.courses.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          short_description: c.short_description,
          price: c.price,
          level: c.level,
          language: c.language,
          duration: c.duration,
          totalLectures: c.total_lectures,

          instructor: c.instructor || "Expert Instructor",
          category: c.category_name || "Development",

          progress: c.progress || 0,
          doneLessons: c.completed_lectures || 0,
          totalLessons: c.total_lectures || 0,

          doneHours: c.completed_hours || 0,
          totalHours: c.duration || 0,

          thumbnail: `${image_URL}/uploads/${c.thumbnail}`,

          tag: c.progress === 100 ? "Completed" : "In Progress",
          tagClass:
            c.progress === 100
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700",
        }));

        setCourses(formatted);

      } catch (error) {
        console.error("Error fetching my courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();

  }, [user]);

  const visibleCourses = courses.slice(0, limit || courses.length);

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EFE6D3] shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE6D3]">

        <h3 className="text-gray-800 font-bold text-sm">{title}</h3>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#E3A83C] text-xs font-bold hover:opacity-80"
          >
            View All →
          </button>
        )}

      </div>

      {/* Loading */}

      {loading ? (

        <div className="py-16 text-center text-gray-500 text-sm">
          Loading your courses...
        </div>

      ) : visibleCourses.length === 0 ? (

        <div className="py-16 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-gray-500 text-sm font-semibold">
            You haven't enrolled in any courses yet.
          </p>
        </div>

      ) : (

        <div className="divide-y divide-[#F3E8D5]">

          {visibleCourses.map((course) => (

            <div
              key={course.id}
              className="flex items-start gap-5 px-6 py-5 hover:bg-[#F6F1E7] transition group"
            >

              {/* Thumbnail */}

              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-[#EFE6D3]">

                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* Info */}

              <div className="flex-1">

                <div className="flex items-center gap-2 flex-wrap mb-1">

                  <p className="text-gray-900 text-sm font-semibold">
                    {course.title}
                  </p>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${course.tagClass}`}
                  >
                    {course.tag}
                  </span>

                </div>

                <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                  {course.short_description}
                </p>

                {/* Course Meta */}

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">

                  <span>📚 {course.totalLectures} Lectures</span>

                  <span>⏱ {course.duration}</span>

                  <span>🌐 {course.language}</span>

                  <span>📊 {course.level}</span>

                  <span className="font-semibold text-gray-700">
                    ₹{course.price}
                  </span>

                </div>

                {/* Progress Bar */}

                <div className="flex items-center gap-2">

                  <div className="flex-1 bg-[#EFE6D3] rounded-full h-1.5 max-w-[240px]">

                    <div
                      className="bg-[#E3A83C] rounded-full h-1.5"
                      style={{ width: `${course.progress}%` }}
                    />

                  </div>

                  <span className="text-gray-600 text-xs font-semibold">
                    {course.doneLessons}/{course.totalLessons}
                  </span>

                </div>

              </div>

              {/* Progress Ring */}

              <div className="flex flex-col items-center gap-1">

                <div className="relative">

                  <ProgressRing percent={course.progress} />

                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                    {course.progress === 100 ? "✓" : `${course.progress}%`}
                  </span>

                </div>

              </div>

              {/* Action Button */}

              <button
                className={`text-xs font-semibold px-4 py-2 rounded-xl border transition
                ${
                  course.progress === 100
                    ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                    : "border-[#E3A83C] text-[#E3A83C] hover:bg-[#F3E1BD]"
                }`}
              >
                {course.progress === 100
                  ? "Review"
                  : course.progress === 0
                  ? "Start"
                  : "Resume"}
              </button>

            </div>

          ))}

        </div>

      )}

      {/* Footer */}

      <div className="px-6 py-3 bg-[#F6F1E7] border-t border-[#EFE6D3] flex justify-between text-xs text-gray-500">

        <p>
          Showing <span className="font-bold text-gray-700">{visibleCourses.length}</span> of{" "}
          <span className="font-bold text-gray-700">{courses.length}</span> courses
        </p>

        <p>
          {courses.filter((c) => c.progress === 100).length} completed ·{" "}
          {courses.filter((c) => c.progress > 0 && c.progress < 100).length} in progress
        </p>

      </div>

    </div>
  );
}