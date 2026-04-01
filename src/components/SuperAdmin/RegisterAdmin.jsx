import React, { useState, useMemo } from "react";
import { X, Mail, Lock, User, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff, Phone, ChevronDown, Briefcase } from "lucide-react";
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

export default function RegisterAdmin({ isOpen, onClose, onRefresh }) {
    const initialState = { 
        first_name: "", last_name: "", mobile: "", description: "", email: "", password: "", role: "" 
    };
    
    const [formData, setFormData] = useState(initialState);
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validations = useMemo(() => ({
        first_name: formData.first_name.trim().length >= 3,
        last_name: formData.last_name.trim().length >= 3,
        mobile: formData.mobile.trim().length >= 10,
        description: formData.description.trim().length >= 10,
        role: ["teacher", "company"].includes(formData.role.toLowerCase()), 
        email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email),
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password),
    }), [formData]);

    const isFormValid = Object.values(validations).every(Boolean);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setLoading(true);
        setError("");
        const loadToast = toast.loading("Creating secure account...", toastStyle('#4F46E5'));

        try {
            const res = await axiosInstance.post("/admin/user/add_admin", formData);
            if (res.data.success) {
                toast.success("Account created successfully!", { id: loadToast, ...toastStyle('#4F46E5') });
                onRefresh();
                onClose();
                setFormData(initialState);
                setTouched({});
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed.";
            setError(msg);
            toast.error(msg, { id: loadToast, ...toastStyle('#E11D48') });
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (field) => touched[field] && !validations[field];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black flex items-center gap-2"><ShieldCheck className="text-indigo-400" /> New Admin</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Identity Management</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4" noValidate>
                    {error && (
                        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black p-4 rounded-2xl uppercase tracking-wide">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                            <div className="relative">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('first_name') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} onBlur={handleBlur} placeholder="Hardik"
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('first_name') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            </div>
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} onBlur={handleBlur} placeholder="Gurjar"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all ${getFieldError('last_name') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                            <div className="relative">
                                <Briefcase className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('role') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-10 text-sm font-bold outline-none transition-all appearance-none cursor-pointer ${getFieldError('role') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`}
                                >
                                    <option value="" disabled>Please select role</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="company">Company</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                            <div className="relative">
                                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('mobile') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} placeholder="1234567890"
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('mobile') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <div className="relative">
                            <input type="text" name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} placeholder="Describe the role or permissions"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all ${getFieldError('description') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('email') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="admin@gmail.com"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('email') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('password') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-12 text-sm font-bold outline-none transition-all ${getFieldError('password') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button disabled={loading || !isFormValid} type="submit"
                            className={`w-full py-5 rounded-[22px] font-black transition-all active:scale-[0.98] ${isFormValid ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}