import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { Eye, EyeOff, AlertCircle, Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) return "Email address is required.";
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Custom Validation
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    if (loginAttempts >= 5)
      return setError("Maximum login attempts exceeded. Please contact system support.");

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/admin/login", formData);
      login(res.data.admin, res.data.token);
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      if (err.response?.status === 401)
        setError("Invalid credentials. Please check your email and password.");
      else if (err.response?.status === 403)
        setError("Access denied. Admin privileges are required for this area.");
      else if (err.response?.status === 429)
        setError("Too many requests. For security, please try again in a few minutes.");
      else
        setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-8">
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">LearnX Admin Login</h1>
            <p className="text-sm text-gray-500">Secure access to your management dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg px-4 py-3 mb-6">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Security Warning */}
          {loginAttempts >= 3 && loginAttempts < 5 && (
            <div className="bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold rounded-lg px-4 py-3 mb-6 uppercase tracking-wide text-center">
              Security Notice: {5 - loginAttempts} attempts remaining
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@learnx.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-primary font-bold hover:underline">
                  Reset Password
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || loginAttempts >= 5}
              className="w-full bg-primary text-black py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : "Sign Into Dashboard"}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
            <span>&larr;</span> Return to Public Site
          </a>
        </div>
      </div>
    </div>
  );
}