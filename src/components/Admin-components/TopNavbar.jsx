import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
} from "react-icons/fi";
import { ACTIVITY, NAV_ITEMS } from "./dashboardData.js";
import axiosInstance from "../../utils/axiosinstance";







export default function TopNavbar({ user = null }) {
  const notifRef = useRef(null);
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
    
    if (notifRef.current && !notifRef.current.contains(event.target)) {
      setNotifOpen(false);
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
    <header className="w-full bg-[#0F172A] text-[#94A3B8] border-b border-[#1E293B] sticky top-0 z-50">
      <div
        className="absolute inset-x-0 top-0 h-16 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#94A3B8 0.5px, transparent 0.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative h-16 px-4 md:px-6 flex items-center justify-between">
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

        {/* CENTER - NAVIGATION (Desktop Only) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
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
          {/* NOTIFICATIONS */}
         <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
      setNotifOpen((prev) => !prev);
      setProfileOpen(false); 
    }}
              className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] text-slate-300 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors relative"
            >
              <FiBell />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#1E293B] rounded-2xl shadow-2xl border border-[#334155] z-50 p-2">
                <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">Notifications</span>
                  <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold">
                    3 NEW
                  </span>
                </div>
                {ACTIVITY.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="p-3 hover:bg-white/5 rounded-xl flex gap-3 cursor-pointer">
                      <span className="text-lg text-violet-400">{Icon ? <Icon /> : null}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-200 leading-tight">{item.text}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROFILE & MOBILE MENU */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-[#1E293B] border border-[#334155] hover:bg-slate-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-200">
               Profile
              </span>
              <span className="text-[10px] text-slate-400">
                {profileOpen ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#1E293B] rounded-2xl shadow-2xl border border-[#334155] z-50 overflow-hidden">
                <div className="px-4 py-4 border-b border-slate-700/50 bg-[#0F172A]/50">
                  <p className="text-sm font-bold text-white">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@learnx.com"}</p>
                </div>

                {/* MOBILE NAV ITEMS (Visible only on small screens) */}
                <div className="p-2 md:hidden border-b border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-500 px-3 mb-1 uppercase tracking-wider">Navigation</p>
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <span className="text-lg">{item.icon && <item.icon />}</span>
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors inline-flex items-center gap-3"
                  >
                    <FiLogOut className="text-lg" />
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