import React, { useState, useEffect } from "react";
import { UserPlus, Shield, Loader2, Trash2, Eye, Mail, Phone, BadgeCheck } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import RegisterAdmin from "./RegisterAdmin";

export default function HandleAdmin() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/user/all-users");
            
            
            setAdmins(res.data.users || []);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                
                const res = await axiosInstance.delete(`/admin/user/remove-admin/${id}`);
                if (res.data.success) {
                    fetchAdmins();
                }
            } catch (error) {
                alert("Failed to delete admin.");
            }
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">System Administrators</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg"
                >
                    <UserPlus size={18} /> Create New Admin
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-[30px] border border-slate-100 p-4">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <th className="pb-4 pl-4">Admin Name</th>
                            <th className="pb-4">Permissions</th>
                            <th className="pb-4">Email</th>
                            <th className="pb-4">Role</th>
                            <th className="pb-4">Mobile</th>
                            <th className="pb-4">Joined Date</th>
                            <th className="pb-4 text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="py-20 text-center">
                                    <Loader2 className="animate-spin mx-auto text-indigo-600" size={30} />
                                    <p className="text-xs font-black text-slate-400 uppercase mt-4 tracking-widest">Loading...</p>
                                </td>
                            </tr>
                        ) : admins.length > 0 ? (
                            admins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-slate-50/50 transition-colors">
                                    {/* 1. Name */}
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Shield size={18} className="text-indigo-600"/>
                                            </div>
                                            <p className="text-sm font-black text-slate-800">{admin.first_name} {admin.last_name}</p>
                                        </div>
                                    </td>

                                    {/* 2. Permissions */}
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${admin.role?.toLowerCase() === 'teacher' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {admin.role?.toLowerCase() === 'super admin' ? 'Full' : 'Limited'}
                                        </span>
                                    </td>

                                    {/* 3. Email */}
                                    <td className="py-5 text-sm font-bold text-slate-500">{admin.email}</td>

                                    {/* 4. Role */}
                                    <td className="py-5">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-tighter">
                                            <BadgeCheck size={14} className="text-indigo-400" />
                                            {admin.role}
                                        </div>
                                    </td>

                                    {/* 5. Mobile */}
                                    <td className="py-5 text-sm font-bold text-slate-500">{admin.mobile || 'N/A'}</td>

                                    {/* 6. Joined Date */}
                                    <td className="py-5 text-sm font-bold text-slate-500">
                                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN') : 'N/A'}
                                    </td>

                                    {/* 7. Actions */}
                                    <td className="py-5 text-right pr-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setSelectedAdmin(admin)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Eye size={18}/></button>
                                            <button onClick={() => handleDelete(admin.id, admin.first_name)} className="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="py-10 text-center text-slate-400 font-bold text-sm italic">No data found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <RegisterAdmin isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchAdmins} />

            {/* View Details Modal */}
            {selectedAdmin && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 border border-slate-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Shield size={32} /></div>
                            <h4 className="text-xl font-black text-slate-800">{selectedAdmin.first_name} {selectedAdmin.last_name}</h4>
                            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{selectedAdmin.role}</p>
                        </div>
                        <div className="space-y-4 mb-8 text-left">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"><Mail size={18} className="text-slate-400" /><span className="text-sm font-bold text-slate-600">{selectedAdmin.email}</span></div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"><Phone size={18} className="text-slate-400" /><span className="text-sm font-bold text-slate-600">{selectedAdmin.mobile || 'N/A'}</span></div>
                        </div>
                        <button onClick={() => setSelectedAdmin(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs">Close Details</button>
                    </div>
                </div>
            )}
        </div>
    );
}