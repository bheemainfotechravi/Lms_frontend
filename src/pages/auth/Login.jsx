import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Presentation
} from "lucide-react";
import loginImg from "../../assets/login-images/login.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const ROLES = [
  { id: "student", label: "Student", icon: <Sparkles size={14} /> },
  { id: "teacher", label: "Instructor", icon: <Presentation size={14} /> },
  { id: "corporate", label: "Corporate", icon: <Briefcase size={14} /> },
  { id: "superadmin", label: "Admin", icon: <ShieldCheck size={14} /> },
];

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error: serverError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", 
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    switch (name) {
      case "email":
        if (!trimmedValue) return "Email is required.";
        if (!EMAIL_REGEX.test(trimmedValue)) return "Enter a valid email.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Min 6 characters required.";
        return "";
      default:
        return "";
    }
  };

  const errors = useMemo(() => ({
    email: validateField("email", formData.email),
    password: validateField("password", formData.password),
  }), [formData]);

  const isFormValid = !errors.email && !errors.password;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({ email: true, password: true });

  if (!isFormValid) return;

  const result = await dispatch(loginUser({ 
    credentials: {
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role 
    }, 
    role: formData.role 
  }));

  if (loginUser.fulfilled.match(result)) {
 

    const rawRole = result.payload.user?.role || result.payload.user?.role_name || "";
    const userRole = rawRole.toLowerCase().replace(/\s+/g, "").trim();
    const dashboardMap = {
      student: "/user/dashboard",
      superadmin: "/superadmin/dashboard",
      teacher: "/admin/dashboard",
      corporate: "/company/dashboard", 
    };

    const targetPath = dashboardMap[userRole];

    if (targetPath) {
      navigate(targetPath, { replace: true }); 
    } else {
      toast.error("Dashboard mapping failed. Check console.");
    }
  }
};
  const baseInputClass = "w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:ring-2";

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .anim-fadeup { animation: fadeUp 0.6s ease both; }
        .anim-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen flex relative overflow-hidden bg-[#F0D5A1]">
        {/* Decorative Blobs (Same as before) */}
        <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-16 py-20 relative">
          <div className="absolute top-8 left-10 flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl bg-amber-500">L</div>
            <span className="text-xl font-black text-slate-900">LearnX</span>
          </div>
          <div className="max-w-sm w-full text-center">
            <div className="bg-white/30 rounded-2xl p-7 border border-violet-100 mb-6 anim-float shadow-xl">
              <div className="text-left mb-4">
                <p className="text-gray-900 font-black text-md">Welcome Back!</p>
                <p className="text-gray-400 text-sm mt-0.5">Continue your learning journey</p>
              </div>
              <img src={loginImg} alt="login illustration" />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-[768px] shrink-0 bg-white flex flex-col justify-center px-10 py-12 relative z-10 min-h-screen shadow-2xl">
          <div className="anim-fadeup max-w-md mx-auto w-full">
            <Link to="/" className="flex items-center gap-2 mb-9">
              <span className="text-2xl text-[#de950c] font-extrabold">LearnX</span>
            </Link>

            <h1 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
              Sign In <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-slate-500 text-sm mb-8">Access your personalized dashboard.</p>

            {serverError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-black rounded-xl px-4 py-3 mb-5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              
              {/* --- NEW ROLE SELECTION RADIO BUTTONS --- */}
              <div className="space-y-3 mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Identity</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLES.map((r) => (
                    <label 
                      key={r.id} 
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.role === r.id 
                        ? "border-amber-500 bg-amber-50 text-amber-700 font-bold" 
                        : "border-slate-100 bg-slate-50 text-slate-400 grayscale hover:grayscale-0 hover:border-slate-200"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="role" 
                        value={r.id} 
                        checked={formData.role === r.id} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      {r.icon}
                      <span className="text-[10px] uppercase tracking-tighter">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => setTouched({...touched, email: true})}
                  className={`${baseInputClass} border-black ${touched.email && errors.email ? "border-red-400" : "border-slate-200"}`}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Password</label>
                <Link to="/recoverpassword" className="text-left block text-[10px] font-black uppercase tracking-widest ml-1 mb-1.5">Forgot Password?</Link>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={(e) => setTouched({...touched, password: true})}
                    className={`${baseInputClass} border-black pr-12 ${touched.password && errors.password ? "border-red-400" : "border-slate-200"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 anim-spin" /> Authenticating...</>
                ) : (
                  <>Enter Control Center <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 mt-8 text-[10px] font-bold uppercase tracking-widest">
              Need an account? <Link to="/selectrole" className="text-amber-600 hover:underline ml-1">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}