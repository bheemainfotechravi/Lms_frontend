import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { logout, logoutUser } from "../../features/auth/authSlice";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { RiShieldFlashLine } from "react-icons/ri"; 
import axiosInstance from "../../utils/axiosinstance";


const ACTIVITY = [
  { text: "New trainer registration request", time: "5 min ago", icon: FiUser },
  { text: "System backup completed", time: "1 hour ago", icon: FiSettings },
  { text: "New company onboarded: TechCorp", time: "3 hours ago", icon: RiShieldFlashLine },
];

export default function TopNavbar({ user = null }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
 const { user: authUser } = useSelector((state) => state.auth);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const fetchNotifications = async () => {
  try {
    const res = await axiosInstance.get("/admin/get_userReqs");
    const requests = res.data?.message?.requests || [];
    setNotifications(requests);
  } catch (err) {
    console.error("Notification fetch error", err);
  }
};
useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications(); 
  }, 10000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

 const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };
  

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[60] px-4 md:px-8">
      <div className="h-20 flex items-center justify-between max-w-[1600px] mx-auto">
        <div 
          onClick={() => navigate("/superadmin/dashboard")}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform duration-300">
            <RiShieldFlashLine size={24} className="text-indigo-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              SUPER<span className="text-indigo-600">ADMIN</span>
            </h1>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              System Control
            </span>
          </div>
        </div>

        

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative ${
                notifOpen ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <FiBell size={20} />
            {notifications.length > 0 && (
  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
)}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-3 border-b border-slate-50 flex justify-between items-center mb-2">
                  <span className="font-black text-sm text-slate-900">System Logs</span>
                  <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Mark read</button>
                </div>
                <div className="space-y-1">
                   {notifications.length > 0 ? (
  notifications.map((req, index) => (
    <div key={index} className="p-3 hover:bg-slate-50 rounded-2xl flex gap-4 cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <FiUser size={18} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-800">
          New Admin Request: {req.first_name || "User"}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Needs approval
        </p>
      </div>
    </div>
  ))
) : (
  <div className="p-3 text-gray-400 text-sm">No new notifications</div>
)}
                </div>
                <button className="w-full mt-4 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-100 transition-all uppercase tracking-widest">
                    View All Activity
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-900 hover:bg-black transition-all group shadow-lg shadow-slate-200"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black shadow-inner">
                {user?.first_name?.charAt(0) || "S"}
              </div>
              <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">Super Admin</p>
                  <p className="text-[10px] font-bold text-indigo-300 mt-1">{user?.first_name || "Hardik"}</p>
              </div>
              <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-900">{user?.first_name} {user?.last_name || "Admin"}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email || "super@bheema.com"}</p>
                </div>

                <div className="p-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                        <FiUser /> Account Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                        <FiSettings /> Security Logs
                    </button>
                    
                    <div className="h-px bg-slate-100 my-2 mx-4" />
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-all"
                    >
                        <FiLogOut /> Logout System
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