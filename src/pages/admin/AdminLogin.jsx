import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import { loginUser } from "../../features/auth/authSlice"; 
import { Eye, EyeOff, AlertCircle, Lock, Loader2, GraduationCap } from "lucide-react";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const { isLoading, error: serverError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);

  
  const validations = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return {
      email: emailRegex.test(formData.email),
      password: passwordRegex.test(formData.password),
    };
  }, [formData]);

  const isFormValid = validations.email && validations.password;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({
    email: true,
    password: true,
  });
  const emailError = validateField("email", formData.email);
  const passwordError = validateField("password", formData.password);
  if (emailError || passwordError) return;
  const result = await dispatch(loginUser({ 
    credentials: {
      email: formData.email.trim(),
      password: formData.password
    }, 
    role: 'teacher'
  }));

  if (loginUser.fulfilled.match(result)) {
    const role = result.payload.user?.role?.toLowerCase().replace(/\s+/g, "");
    if (role === "student") {
      navigate("/user/dashboard", { replace: true });
    } else if (role === "superadmin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (role === "teacher") {
      navigate("/teacher/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
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
          {/* Error Message from Redux Store */}
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
                <p className="text-[9px] text-rose-500 font-black uppercase ml-1">Valid @gmail.com required</p>
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
                  Must be 8+ chars with uppercase, number & symbol
                </p>
              )}
            </div>

            <button 
              type="submit"
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