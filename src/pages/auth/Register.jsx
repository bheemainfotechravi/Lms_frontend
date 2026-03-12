import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import {
  Rocket,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import signupImg from '../../assets/login-images/singup.svg'
export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.first_name.trim()) return "First name is required.";
    if (!formData.last_name.trim()) return "Last name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!emailRegex.test(formData.email.trim())) return "Invalid email format.";
    if (!formData.mobile.trim()) return "Mobile No. is required.";
    if (!mobileRegex.test(formData.mobile.trim()))
      return "Invalid mobile number (10-15 digits only).";
    if (!formData.password) return "Password is required.";
    if (!passwordRegex.test(formData.password))
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/user/signup", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
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

      {/* ================= LEFT PANEL ================= */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-16 py-20 relative">

        {/* Logo */}
        <div className="absolute top-8 left-10 flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl bg-amber-500">
            L
          </div>
          <span className="text-xl font-black text-slate-900">
            LearnX
          </span>
        </div>

        <div className="max-w-sm w-full text-center">

          {/* Floating Card */}
          <div
            className="bg-white/30 rounded-2xl p-7 border border-violet-100 mb-6 anim-float"
            style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.12)" }}
          >

            <div className="text-left mb-4">
              <p className="text-gray-900 font-black text-md">
                Start Your Journey
              </p>
              <p className="text-gray-400 text-sm mt-0.5">
                Join thousands of learners today
              </p>
            </div>

            <img src={signupImg} alt="signup-image" />
          </div>

          {/* Stats */}
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
                <p className="text-slate-900 text-xs mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        className="w-full lg:w-[768px] shrink-0 bg-white flex flex-col justify-center px-10 py-12 relative z-10 min-h-screen"
        style={{ boxShadow: "-20px 0 60px rgba(0,0,0,0.06)" }}
      >

        <div className="anim-fadeup">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-9">
            <span className="text-2xl text-[#de950c] font-extrabold">
              LearnX
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            Create your account
            <Rocket className="w-5 h-5 text-amber-500" />
          </h1>

          <p className="text-slate-500 text-sm mb-8">
            Join LearnX and start learning today.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

           
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ffc65c] flex items-center justify-center gap-2 text-slate-800 font-bold text-sm py-3.5 rounded-xl transition-all
              disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 anim-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Login link */}
          <p className="text-center text-gray-500 py-5 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#fda707] font-bold hover:underline hover:text-[#ffc65c]"
            >
              Sign in →
            </Link>
          </p>

        </div>
      </div>

    </div>
  </>
);
}