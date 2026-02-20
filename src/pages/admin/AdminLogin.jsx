import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";

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
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password)
      return setError("Please fill in all fields.");

    if (loginAttempts >= 5)
      return setError("Too many failed attempts. Try later.");

    try {
      setIsLoading(true);

      const res = await axiosInstance.post("/admin/login", {
        email: formData.email,
        password: formData.password,
      });

      const user = res.data?.user;

      if (!user) throw new Error("No user data returned.");

      if (user.role !== "admin" && user.role !== "superadmin")
        throw new Error("This account does not have admin access.");

      login(user);
      navigate("/admin", { replace: true });

    } catch (err) {
      setLoginAttempts((prev) => prev + 1);

      if (err.response?.status === 401) setError("Invalid email or password.");
      else if (err.response?.status === 403) setError("Admin privileges required.");
      else if (err.response?.status === 429) setError("Too many requests. Please wait.");
      else setError(err.message || "Login failed.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className=" min-h-screen bg-gray-50 flex items-center justify-center p-4">
    //   <div className="w-full max-w-sm">

    //     {/* Logo */}
    //     <div className="flex items-center justify-center gap-2 mb-6">
    //       <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-black">
    //         logo
    //       </div>
    //       <span className="text-xl font-black text-gray-900">LearnX <span className="text-textMuted font-medium text-sm">Admin</span></span>
    //     </div>

    //     {/* Card */}
    //     <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

    //       <h1 className="text-xl font-black text-gray-900 mb-1">Sign in</h1>
    //       <p className="text-sm text-textMuted mb-6">Admin access only</p>

    //       {/* Error */}
    //       {error && (
    //         <div className="bg-red-50 border border-red-200 text-error text-sm font-medium rounded-lg px-3 py-2.5 mb-4">
    //           ⚠️ {error}
    //         </div>
    //       )}

    //       {/* Attempts warning */}
    //       {loginAttempts >= 3 && loginAttempts < 5 && (
    //         <div className="bg-yellow-50 border border-yellow-200 text-warning text-sm font-medium rounded-lg px-3 py-2.5 mb-4">
    //           ⚡ {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? "s" : ""} left before lockout.
    //         </div>
    //       )}

    //       <form onSubmit={handleSubmit} className="space-y-4">

    //         {/* Email */}
    //         <div>
    //           <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    //             Email
    //           </label>
    //           <input
    //             type="email"
    //             name="email"
    //             placeholder="admin@learnx.com"
    //             value={formData.email}
    //             onChange={handleChange}
    //             autoComplete="email"
    //             disabled={isLoading}
    //             className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors duration-200"
    //           />
    //         </div>

    //         {/* Password */}
    //         <div>
    //           <div className="flex justify-between mb-1.5">
    //             <label className="text-sm font-semibold text-gray-700">Password</label>
    //             <button type="button" className="text-sm text-primary font-semibold hover:opacity-75">
    //               Forgot?
    //             </button>
    //           </div>
    //           <div className="relative">
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               name="password"
    //               placeholder="••••••••"
    //               value={formData.password}
    //               onChange={handleChange}
    //               autoComplete="current-password"
    //               disabled={isLoading}
    //               className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-primary transition-colors duration-200"
    //             />
    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-primary text-base transition-colors"
    //             >
    //               {showPassword ? "🙈" : "👁️"}
    //             </button>
    //           </div>
    //         </div>

    //         {/* Remember */}
    //         <div className="flex items-center gap-2">
    //           <input type="checkbox" id="remember" className="w-4 h-4 accent-primary" />
    //           <label htmlFor="remember" className="text-sm text-textMuted cursor-pointer">
    //             Stay signed in
    //           </label>
    //         </div>

    //         {/* Submit */}
    //         <button
    //           type="submit"
    //           disabled={isLoading || loginAttempts >= 5}
    //           className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    //         >
    //           {isLoading ? (
    //             <>
    //               <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    //               </svg>
    //               Signing in...
    //             </>
    //           ) : "Sign In"}
    //         </button>
    //       </form>
    //     </div>

    //     <p className="text-center text-sm text-textMuted mt-4">
    //       <a href="/" className="hover:text-primary transition-colors">← Back to site</a>
    //     </p>

    //   </div>
    // </div>
    <>
        <h1 className="text-blue-400">hello</h1>
    </>
  );
}