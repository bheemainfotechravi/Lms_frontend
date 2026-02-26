import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { RECENT_USERS } from "./dashboardData.js";

export default function RecentUsers() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Recent Users</h3>
        <button
          onClick={() => navigate("/admin/users")}
          className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1"
        >
          View All
          <FiArrowRight />
        </button>
      </div>

      <div className="space-y-4">
        {RECENT_USERS.map((user, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${user.color} text-white flex items-center justify-center font-bold text-xs`}
              >
                {user.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {user.joined}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
