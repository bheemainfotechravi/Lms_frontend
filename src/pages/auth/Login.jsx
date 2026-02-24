import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");

  // const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      // 🔌 Replace this with your real API call
      // const res = await authService.login(formData);
      // login(res.user, res.token);
      const res = await axiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      
      console.log(res.data, res.token)
      navigate("/user/dashboard", { replace: true });

    } catch (err) {
      console.log(err)
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10";

  const STATS = [
    { label: "Courses Completed", value: "12",   icon: "✅", valueClass: "text-emerald-500", bg: "bg-emerald-50"  },
    { label: "Hours Learned",     value: "148h", icon: "🕐", valueClass: "text-primary",     bg: "bg-violet-50"   },
    { label: "Certificates Earned",value: "5",   icon: "🏆", valueClass: "text-amber-500",   bg: "bg-amber-50"    },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .anim-fadeup { animation: fadeUp 0.6s ease both; }
        .anim-float  { animation: float 4s ease-in-out infinite; }
        .anim-spin   { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen flex relative overflow-hidden"
        style={{ background: "linear-gradient(155deg, #ffffff 0%, #F5F3FF 50%, #ECFEFF 100%)" }}>

        {/* Background blobs */}
        <div className="absolute top-[5%] right-[10%] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[5%] left-[5%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-16 py-20 relative">

          {/* Logo */}
          <div className="absolute top-8 left-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-base">L</div>
            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LearnX</span>
          </div>

          <div className="max-w-sm w-full text-center">

            {/* Floating Stats Card */}
            <div className="bg-white rounded-2xl p-7 border border-violet-100 mb-6 anim-float"
              style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.12)" }}>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shrink-0">
                  🎓
                </div>
                <div className="text-left">
                  <p className="text-gray-900 font-black text-sm">Welcome Back!</p>
                  <p className="text-gray-400 text-xs mt-0.5">Continue your learning journey</p>
                </div>
              </div>

              {STATS.map((stat, i) => (
                <div key={i} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${stat.bg} ${i < 2 ? "mb-2" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{stat.icon}</span>
                    <span className="text-gray-700 text-xs font-semibold">{stat.label}</span>
                  </div>
                  <span className={`text-sm font-black ${stat.valueClass}`}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Mini */}
            <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 flex items-center gap-3.5 text-left shadow-sm">
              <div className="w-11 h-11 rounded-full bg-violet-100 border-2 border-primary flex items-center justify-center text-primary font-black text-xs shrink-0">
                AV
              </div>
              <div>
                <p className="text-gray-700 text-xs leading-relaxed italic">
                  "LearnX helped me land a ₹18LPA job in just 4 months!"
                </p>
                <p className="text-gray-400 text-xs mt-1 font-semibold">Ankit V. — Dev @ Zomato</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-8 mt-7">
              {[["50K+","Students"],["1.2K+","Courses"],["98%","Satisfaction"]].map(([val, label], i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{val}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full lg:w-[480px] shrink-0 bg-white flex flex-col justify-center px-10 py-12 relative z-10 min-h-screen"
          style={{ boxShadow: "-20px 0 60px rgba(0,0,0,0.06)" }}>

          <div className="anim-fadeup">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-9">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">L</div>
              <span className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LearnX</span>
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ letterSpacing: "-0.5px" }}>
              Welcome back 👋
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              Login to continue your learning journey.
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
                <span className="shrink-0">⚠️</span> <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary text-lg transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 accent-primary cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white anim-spin" />
                    Signing in...
                  </>
                ) : "Sign In →"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-300 text-xs font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 mb-7">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary hover:bg-violet-50 hover:text-primary transition-all cursor-pointer">
                <span className="text-lg">G</span> Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:border-primary hover:bg-violet-50 hover:text-primary transition-all cursor-pointer">
                <span className="text-lg">🍎</span> Apple
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:opacity-75 transition-opacity">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}