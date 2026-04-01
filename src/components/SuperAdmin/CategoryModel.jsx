import React, { useState } from "react";
import { X, LayoutGrid, Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";

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

export default function CategoryModal({ isOpen, onClose, onRefresh }) {
    const [categoryName, setCategoryName] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            setPreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleClose = () => {
        setCategoryName(""); setIconFile(null); setPreview(null); setError("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (categoryName.length < 3) return setError("Name is too short");
        if (!iconFile) return setError("Please upload an icon");

        setLoading(true);
        setError("");

        try {
            const data = new FormData();
            data.append("name", categoryName);
            data.append("icon", iconFile);

            const res = await axiosInstance.post("/category/add", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success(`Category "${categoryName}" added!`, toastStyle('#4F46E5'));
                onRefresh();
                handleClose();
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to add category";
            setError(msg);
            toast.error(msg, toastStyle('#E11D48'));
        } finally {
            setLoading(false);
        }
    };

    const isInvalid = loading || categoryName.length < 3 || !iconFile;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-violet-600 p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black flex items-center gap-2"><LayoutGrid /> New Category</h3>
                        <p className="text-violet-200 text-[10px] font-bold uppercase tracking-widest mt-1">Classification System</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black p-4 rounded-2xl uppercase tracking-wide">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer w-24 h-24 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden group-hover:border-violet-400">
                            {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="text-slate-300" size={32} />}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Icon</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                        <input required type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Cloud Computing" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-violet-500/10 transition-all" />
                    </div>

                    <button disabled={isInvalid} type="submit" className={`w-full py-5 rounded-[22px] font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${!isInvalid ? 'bg-violet-600 text-white shadow-violet-100 hover:bg-violet-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                        {loading ? "Saving..." : "Save Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}