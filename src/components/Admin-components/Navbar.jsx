import React, { useState } from "react";

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Navbar = () => {
  const [notifOpen, setNotifOpen] = useState(false); // ✅ FIX

  return (
    <div className="bg-white border-b border-slate-100 px-7 h-16 flex items-center justify-between flex-shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      
      <div>
        <h1 className="text-slate-900 text-[18px] font-extrabold">
          Dashboard
        </h1>
        <p className="text-slate-400 text-xs">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-3">
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border-[1.5px] border-slate-200 rounded-[9px] px-[14px] py-2">
          <span className="text-sm">🔍</span>
          <input
            placeholder="Search..."
            className="border-none outline-none bg-transparent text-sm text-gray-700 w-40"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-[38px] h-[38px] rounded-[9px] bg-slate-50 border-[1.5px] border-slate-200 flex items-center justify-center text-base relative"
          >
            🔔
            <div className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute top-[46px] right-0 w-[300px] bg-white border-[1.5px] border-slate-200 rounded-[14px] shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
              <div className="px-4 py-[14px] border-b border-slate-100 flex justify-between items-center">
                <p className="font-extrabold text-sm text-slate-900">
                  Notifications
                </p>
                <span className="bg-red-50 text-red-500 text-[11px] font-bold px-2 py-[2px] rounded-full">
                  3 new
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm cursor-pointer">
          Admin
        </div>
      </div>
    </div>
  );
};

export default Navbar;