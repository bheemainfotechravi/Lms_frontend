import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import loginImg from "../../assets/login-images/login.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 64,
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "email":
        if (!trimmedValue) return "Email is required.";
        if (trimmedValue.length > 254) return "Email is too long.";
        if (!EMAIL_REGEX.test(trimmedValue)) {
          return "Enter a valid email address.";
        }
        return "";

      case "password":
        if (!value) return "Password is required.";
        if (value.trim().length === 0) return "Password cannot be only spaces.";
        if (value.length < PASSWORD_RULES.minLength) {
          return `Password must be at least ${PASSWORD_RULES.minLength} characters.`;
        }
        if (value.length > PASSWORD_RULES.maxLength) {
          return `Password must be less than ${PASSWORD_RULES.maxLength} characters.`;
        }
        return "";

      default:
        return "";
    }
  };

  const errors = useMemo(() => {
    return {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
  }, [formData]);

  const isFormValid = !errors.email && !errors.password;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setServerError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    setTouched({
      email: true,
      password: true,
    });

    const email = formData.email.trim();
    const password = formData.password;

    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) return;

    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (res?.data?.success) {
        login(res.data.user, res.data.token);
        navigate("/user/dashboard", { replace: true });
      } else {
        setServerError(res?.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid email or password. Please try again.";

      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const baseInputClass =
    "w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:ring-2";

  const getInputStyles = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];

    return hasError
      ? `${baseInputClass} border-red-400 focus:border-red-500 focus:ring-red-100`
      : `${baseInputClass} border-gray-200 focus:border-primary focus:ring-primary/10`;
  };

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

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-16 py-20 relative">
          <div className="absolute top-8 left-10 flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl bg-amber-500">
              L
            </div>
            <span className="text-xl font-black text-slate-900">LearnX</span>
          </div>

          <div className="max-w-sm w-full text-center">
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

              <img src={loginImg} alt="login illustration" />
            </div>

            <div className="flex justify-center gap-8 mt-7">
              {[
                ["50K+", "Students"],
                ["1.2K+", "Courses"],
                ["98%", "Satisfaction"],
              ].map(([val, label], i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-slate-900">{val}</p>
                  <p className="text-slate-900 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="w-full lg:w-[768px] shrink-0 bg-white flex flex-col justify-center px-10 py-12 relative z-10 min-h-screen"
          style={{ boxShadow: "-20px 0 60px rgba(0,0,0,0.06)" }}
        >
          <div className="anim-fadeup">
            <Link
              to="/"
              className="flex items-center gap-2 mb-9 hover:opacity-80 transition-opacity"
            >
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

            {serverError && (
              <div
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5"
                role="alert"
                aria-live="polite"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  className={getInputStyles("email")}
                />

                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${getInputStyles("password")} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full bg-[#ffc65c] flex items-center justify-center gap-2 text-slate-800 font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5"
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

            <p className="text-center text-gray-500 py-5 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#fda707] hover:underline hover:text-[#ffc65c] font-bold hover:opacity-75 transition-opacity"
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