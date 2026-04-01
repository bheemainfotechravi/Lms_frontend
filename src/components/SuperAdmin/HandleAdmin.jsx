import React, { useState, useEffect } from "react";
import { UserPlus, Shield, Loader2, Trash2, Eye, Mail, Phone, BadgeCheck, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import RegisterAdmin from "./RegisterAdmin";
import toast from "react-hot-toast";

export default function HandleAdmin() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    
    const toastStyle = (color) => ({
        style: {
            borderLeft: `6px solid ${color}`,
            padding: '16px 24px',
            color: '#1E293B',
            fontWeight: '700',
            borderRadius: '24px',
            background: '#fff',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
        iconTheme: { primary: color, secondary: '#fff' },
    });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/user/all-users");
            setAdmins(res.data.users || []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to sync administrator list", toastStyle('#E11D48'));
        } finally {
            setLoading(false);
        }
    };

    
    const confirmDelete = (id, name) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-rose-500" size={20} />
                    <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                        Remove {name}?
                    </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    This admin will lose all system access immediately.
                </p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeDelete(id);
                        }}
                        className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                    >
                        Confirm Revoke
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center', style: { borderRadius: '28px', padding: '20px' } });
    };

    const executeDelete = async (id) => {
        const loadToast = toast.loading("Revoking permissions...", toastStyle('#F59E0B'));
        try {
            const res = await axiosInstance.delete(`/admin/user/remove-admin/${id}`);
            if (res.data.success) {
                toast.success("Admin access revoked successfully", { id: loadToast, ...toastStyle('#4F46E5') });
                fetchAdmins();
            }
        } catch (error) {
            toast.error("Failed to remove administrator", { id: loadToast, ...toastStyle('#E11D48') });
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">System Administrators</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg active:scale-95"
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
                                    <p className="text-xs font-black text-slate-400 uppercase mt-4 tracking-widest">Syncing Identity Data...</p>
                                </td>
                            </tr>
                        ) : admins.length > 0 ? (
                            admins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Shield size={18} className="text-indigo-600"/>
                                            </div>
                                            <p className="text-sm font-black text-slate-800">{admin.first_name} {admin.last_name}</p>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${admin.role?.toLowerCase() === 'teacher' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {admin.role?.toLowerCase().includes('super') ? 'Full' : 'Limited'}
                                        </span>
                                    </td>
                                    <td className="py-5 text-sm font-bold text-slate-500">{admin.email}</td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-tighter">
                                            <BadgeCheck size={14} className="text-indigo-400" />
                                            {admin.role}
                                        </div>
                                    </td>
                                    <td className="py-5 text-sm font-bold text-slate-500">{admin.mobile || 'N/A'}</td>
                                    <td className="py-5 text-sm font-bold text-slate-500">
                                        {admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN') : 'N/A'}
                                    </td>
                                    <td className="py-5 text-right pr-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setSelectedAdmin(admin)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"><Eye size={18}/></button>
                                            <button onClick={() => confirmDelete(admin.id, admin.first_name)} className="p-2 text-slate-400 hover:text-rose-600 transition-all active:scale-90"><Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="py-10 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">No administrators registered.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <RegisterAdmin isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchAdmins} />

            {selectedAdmin && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 border border-slate-100">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Shield size={32} /></div>
                            <h4 className="text-xl font-black text-slate-800">{selectedAdmin.first_name} {selectedAdmin.last_name}</h4>
                            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{selectedAdmin.role}</p>
                        </div>
                        <div className="space-y-4 mb-8 text-left">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <Mail size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">{selectedAdmin.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                <Phone size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">{selectedAdmin.mobile || 'Private Contact'}</span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedAdmin(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95">Close Details</button>
                    </div>
                </div>
            )}
        </div>
    );
}