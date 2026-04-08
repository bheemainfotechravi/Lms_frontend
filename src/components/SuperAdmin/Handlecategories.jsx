import React, { useState, useEffect } from "react";
import { LayoutGrid, Plus, Loader2, Trash2, Calendar, Link2, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import CategoryModal from "./CategoryModel";
import toast from "react-hot-toast";

export default function HandleCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingSlug, setDeletingSlug] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    
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

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/category/get");
            setCategories(res.data.categories || []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Could not sync categories", toastStyle('#E11D48'));
        } finally {
            setLoading(false);
        }
    };

    
    const confirmDelete = (slug, name) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <AlertCircle className="text-rose-500" size={20} />
                    <span className="font-bold text-slate-800 text-sm uppercase tracking-tight">
                        Delete "{name}"?
                    </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    This action is irreversible.
                </p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeDelete(slug);
                        }}
                        className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                    >
                        Confirm Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000, position: 'top-center', style: { borderRadius: '28px', padding: '20px' } });
    };

    const executeDelete = async (slug) => {
        const loadToast = toast.loading("Executing delete...", toastStyle('#F59E0B'));
        try {
            setDeletingSlug(slug);
            const res = await axiosInstance.delete(`/admin/category/delete/${slug}`);
            if (res.data.success) {
                setCategories((prev) => prev.filter((cat) => cat.slug !== slug));
                toast.success("Category wiped from server", { id: loadToast, ...toastStyle('#4F46E5') });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed", { id: loadToast, ...toastStyle('#E11D48') });
        } finally {
            setDeletingSlug(null);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Course Categories</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage curriculum structure</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-violet-700 transition shadow-lg shadow-violet-100 active:scale-95"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-8 py-6">Icon & Name</th>
                                <th className="px-6 py-6 text-center">Slug / identifier</th>
                                <th className="px-6 py-6 text-center">Created Date</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <Loader2 className="animate-spin text-violet-600 mx-auto" size={32} />
                                        <p className="text-xs font-black text-slate-400 uppercase mt-4 tracking-widest">Syncing with Cloud...</p>
                                    </td>
                                </tr>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr key={cat.slug} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden p-2 group-hover:bg-white transition-colors">
                                                    {cat.icon ? (
                                                        <img src={cat.icon} alt="" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <LayoutGrid size={20} className="text-slate-200" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px]">
                                                <Link2 size={12} className="text-violet-300" />
                                                <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 tracking-tight">{cat.slug}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-tighter">
                                                <Calendar size={12} className="text-slate-300" />
                                                {new Date(cat.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>

                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                disabled={deletingSlug === cat.slug}
                                                onClick={() => confirmDelete(cat.slug, cat.name)}
                                                className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all disabled:opacity-50 active:scale-90"
                                            >
                                                {deletingSlug === cat.slug ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center">
                                        <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <LayoutGrid size={24} className="text-slate-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No categories in database</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CategoryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchCategories} 
            />
        </div>
    );
}