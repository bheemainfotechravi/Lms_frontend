import React from "react";
import { UserPlus, MoreVertical, Shield } from "lucide-react";

export default function HandleAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">System Administrators</h3>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                    <UserPlus size={18} /> Create New Admin
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <th className="pb-4">Admin Name</th>
                            <th className="pb-4">Permissions</th>
                            <th className="pb-4">Last Activity</th>
                            <th className="pb-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {/* Example Row */}
                        <tr className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><Shield size={18} className="text-indigo-600"/></div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">Hardik Admin</p>
                                        <p className="text-xs text-slate-400 font-medium">hardik@bheema.com</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5">
                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase">Full Access</span>
                            </td>
                            <td className="py-5 text-sm font-bold text-slate-500">2 mins ago</td>
                            <td className="py-5 text-right"><button className="text-slate-300 hover:text-slate-900"><MoreVertical size={20}/></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}