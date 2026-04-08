import React, { useState } from "react";
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings, 
  Building2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";




 

export default function CompanyNavbar() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();


 const handleLogout = async () => {
    try {
      await logout(); 
      setIsProfileOpen(false); 
      navigate("/company/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-[100] bg-black border-b border-slate-800 px-4 py-3 md:px-8 shadow-2xl">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
       
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Building2 size={20} className="text-white md:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-black text-white uppercase tracking-tighter leading-none">
              {user?.company_name || "Corporate Hub"}
            </span>
            <span className="text-[8px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
              Admin Portal
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 md:p-3 hover:bg-slate-800 rounded-xl relative text-slate-400 hover:text-indigo-400 transition-all">
            <Bell size={18} className="md:scale-110" />
            <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1" />

        
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl transition-all hover:bg-slate-800 border border-transparent"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-black text-xs md:text-sm uppercase">
                {user?.first_name?.charAt(0) || "C"}
              </div>
              
             
              <div className="hidden sm:block text-left">
                <p className="text-[10px] md:text-[11px] font-black text-white uppercase leading-none">
                  {user?.first_name || "Manager"}
                </p>
                <ChevronDown size={12} className={`text-slate-500 mt-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)}></div>
                
                <div className="absolute right-0 mt-3 w-52 md:w-60 bg-slate-800 border border-slate-700 rounded-[24px] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 mb-1 border-b border-slate-700/50">
                     <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Account Settings</p>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 rounded-xl text-slate-300 transition-colors group">
                    <User size={16} className="group-hover:text-indigo-400" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">Profile</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 rounded-xl text-slate-300 transition-colors group">
                    <Settings size={16} className="group-hover:text-indigo-400" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight">Settings</span>
                  </button>

                  <div className="h-[1px] bg-slate-700/50 my-1" />

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-500/10 rounded-xl text-rose-400 transition-colors group"
                  >
                    <LogOut size={16} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}