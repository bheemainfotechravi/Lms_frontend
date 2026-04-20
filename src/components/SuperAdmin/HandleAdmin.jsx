import React, { useState, useEffect } from "react";
import { UserPlus, Eye, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import AdminRequestModal from "./AdminsRequest"; 
import { IoCloseSharp } from "react-icons/io5";

export default function HandleAdmin() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
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

    const fetchPendingRequests = async () => {
        try {
            const res = await axiosInstance.get("/admin/get_userReqs");
            const allRequests = res.data.message?.requests || [];
            setPendingRequests(allRequests);

            if (allRequests.length > 0) {
                setIsRequestModalOpen(true);
            } else {
                toast.success("No pending verification requests", toastStyle('#4F46E5'));
            }
        } catch (error) {
            toast.error("Error fetching requests", toastStyle('#E11D48'));
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/user/all_users");
            setAdmins(res.data.message.users || []);
        } catch (error) {
            toast.error("Failed to sync administrator list", toastStyle('#E11D48'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">System Administrators</h3>
                <button 
                    onClick={fetchPendingRequests}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg active:scale-95"
                >
                    <UserPlus size={18} /> Handle Verification Request
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-[30px] border border-slate-100 p-4">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <th className="pb-4 pl-4">Admin Name</th>
                            <th className="pb-4">Email</th>
                            <th className="pb-4">Role</th>
                            <th className="pb-4 text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id} className="border-b border-slate-50">
                                <td className="py-4 pl-4 font-bold">{admin.first_name} {admin.last_name}</td>
                                <td className="py-4">{admin.email}</td>
                                <td className="py-4 uppercase text-[10px] font-black">{admin.role}</td>
                                <td className="py-4 text-right pr-4">
                                    <button onClick={() => setSelectedAdmin(admin)} className="p-2 hover:text-indigo-600"><Eye size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isRequestModalOpen && pendingRequests.length > 0 && (
                <AdminRequestModal 
                    requests={pendingRequests} 
                    onClose={() => setIsRequestModalOpen(false)}
                    onRefresh={() => {
                        fetchAdmins(); 
                        fetchPendingRequests(); 
                    }}
                />
            )}

            {/* Admin Details Modal */}
            {selectedAdmin && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                   <div className="bg-white p-8 rounded-[40px] max-w-md w-full relative">
                        <button onClick={() => setSelectedAdmin(null)} className="absolute top-6 right-6"><IoCloseSharp size={25} /></button>
                        <h2 className="text-xl font-black mb-4">{selectedAdmin.first_name}'s Details</h2>
                        <p className="text-sm text-slate-500 mb-6">Email: {selectedAdmin.email}</p>
                        <p className="text-sm text-slate-500 mb-6">Contact: {selectedAdmin.mobile}</p>
                        <p className="text-sm text-slate-500 mb-6">Role: {selectedAdmin.role}</p>
                        <p className="text-sm text-slate-500 mb-6">Access Allowed: {selectedAdmin.role_description}</p>
                        <button onClick={() => setSelectedAdmin(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Close</button>
                   </div>
                </div>
            )}
        </div>
    );
}