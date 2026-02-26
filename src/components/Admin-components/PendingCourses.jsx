import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiBookOpen, FiCheck, FiX } from "react-icons/fi";
import { PENDING_COURSES } from "./dashboardData";

function PendingCourses() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Pending Approvals</h3>
        <button
          onClick={() => navigate("/admin/approve-courses")}
          className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
        >
          Review All
          <FiArrowRight />
        </button>
      </div>

      <div className="space-y-4">
        {PENDING_COURSES.map((course, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/30"
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
              <FiBookOpen />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">
                {course.title}
              </p>
              <p className="text-[11px] text-slate-500">
                by {course.instructor} - {course.category}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Approve course"
                className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs hover:bg-emerald-600 transition-colors"
              >
                <FiCheck />
              </button>
              <button
                type="button"
                aria-label="Reject course"
                className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingCourses;
