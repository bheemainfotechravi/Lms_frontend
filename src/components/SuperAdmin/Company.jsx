import React from "react";
import { Building, Plus, MapPin } from "lucide-react";

export default function HandleCompany() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">Registered Companies</h3>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-black transition shadow-lg">
                    <Plus size={18} /> Register Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Example Card */}
                <div className="p-6 border border-slate-100 rounded-[30px] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                            <Building className="text-slate-600" size={24} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">Active Client</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800">Bheema Info Solutions</h4>
                    <div className="flex items-center gap-2 text-slate-400 mt-1 mb-6 font-medium text-sm">
                        <MapPin size={14} /> Bhopal, MP
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
                        <div className="text-xs font-bold text-slate-500">12 Active Courses</div>
                        <button className="text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:underline">Manage Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}