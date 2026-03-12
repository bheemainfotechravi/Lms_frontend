import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import {
  CircleCheckBig,
  Clock3,
  Trophy,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Chrome,
  Apple,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import loginImg from "../../assets/login-images/login.svg"

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


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
      const res = await axiosInstance.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(res.data)
      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err) {
      console.log(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10";



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

      <div className="min-h-screen flex relative overflow-hidden bg-[#F0D5A1]">
        {/* Background blobs */}
        <div
          className="absolute top-[5%] right-[10%] w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[5%] w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15,23,42,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-16 py-20 relative">
          {/* Logo */}
          <div className="absolute top-8 left-10 flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl  flex items-center justify-center text-slate-900 font-black text-2xl bg-amber-500">
              L
            </div>
            <span className="text-xl font-black text-slate-900">
              Learn
            </span>
          </div>

          <div className="max-w-sm w-full text-center">
            {/* Floating Stats Card */}
            <div
              className="bg-white/30 rounded-2xl p-7 border border-violet-100 mb-6 anim-float"
              style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.12)" }}
            >
              <div className="flex items-center gap-3.5 mb-5">



                <div className="text-left">
                  <p className="text-gray-900 font-black text-md">
                    Welcome Back!
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Continue your learning journey
                  </p>
                </div>
              </div>
              <img src={loginImg} alt="login-image" />

            </div>



            {/* Stats row */}
            <div className="flex justify-center gap-8 mt-7">
              {[
                ["50K+", "Students"],
                ["1.2K+", "Courses"],
                ["98%", "Satisfaction"],
              ].map(([val, label], i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-slate-900">
                    {val}
                  </p>
                  <p className="text-slate-900 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="w-full lg:w-[768px] shrink-0 bg-white flex flex-col justify-center px-10 py-12 relative z-10 min-h-screen"
          style={{ boxShadow: "-20px 0 60px rgba(0,0,0,0.06)" }}
        >
          <div className="anim-fadeup">
         
            <Link to="/" className="flex items-center gap-2 mb-9 hover:opacity-80 transition-opacity">
  <span className="text-2xl text-[#de950c] font-extrabold">
    LearnX
  </span>
</Link>

            <h1
              className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2"
              style={{ letterSpacing: "-0.5px" }}
            >
              Welcome back
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              Login to continue your learning journey.
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
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
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity"
                  >
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ffc65c] flex items-center justify-center gap-2  text-slate-800 font-bold text-sm py-3.5 rounded-xl transition-all
                       disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 anim-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-gray-500 py-5 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#fda707]  hover:underline hover:text-[#ffc65c] font-bold hover:opacity-75 transition-opacity"
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}