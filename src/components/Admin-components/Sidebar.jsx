import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAV_ITEMS } from "./dashboardData";
const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, adminLogout } = useAuth();

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-[#0F172A] text-[#94A3B8] h-screen fixed left-0 top-0 transition-all duration-300 z-50 flex flex-col border-r border-[#1E293B]`}>
      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94A3B8 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }} />

      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3 relative overflow-hidden">
        <div className="w-9 h-9 min-w-[36px] rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/20">L</div>
        {!collapsed && <span className="text-white font-bold text-xl tracking-tight">LearnX <span className="text-[10px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded ml-1 uppercase">Admin</span></span>}
      </div>

   
<nav className={`flex-1 px-3 space-y-1 mt-4 overflow-y-auto 
  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
  {NAV_ITEMS.map((item) => {
    const active = location.pathname === item.path;
    return (
      <div
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg group ${
          active ? "bg-violet-600/10 text-white border-l-4 border-violet-500" : "hover:bg-white/5 hover:text-white border-l-4 border-transparent"
        } ${collapsed ? "justify-center px-0 border-l-0" : ""}`}
      >
        <span className="text-xl"><item.icon/></span>
        {!collapsed && <span className="font-medium text-[14.5px]">{item.label}</span>}
      </div>
    );
  })}
</nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]/50">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0) || "A"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] truncate opacity-60">{user?.email || "admin@learnx.com"}</p>
            </div>
          </div>
        )}
        <button 
          onClick={adminLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-semibold text-sm"
        >
          🚪 {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;