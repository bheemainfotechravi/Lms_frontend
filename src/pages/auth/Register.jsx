import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  { value: "student", label: "Student", icon: "👨‍🎓", desc: "I want to learn new skills" },
  { value: "teacher", label: "Instructor", icon: "👨‍🏫", desc: "I want to teach & earn" },
  { value: "company", label: "Company", icon: "🏢", desc: "I want to train my team" },
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // step 1: role, step 2: form
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // company specific
    companyName: "",
    companySize: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) return "Full name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    if (selectedRole === "company" && !formData.companyName.trim()) return "Company name is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setIsLoading(true);
    try {
      // 🔌 Replace with real API call
      // const res = await authService.register({ ...formData, role: selectedRole });
      // login(res.user, res.token);

      // ── MOCK ──
      await new Promise((r) => setTimeout(r, 1400));
      const mockUser = { id: 2, name: formData.name, email: formData.email, role: selectedRole };
      login(mockUser, "mock-token-register");

      const dashboardMap = { student: "/student", teacher: "/teacher", company: "/company" };
      navigate(dashboardMap[selectedRole] || "/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#EF4444", width: "25%" };
    if (p.length < 10) return { label: "Fair", color: "#F59E0B", width: "55%" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) return { label: "Strong", color: "#10B981", width: "100%" };
    return { label: "Good", color: "#06B6D4", width: "75%" };
  };

  const strength = passwordStrength();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .fade-up { animation: fadeUp 0.5s ease both; }
        .slide-in { animation: slideIn 0.4s ease both; }

        .input-field {
          width: 100%; padding: 13px 16px;
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          font-size: 15px; font-family: inherit;
          color: #111827; background: #fff;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .input-field::placeholder { color: #CBD5E1; }

        .role-card {
          padding: 20px;
          border: 2px solid #E2E8F0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          background: #fff;
          text-align: center;
        }
        .role-card:hover { border-color: #7C3AED; background: #F5F3FF; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(124,58,237,0.12); }
        .role-card.active { border-color: #7C3AED; background: #F5F3FF; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #7C3AED, #06B6D4);
          color: #fff; border: none; border-radius: 10px;
          font-size: 16px; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .back-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: #64748B; font-size: 14px; font-weight: 600;
          font-family: inherit; padding: 0; margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: #7C3AED; }

        .toggle-pass {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94A3B8; font-size: 18px; padding: 0; line-height: 1;
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

        {/* Background */}
        <div style={{ position: "absolute", top: "5%", right: "8%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.4, pointerEvents: "none" }} />

        {/* ── Left Decorative Panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px", position: "relative" }}>

          {/* Logo */}
          <div style={{ position: "absolute", top: "32px", left: "40px", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff" }}>L</div>
            <span style={{ fontSize: "22px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
          </div>

          <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
            {/* Hero text */}
            <div style={{ marginBottom: "36px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "14px" }}>
                Start Your
                <br />
                <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Journey</span>
              </h2>
              <p style={{ color: "#64748B", fontSize: "16px", lineHeight: 1.7 }}>
                Join 50,000+ learners who transformed their careers with LearnX.
              </p>
            </div>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
              {[
                { icon: "✅", text: "Access 1,200+ industry-level courses" },
                { icon: "🏆", text: "Earn verified certificates employers trust" },
                { icon: "📱", text: "Learn anywhere, anytime on any device" },
                { icon: "♾️", text: "Lifetime access — buy once, learn forever" },
                { icon: "🤝", text: "Join a thriving community of learners" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", borderRadius: "12px", padding: "13px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #F1F5F9", textAlign: "left" }}>
                  <span style={{ fontSize: "18px" }}>{f.icon}</span>
                  <span style={{ color: "#374151", fontSize: "14px", fontWeight: 600 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <div style={{ display: "flex" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#F59E0B", fontSize: "18px" }}>★</span>)}
              </div>
              <span style={{ color: "#374151", fontSize: "14px", fontWeight: 700 }}>4.9/5</span>
              <span style={{ color: "#94A3B8", fontSize: "14px" }}>from 12,000+ reviews</span>
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div style={{
          width: "500px", flexShrink: 0,
          background: "#fff",
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "48px",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.06)",
          position: "relative", zIndex: 1,
          minHeight: "100vh", overflowY: "auto",
        }}>

          {/* ══ STEP 1: Role Selection ══ */}
          {step === 1 && (
            <div className="fade-up">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff" }}>L</div>
                <span style={{ fontSize: "20px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
              </div>

              <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0F172A", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                Create your account 🚀
              </h1>
              <p style={{ color: "#64748B", fontSize: "15px", marginBottom: "32px" }}>
                First, tell us who you are. This helps us personalize your experience.
              </p>

              {/* Progress */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
                <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }} />
                <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "#E2E8F0" }} />
                <span style={{ color: "#94A3B8", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>Step 1 of 2</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {ROLES.map((role) => (
                  <div key={role.value} className="role-card" onClick={() => handleRoleSelect(role.value)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
                        {role.icon}
                      </div>
                      <div style={{ textAlign: "left", flex: 1 }}>
                        <p style={{ color: "#111827", fontWeight: 800, fontSize: "16px" }}>{role.label}</p>
                        <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "3px" }}>{role.desc}</p>
                      </div>
                      <span style={{ color: "#CBD5E1", fontSize: "20px" }}>›</span>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: "center", color: "#64748B", fontSize: "14px", marginTop: "28px" }}>
                Already have an account?{" "}
                <Link to="/login" className="link">Sign in →</Link>
              </p>
            </div>
          )}

          {/* ══ STEP 2: Registration Form ══ */}
          {step === 2 && (
            <div className="slide-in">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff" }}>L</div>
                <span style={{ fontSize: "20px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
              </div>

              {/* Back */}
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>

              {/* Progress */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }} />
                <div style={{ flex: 1, height: "4px", borderRadius: "99px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }} />
                <span style={{ color: "#94A3B8", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>Step 2 of 2</span>
              </div>

              {/* Role Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#F5F3FF", border: "1.5px solid #EDE9FE", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
                <span style={{ fontSize: "16px" }}>{ROLES.find(r => r.value === selectedRole)?.icon}</span>
                <span style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700 }}>
                  Registering as {ROLES.find(r => r.value === selectedRole)?.label}
                </span>
              </div>

              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", marginBottom: "6px", letterSpacing: "-0.5px" }}>
                Fill in your details
              </h1>
              <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>
                Almost there! Complete your profile to get started.
              </p>

              {/* Error */}
              {error && (
                <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "10px", padding: "12px 16px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>⚠️</span>
                  <p style={{ color: "#DC2626", fontSize: "14px", fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Full Name */}
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Full Name</label>
                  <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className="input-field" />
                </div>

                {/* Company Name (only for company role) */}
                {selectedRole === "company" && (
                  <>
                    <div>
                      <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Company Name</label>
                      <input type="text" name="companyName" placeholder="Acme Corp" value={formData.companyName} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Company Size</label>
                      <select name="companySize" value={formData.companySize} onChange={handleChange} className="input-field" style={{ cursor: "pointer" }}>
                        <option value="">Select company size</option>
                        <option value="1-10">1–10 employees</option>
                        <option value="11-50">11–50 employees</option>
                        <option value="51-200">51–200 employees</option>
                        <option value="201-500">201–500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Email Address</label>
                  <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className="input-field" />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      style={{ paddingRight: "46px" }}
                    />
                    <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {strength && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ background: "#F1F5F9", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
                        <div style={{ width: strength.width, height: "100%", background: strength.color, borderRadius: "99px", transition: "all 0.3s" }} />
                      </div>
                      <p style={{ color: strength.color, fontSize: "12px", fontWeight: 600, marginTop: "4px" }}>{strength.label} password</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    style={{ borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? "#EF4444" : undefined }}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "5px", fontWeight: 500 }}>Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <input type="checkbox" id="terms" required style={{ width: "16px", height: "16px", accentColor: "#7C3AED", cursor: "pointer", marginTop: "2px", flexShrink: 0 }} />
                  <label htmlFor="terms" style={{ color: "#64748B", fontSize: "13px", lineHeight: 1.6, cursor: "pointer" }}>
                    I agree to the{" "}
                    <a href="#" className="link" style={{ fontSize: "13px" }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="link" style={{ fontSize: "13px" }}>Privacy Policy</a>
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                      Creating account...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              <p style={{ textAlign: "center", color: "#64748B", fontSize: "14px", marginTop: "20px" }}>
                Already have an account?{" "}
                <Link to="/login" className="link">Sign in →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}