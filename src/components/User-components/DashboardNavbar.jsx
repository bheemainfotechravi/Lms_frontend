import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance.js";


const NAV_TABS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "my-courses", label: "My Courses", icon: "📚" },
  { key: "learn", label: "Continue", icon: "🎥" },
  { key: "leaderboard", label: "Progress", icon: "📈" },
  { key: "recommended", label: "Explore", icon: "🔍" },
  { key: "certificates", label: "Certificates", icon: "🏆" },
  { key: "settings", label: "Profile", icon: "👤" },
];

export default function DashboardNavbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");

      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50
                   bg-gradient-to-r from-white/5 to-white/0
                   backdrop-blur-2xl
                   border-b border-white/20
                   shadow-[0_8px_32px_rgba(0,0,0,0.1)]">

      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">
            L
          </div>
          <span className="text-base font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LearnX
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <span className="text-sm shrink-0">🔍</span>
          <input
            type="text"
            placeholder="Search courses, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 placeholder-gray-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="text-gray-300 hover:text-gray-500 transition-colors text-sm">
              ✕
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-base hover:border-primary hover:bg-violet-50 transition-all">
            🔔
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xs">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-gray-900 text-xs font-bold leading-none">{user?.first_name?.split(" ")[0] || "Student"}</p>
                <p className="text-gray-400 text-xs mt-0.5">Student</p>
              </div>
              <span className="text-gray-400 text-xs ml-1">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-gray-900 text-sm font-bold">{user?.first_name || "Student"}</p>
                  <p className="text-gray-400 text-xs truncate">{user?.email || ""}</p>
                </div>

                {/* Menu items */}
                {[
                  { icon: "👤", label: "Profile & Settings", tab: "settings" },
                  { icon: "🏆", label: "My Certificates", tab: "certificates" },
                  { icon: "📚", label: "My Courses", tab: "my-courses" },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors text-left"
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                <div className="border-t border-gray-50 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200
                  ${active
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
                  }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}