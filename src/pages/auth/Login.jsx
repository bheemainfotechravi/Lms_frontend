import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || null;

  const dashboardMap = {
    student: "/student",
    teacher: "/teacher",
    admin: "/admin",
    superadmin: "/admin",
    company: "/company",
  };

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

      // ── MOCK for now ──
      await new Promise((r) => setTimeout(r, 1200));
      const mockUser = { id: 1, name: "Ankit Verma", email: formData.email, role: "student" };
      const mockToken = "mock-token-123";
      login(mockUser, mockToken);

      const redirect = from || dashboardMap[mockUser.role] || "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card { animation: fadeUp 0.6s ease both; }

        .input-wrap { position: relative; }
        .input-field {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #7C3AED;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .input-field::placeholder { color: #CBD5E1; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7C3AED, #06B6D4);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .social-btn {
          flex: 1;
          padding: 11px 16px;
          background: #fff;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .social-btn:hover { border-color: #7C3AED; background: #F5F3FF; color: #7C3AED; }

        .toggle-pass {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #94A3B8;
          font-size: 18px; padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }
        .toggle-pass:hover { color: #7C3AED; }

        .link { color: #7C3AED; font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
        .link:hover { opacity: 0.75; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #ffffff 0%, #F5F3FF 50%, #ECFEFF 100%)",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background Blobs */}
        <div style={{ position: "absolute", top: "5%", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.4, pointerEvents: "none" }} />

        {/* ── Left Panel (decorative) ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px", position: "relative",
        }}
          className="hide-mobile"
        >
          {/* Logo */}
          <div style={{ position: "absolute", top: "32px", left: "40px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff" }}>L</div>
            <span style={{ fontSize: "22px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
          </div>

          {/* Big Illustration Card */}
          <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
            {/* Floating Stats Card */}
            <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(124,58,237,0.12)", border: "1.5px solid #EDE9FE", marginBottom: "24px", animation: "float 4s ease-in-out infinite" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎓</div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: "#111827", fontWeight: 800, fontSize: "15px" }}>Welcome Back!</p>
                  <p style={{ color: "#94A3B8", fontSize: "13px" }}>Continue your learning journey</p>
                </div>
              </div>

              {[
                { label: "Courses Completed", value: "12", icon: "✅", color: "#10B981", bg: "#ECFDF5" },
                { label: "Hours Learned", value: "148h", icon: "🕐", color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Certificates Earned", value: "5", icon: "🏆", color: "#F59E0B", bg: "#FFFBEB" },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: stat.bg, borderRadius: "10px", marginBottom: i < 2 ? "8px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px" }}>{stat.icon}</span>
                    <span style={{ color: "#374151", fontSize: "13px", fontWeight: 600 }}>{stat.label}</span>
                  </div>
                  <span style={{ color: stat.color, fontSize: "15px", fontWeight: 800 }}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Mini */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.07)", border: "1.5px solid #F1F5F9", display: "flex", alignItems: "center", gap: "14px", textAlign: "left" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#EDE9FE", border: "2px solid #7C3AED", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>AV</div>
              <div>
                <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.6, fontStyle: "italic" }}>"LearnX helped me land a ₹18LPA job in just 4 months!"</p>
                <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "4px", fontWeight: 600 }}>Ankit V. — Dev @ Zomato</p>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "28px" }}>
              {[["50K+", "Students"], ["1.2K+", "Courses"], ["98%", "Satisfaction"]].map(([val, label], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "22px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</p>
                  <p style={{ color: "#94A3B8", fontSize: "12px", fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div style={{
          width: "480px", flexShrink: 0,
          background: "#fff",
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "48px 48px",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.06)",
          position: "relative", zIndex: 1,
          minHeight: "100vh",
        }}>

          <div className="login-card">
            {/* Mobile Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff" }}>L</div>
              <span style={{ fontSize: "20px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              Welcome back 👋
            </h1>
            <p style={{ color: "#64748B", fontSize: "15px", marginBottom: "32px" }}>
              Login to continue your learning journey.
            </p>

            {/* Error */}
            {error && (
              <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <p style={{ color: "#DC2626", fontSize: "14px", fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Email */}
              <div>
                <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "7px" }}>Email Address</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label style={{ color: "#374151", fontSize: "14px", fontWeight: 600 }}>Password</label>
                  <a href="#" className="link" style={{ fontSize: "13px" }}>Forgot password?</a>
                </div>
                <div className="input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingRight: "46px" }}
                    autoComplete="current-password"
                  />
                  <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="remember" style={{ width: "16px", height: "16px", accentColor: "#7C3AED", cursor: "pointer" }} />
                <label htmlFor="remember" style={{ color: "#64748B", fontSize: "14px", cursor: "pointer" }}>Remember me for 30 days</label>
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#F1F5F9" }} />
              <span style={{ color: "#CBD5E1", fontSize: "13px", fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "#F1F5F9" }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
              <button className="social-btn">
                <span style={{ fontSize: "18px" }}>G</span> Google
              </button>
              <button className="social-btn">
                <span style={{ fontSize: "18px" }}>🍎</span> Apple
              </button>
            </div>

            {/* Register Link */}
            <p style={{ textAlign: "center", color: "#64748B", fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link to="/register" className="link">Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}