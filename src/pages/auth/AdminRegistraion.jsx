import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../../features/auth/authSlice"; 
import {
  Rocket,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Building,
  Briefcase,
  User,
  Mail,
  ArrowLeft,
  MapPin,
  Factory
} from "lucide-react";

export default function AdminRegister() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = searchParams.get("role") || "teacher";
  const { isLoading, error: serverError } = useSelector((state) => state.auth);

  // Removed 'description' from state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    company_name: "",
    industry: "",
    location: ""
  });

  const [errors, setErrors] = useState({});

  const inputClass = "w-full bg-white border rounded-xl px-10 py-3 text-sm text-black placeholder-gray-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";
  const errorInputClass = "border-red-400 focus:border-red-500 focus:ring-red-100";
  
  const normalizeName = (value) => value.replace(/\s+/g, " ").trim();
  const normalizeEmail = (value) => value.trim().toLowerCase();

  const validateField = (name, value) => {
    switch (name) {
      case "first_name":
      case "last_name":
        if (!value.trim()) return "Required.";
        return "";
      case "email":
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!value.trim()) return "Email required.";
        if (!emailRegex.test(value.trim())) return "Invalid email.";
        return "";
      case "mobile":
        if (!/^\d{10}$/.test(value)) return "10 digit number required.";
        return "";
      case "company_name":
        if (role === "company" && !value.trim()) return "Company name required.";
        return "";
      case "location":
        if (role === "company" && !value.trim()) return "Location required.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      // Adjusted validation logic
      if (role === "teacher" && ["company_name", "industry", "location"].includes(key)) return;

      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await dispatch(registerAdmin({
      ...formData,
      first_name: normalizeName(formData.first_name),
      last_name: normalizeName(formData.last_name),
      email: normalizeEmail(formData.email),
      role: role,
    }));

    if (registerAdmin.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .anim-fadeup { animation: fadeUp 0.6s ease both; }
        .anim-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#F0D5A1] p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-amber-500/10 pointer-events-none" />

        <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 md:p-12 anim-fadeup relative z-10">
          
          <button onClick={() => navigate("/selectrole")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-amber-600 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Change Role
          </button>

          <div className="text-center mb-10">
            <div className="flex justify-center w-full">
              <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-900 font-black text-lg">L</div>
                <span className="text-xl font-black">Learnx</span>
              </Link>
            </div>
            <h1 className="mt-4 text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center justify-center gap-2">
              Register as {role === 'teacher' ? 'Instructor' : 'Business'} <Rocket className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Verification by Super Admin required</p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-6">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.first_name ? errorInputClass : "border-[#F0D5A1]"}`} />
                {errors.first_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.first_name}</p>}
              </div>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.last_name ? errorInputClass : "border-[#F0D5A1]"}`} />
                {errors.last_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.email ? errorInputClass : "border-[#F0D5A1]"}`} />
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email}</p>}
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.mobile ? errorInputClass : "border-[#F0D5A1]"}`} />
                {errors.mobile && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.mobile}</p>}
              </div>
            </div>

            {/* Company Specific Only */}
            {role === "corporate" && (
              <>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                  <input type="text" name="company_name" placeholder="Company Name" value={formData.company_name} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.company_name ? errorInputClass : "border-[#F0D5A1]"}`} />
                  {errors.company_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.company_name}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <Factory className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                    <input type="text" name="industry" placeholder="Industry (e.g. IT)" value={formData.industry} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.industry ? errorInputClass : "border-[#F0D5A1]"}`} />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-500" />
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} onBlur={handleBlur} className={`${inputClass} ${errors.location ? errorInputClass : "border-[#F0D5A1]"}`} />
                    {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.location}</p>}
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-[#0F172A] flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 disabled:opacity-70 hover:bg-slate-800 active:scale-95 mt-4">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 anim-spin" /> Processing...</>
              ) : (
                <>Submit Application <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}