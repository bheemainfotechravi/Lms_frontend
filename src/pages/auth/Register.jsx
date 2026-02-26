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
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";

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

      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10";

 return (
  <div className="min-h-screen flex bg-[#F0D5A1]">

    {/* ================= LEFT IMAGE SECTION ================= */}
    <div className="hidden lg:flex flex-1 relative items-center justify-center p-10 overflow-hidden">

      <style>{`
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .float-y {
          animation: floatY 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Glow Background */}
      <div
        className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-80px] right-10 w-72 h-72 rounded-full opacity-35 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Floating Image */}
      <div className="relative float-y">
        <div
          className="absolute -inset-6 rounded-[2rem] blur-2xl opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.35))",
          }}
        />
        <img
          src={signupImg}
          alt="Signup Illustration"
          className="relative rounded-3xl shadow-2xl w-[420px] h-[520px] object-contain"
        />
      </div>
    </div>

    {/* ================= RIGHT FORM SECTION ================= */}
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
          Create your account
          <Rocket className="w-5 h-5 text-violet-600" />
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          Join LearnX and start learning today.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-bold">
            Sign in →
          </Link>
        </p>

      </div>
    </div>

  </div>
);
}