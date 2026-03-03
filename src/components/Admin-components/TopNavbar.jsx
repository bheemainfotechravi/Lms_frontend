import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import { ACTIVITY, NAV_ITEMS } from "./dashboardData.js";
import axiosInstance from "../../utils/axiosinstance";

export default function TopNavbar({
  user = null,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
  try {
    await axiosInstance.post("/admin/logout");
    logout();
    navigate("/admin/login", { replace: true });
  } catch (error) {
    console.error("Admin logout failed", error);
  } finally {
    setProfileOpen(false);
  }
};

  return (
    <header className="w-full bg-[#0F172A] text-[#94A3B8] border-b border-[#1E293B]">
      <div
        className="absolute inset-x-0 top-0 h-16 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#94A3B8 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative h-16 px-6 flex items-center">
        {/* LEFT - LOGO */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 shrink-0 cursor-pointer" 
        >
          <div className="w-9 h-9 min-w-[36px] rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/20">
            L
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:inline">
            LearnX{" "}
            <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded ml-1 uppercase">
              Admin
            </span>
          </span>
        </div>

        {/* CENTER - NAVIGATION */}
        <nav className="flex-1 flex justify-center items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-violet-600/20 text-white border border-violet-500/40"
                    : "hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="text-lg">{Icon ? <Icon /> : null}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          {/* SEARCH */}
          <div className="relative hidden xl:flex items-center">
            <span className="absolute left-3 text-slate-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search data..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 w-56 transition-all"
            />
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors relative"
            >
              <FiBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-700">
                    Notifications
                  </span>
                  <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-bold">
                    3 NEW
                  </span>
                </div>

                {ACTIVITY.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={`${item.text}-${index}`}
                      className="p-3 hover:bg-slate-50 rounded-xl flex gap-3 cursor-pointer"
                    >
                      <span className="text-lg text-slate-700">
                        {Icon ? <Icon /> : null}
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-700 leading-tight">
                          {item.text}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-700">
                Profile
              </span>
              <span className="text-[10px] text-slate-400">
                {profileOpen ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || "admin@dashboard"}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}