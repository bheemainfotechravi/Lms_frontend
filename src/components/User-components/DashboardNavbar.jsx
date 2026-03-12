import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";

import {
  FiBell,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiHome,
  FiBook,
  FiPlayCircle,
  FiAward,
  FiUserPlus,
  FiLogIn
} from "react-icons/fi";

const NAV_TABS = [
  { key: "dashboard", label: "Dashboard", icon: FiHome, path: "/user/dashboard" },
  { key: "my-courses", label: "My Courses", icon: FiBook, path: "/user/mycourses" },
  { key: "learn", label: "Continue", icon: FiPlayCircle, path: "/user/learning" },
  { key: "certificates", label: "Certificates", icon: FiAward, path: "/user/certificates" },
];

export default function DashboardNavbar({ activeTab, setActiveTab }) {
  // Destructure isAuthenticated from useAuth
  const { user, logout, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTabClick = (tab) => {
    if (setActiveTab) setActiveTab(tab.key);
    navigate(tab.path);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (error) {
      console.error("Backend logout failed", error);
    } finally {
      logout(); 
      navigate("/login", { replace: true });
      setProfileOpen(false);
    }
  };

  return (
    <header className="w-full bg-[#F3E1BD] border-b border-[#EAD7B1] sticky top-0 z-50">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div
          onClick={() => navigate(isAuthenticated ? "/user/dashboard" : "/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#E3A83C] flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <span className="text-[#0F172A] font-bold text-xl tracking-tight hidden sm:inline">
            LearnX
          </span>
        </div>

        {/* CENTER NAV (Only visible if logged in) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          {isAuthenticated && NAV_TABS.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                ${active ? "bg-[#E3A83C] text-white shadow-sm" : "text-[#0F172A] hover:bg-[#EAD7B1]"}`}
              >
                <Icon className="text-base" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /* --- LOGGED IN STATE --- */
            <>
              {/* NOTIFICATIONS */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#EAD7B1] text-[#0F172A] flex items-center justify-center text-lg hover:bg-[#F6F1E7] transition-colors relative"
                >
                  <FiBell />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border border-[#EAD7B1] z-50 p-2">
                    <div className="px-4 py-3 border-b border-[#F0E3C7]">
                      <span className="font-bold text-sm text-[#0F172A]">Notifications</span>
                    </div>
                    <div className="p-3 hover:bg-[#F6F1E7] rounded-xl text-sm text-gray-500">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white border border-[#EAD7B1] hover:bg-[#F6F1E7] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E3A83C] flex items-center justify-center text-white font-bold uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-[#0F172A]">
                    {user?.name?.split(' ')[0] || "Profile"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profileOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border border-[#EAD7B1] z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b border-[#F0E3C7] bg-[#F6F1E7]">
                      <p className="text-sm font-bold text-[#0F172A]">{user?.name || "Student"}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    {/* MOBILE NAV (Inside Profile Menu for Small Screens) */}
                    <div className="p-2 md:hidden border-b border-[#F0E3C7]">
                      <p className="text-[10px] font-bold text-gray-500 px-3 mb-1 uppercase tracking-wider">Navigation</p>
                      {NAV_TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => handleTabClick(tab)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#0F172A] hover:bg-[#F6F1E7] transition-colors"
                          >
                            <Icon className="text-lg" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors inline-flex items-center gap-3"
                      >
                        <FiLogOut className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* --- LOGGED OUT STATE --- */
           <div className="ml-auto flex items-center gap-3">
                     <Link to="/login">
                       <button className="border border-[#d68d06] text-gray-700 text-sm font-semibold px-5 py-2 rounded-xl hover:border-primary hover:text-primary transition-all">
                         Log In
                       </button>
                     </Link>
                     <Link to="/register">
                       <button className="border border-[#d68d06] text-gray-700 text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 hover:-translate-y-px transition-all">
                         Register
                       </button>
                     </Link>
                   </div>
          )}
        </div>
      </div>
    </header>
  );
}