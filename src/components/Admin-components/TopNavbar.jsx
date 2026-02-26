import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiSearch,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ACTIVITY } from "./dashboardData";

export default function TopNavbar({
  user,
  today,
  notifOpen,
  setNotifOpen,
  sidebarOpen,
  setSidebarOpen,
}) {
  const  logout  = useAuth();
  const navigate = useNavigate();
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
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Admin logout failed", error);
    } finally {
      setProfileOpen(false);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
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

      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Search data..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 w-64 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors relative"
          >
            <FiBell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2">
              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-bold">
                  3 NEW
                </span>
              </div>

              {ACTIVITY.map((item, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-slate-50 rounded-xl flex gap-3 cursor-pointer"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700 leading-tight">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
