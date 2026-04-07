import React, { useState, useMemo } from "react";
import { X, Mail, Lock, User, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff, Phone, ChevronDown, Briefcase, Building2, MapPin, Factory } from "lucide-react";
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
        first_name: "", last_name: "", phone: "", description: "", 
        email: "", password: "", role: "teacher", 
        company_name: "", industry: "", location: "" 
    };
    
    const [formData, setFormData] = useState(initialState);
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validations = useMemo(() => {
        const baseValidations = {
            first_name: formData.first_name.trim().length >= 3,
            last_name: formData.last_name.trim().length >= 3,
            phone: formData.phone.trim().length >= 10,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email),
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password),
        };

        if (formData.role === "company") {
            return {
                ...baseValidations,
                company_name: formData.company_name.trim().length >= 3,
                industry: formData.industry.trim().length >= 2,
                location: formData.location.trim().length >= 3,
            };
        }

        return baseValidations;
    }, [formData]);

    const isFormValid = Object.values(validations).every(Boolean);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setError("");
    const loadToast = toast.loading(`Registering ${formData.role}...`, toastStyle('#4F46E5'));

    try {
        const isCompany = formData.role === "company";
        const targetRoute = isCompany 
            ? "/admin/company/register_company" 
            : "/admin/user/add_admin";

        // --- DYNAMIC PAYLOAD MAPPING ---
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            description: isCompany ? "Company Profile" : "Teacher Profile"
        };

        if (isCompany) {
            // Company ke liye 'phone' bhejo
            payload.phone = formData.phone; 
            payload.company_name = formData.company_name;
            payload.industry = formData.industry;
            payload.location = formData.location;
        } else {
            // Teacher ke liye 'mobile' bhejo
            payload.mobile = formData.phone; // Humne state mein 'phone' rakha hai, usey 'mobile' bana ke bhejenge
        }

        const res = await axiosInstance.post(targetRoute, payload);

        if (res.data.success) {
            toast.success("Account created successfully!", { id: loadToast, ...toastStyle('#4F46E5') });
            onRefresh();
            onClose();
            setFormData(initialState);
            setTouched({});
        }
    } catch (err) {
        const msg = err.response?.data?.message || 
                    (err.response?.data?.errors ? err.response.data.errors[0] : "Registration failed.");
        
        setError(msg);
        toast.error(msg, { id: loadToast, ...toastStyle('#E11D48') });
    } finally {
        setLoading(false);
    }
};

    const getFieldError = (field) => touched[field] && !validations[field];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h3 className="text-2xl font-black flex items-center gap-2">
                            <ShieldCheck className="text-indigo-400" /> 
                            Register {formData.role === 'teacher' ? 'Academic Staff' : 'Corporate Partner'}
                        </h3>
                        <div className="flex gap-4 mt-3">
                            <button 
                                type="button"
                                onClick={() => setFormData({...initialState, role: 'teacher'})}
                                className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${formData.role === 'teacher' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                Faculty / Admin
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...initialState, role: 'company'})}
                                className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all ${formData.role === 'company' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                Enterprise / Company
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
                    {error && (
                        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black p-4 rounded-2xl uppercase tracking-wide">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {formData.role === "company" && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                                <div className="relative">
                                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('company_name') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                    <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} onBlur={handleBlur} placeholder="InfoKodeders pvt ltd"
                                        className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('company_name') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
                                    <div className="relative">
                                        <Factory className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('industry') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} onBlur={handleBlur} placeholder="IT/Tech"
                                            className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('industry') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                                    </div>
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('location') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} placeholder="Indore"
                                            className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('location') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-slate-100 my-2"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{formData.role === 'company' ? 'Primary Contact' : 'First Name'}</label>
                            <div className="relative">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('first_name') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} onBlur={handleBlur} placeholder="Sooraj"
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('first_name') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            </div>
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} onBlur={handleBlur} placeholder="Patidar"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all ${getFieldError('last_name') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('email') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="suraj@example.com"
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('email') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            </div>
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile No.</label>
                            <div className="relative">
                                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('phone') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="9144173687"
                                    className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all ${getFieldError('phone') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${getFieldError('password') ? 'text-rose-500' : 'text-slate-300'}`} size={18} />
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••"
                                className={`w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-12 text-sm font-bold outline-none transition-all ${getFieldError('password') ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button disabled={loading || !isFormValid} type="submit"
                            className={`w-full py-5 rounded-[22px] font-black transition-all active:scale-[0.98] ${isFormValid ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : `Provision ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}