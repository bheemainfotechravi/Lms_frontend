import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, Building2, LayoutDashboard } from "lucide-react";
import HandleAdmin from "./HandleAdmin";
import TopNavbar from "./Navbar";
import SCards from "./SCards";
import HandleCategory from "./Handlecategories";

export default function SuperAdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar user={user} today={today} />

      <main className="p-8 max-w-[1600px] mx-auto">
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-40 bg-slate-200 rounded-[40px] animate-pulse" />
            <div className="grid grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 items-center bg-white p-2 rounded-[25px] border border-slate-200 w-fit shadow-sm">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-sm transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <LayoutDashboard size={18} /> Overview
              </button>
              <button 
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-sm transition-all ${activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <ShieldCheck size={18} /> Handle Admin
              </button>
              <button 
                onClick={() => setActiveTab("company")}
                className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-sm transition-all ${activeTab === 'company' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Building2 size={18} /> Handle Category
              </button>
            </div>

            <div className="transition-all duration-300">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  {/* Props pass kiya setActiveTab */}
                  <SCards onTabChange={setActiveTab} />
                  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 font-bold">Select a module from above to manage the system.</p>
                  </div>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <HandleAdmin />
                </div>
              )}

              {activeTab === "company" && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <HandleCategory />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}