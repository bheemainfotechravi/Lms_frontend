import React, { useState, useEffect } from "react";
import { LayoutGrid, Plus, Loader2, Trash2 } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import CategoryModal from "./categoryModel";

export default function HandleCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingSlug, setDeletingSlug] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/category/get");
            setCategories(res.data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleDelete = async (slug, name) => {
        if (!window.confirm(`Are you sure you want to delete the "${name}" category?`)) return;

        try {
            setDeletingSlug(slug);
            const res = await axiosInstance.delete(`/admin/category/delete/${slug}`);
            
            if (res.data.success) {
                
                setCategories((prev) => prev.filter((cat) => cat.slug !== slug));
                alert("Category deleted successfully");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert(error.response?.data?.message || "Failed to delete category");
        } finally {
            setDeletingSlug(null);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-800">Course Categories</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Organize your curriculum</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-violet-700 transition shadow-lg active:scale-95"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Grid Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-violet-600 mb-4" size={40} />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-tighter">Loading Categories...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.id || cat.slug} className="p-6 border border-slate-100 rounded-[30px] bg-violet-100 hover:bg-white hover:shadow-xl transition-all group flex flex-col items-center text-center relative">
                                
                               <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform overflow-hidden p-6">
    {cat.icon ? (
        <img 
            src={cat.icon} 
            alt={cat.name} 
            className="w-full h-full object-contain" 
        />
    ) : (
        <LayoutGrid className="text-slate-300" size={32} />
    )}
</div>

                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{cat.name}</h4>
                                
                                {/* Delete Button */}
                                <button 
                                    disabled={deletingSlug === cat.slug}
                                    onClick={() => handleDelete(cat.slug, cat.name)}
                                    className="mt-4 text-rose-500 bg-rose-50 p-2 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {deletingSlug === cat.slug ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold text-sm italic">No categories found. Add one to get started!</p>
                        </div>
                    )}
                </div>
            )}

            <CategoryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchCategories} 
            />
        </div>
    );
}