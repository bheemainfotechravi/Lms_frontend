import { ACTIVITY } from "./dashboardData";
import { FiMenu } from "react-icons/fi";
export default function TopNavbar({ user, today, notifOpen, setNotifOpen, sidebarOpen, setSidebarOpen, }) {
  return (
    

    <header className="flex justify-between items-center mb-8">
      
      {/* Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-slate-50 transition-colors flex items-center justify-center text-xl"
        >
          <FiMenu />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm font-medium">{today}</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search data..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors relative"
          >
            🔔
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2">
              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-bold">
                  3 NEW
                </span>
              </div>

              {ACTIVITY.map((a, i) => (
                <div key={i} className="p-3 hover:bg-slate-50 rounded-xl flex gap-3 cursor-pointer">
                  <span className="text-lg">{a.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 leading-tight">{a.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200">
          {user?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}

      
