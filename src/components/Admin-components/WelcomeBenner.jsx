import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiSmile } from "react-icons/fi";

export default function WelcomeBanner({ user }) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200">
      <div className="relative z-10 flex justify-between items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-2 inline-flex items-center gap-2">
            Welcome back
            <FiSmile className="text-cyan-300" />
          </h2>

          <p className="text-slate-400 font-medium mb-6">
            Good {new Date().getHours() < 12 ? "Morning" : "Evening"},{" "}
            {user?.name || "Admin"}! You have 23 pending approvals to review
            today.
          </p>

          <div className="flex gap-3">
          <button
  onClick={() => navigate("/admin/reviewcourses")}
  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-lg shadow-violet-500/20"
>
  Review Courses
  <FiArrowRight />
</button>

            <button
              onClick={() => navigate("/admin/users")}
              className="px-6 py-2.5 bg-white/10 rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px]" />
    </section>
  );
}
