import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { Eye, EyeOff, AlertCircle, Lock, Loader2, GraduationCap } from "lucide-react";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // --- Professional Validation Logic ---
  const validations = useMemo(() => {
    // Sirf @gmail.com allow karega
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    // Min 8 char, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return {
      email: emailRegex.test(formData.email),
      password: passwordRegex.test(formData.password),
    };
  }, [formData]);

  const isFormValid = validations.email && validations.password;

  const handleChange = (e) => {
    setServerError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

const handleSubmit = async (e) => {
  if (e) e.preventDefault(); 
  if (!isFormValid || isLoading) return;

  setIsLoading(true);
  setServerError("");

  try {
    const res = await axiosInstance.post("/user/admin_login", formData);
    
    // Safety check for response data
    const responseData = res.data?.data || res.data;

    if (res.data.success && responseData?.user && responseData?.token) {
      login(responseData.user, responseData.token);
      navigate("/admin/dashboard");
    } else {
      // Agar success true hai par data nahi aaya
      setServerError("Unexpected response from server.");
    }
  } catch (err) {
    // YAHAN STOP KARO REFRESH
    console.error("Login Error Details:", err.response?.data);
    
    // Agar API error message bhej rahi hai toh wo dikhao, varna default
    const errorMsg = err.response?.data?.message || "Invalid Email or Password";
    setServerError(errorMsg);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Staff Portal</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 text-center">Academic Administration</p>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100">
          {/* Server Error Message */}
          {serverError && (
            <div className="flex items-center gap-3 bg-rose-50 text-rose-600 text-[11px] font-black p-4 rounded-2xl mb-6 uppercase animate-shake">
              <AlertCircle size={16} /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Official Gmail</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-slate-50 border rounded-2xl py-4 px-6 text-sm font-bold outline-none transition-all ${
                  touched.email && !validations.email 
                  ? 'border-rose-500 ring-4 ring-rose-500/10' 
                  : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'
                }`} 
                placeholder="name@gmail.com"
              />
              {touched.email && !validations.email && (
                <p className="text-[9px] text-rose-500 font-black uppercase ml-1">Please enter a valid @gmail.com address</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-slate-50 border rounded-2xl py-4 px-6 pr-12 text-sm font-bold outline-none transition-all ${
                    touched.password && !validations.password 
                    ? 'border-rose-500 ring-4 ring-rose-500/10' 
                    : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'
                  }`} 
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && !validations.password && (
                <p className="text-[9px] text-rose-500 font-black uppercase ml-1 leading-tight">
                  password must be at least 8 characters
                </p>
              )}
            </div>

            <button 
              disabled={isLoading || !isFormValid} 
              className={`w-full py-5 rounded-[22px] font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isFormValid 
                ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"} <Lock size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}