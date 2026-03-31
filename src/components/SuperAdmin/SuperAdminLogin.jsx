import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { Eye, EyeOff, AlertCircle, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);

  
  useEffect(() => {
    if (isAuthenticated && user?.role === "super admin") {
      navigate("/superadmin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const res = await axiosInstance.post("/admin/login", formData);
    
    
    console.log("Response Data:", res.data);

    if (res.data.success) {
      const userData = res.data.user; 
      const token = res.data.token;

      if (!userData || !token) {
        setError("Invalid response format from server.");
        setIsLoading(false);
        return;
      }
      const userRole = userData.role.toLowerCase().trim();

      if (userRole === "super admin" || userRole === "superadmin") {
        login(userData, token);
        
        navigate("/superadmin/dashboard", { replace: true });
      } else {
        setError("Access Denied: Super Admin privileges required.");
      }
    }
  } catch (err) {
    console.error("Login Error:", err);
    if (err.response) {
      setError(err.response.data.message || "Invalid credentials.");
    } else {
      setError("Server connection failed.");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Branding Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-[22px] flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-slate-200">
            <ShieldCheck size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Learn<span className="text-indigo-600">X</span></h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Super Admin Gateway</p>
        </div>

        {/* Card Layout */}
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-800">Secure Authentication</h2>
            <p className="text-sm text-slate-400 font-medium">Authorized system access only.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-2xl px-5 py-4 mb-8 uppercase tracking-wide">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
              <input
                type="email"
                name="email"
                placeholder="superadmin@bheema.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Master Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-5 rounded-[22px] font-black shadow-2xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : "Enter Control Center"}
            </button>
          </form>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="w-full text-center mt-8 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
        >
          &larr; Exit to Public Site
        </button>
      </div>
    </div>
  );
}