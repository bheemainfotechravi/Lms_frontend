import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTempPassword } from "../../features/RecoverPassword/forgotPasswordSlice";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
const { updatePasswordLoading, successMessage, error } = useSelector((state) => state.auth);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = useState({});


  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email address" : "";
      case "tempPassword":
        return !value ? "Temporary password is required" : "";
      case "newPassword":
        return value.length < 6 ? "Password must be at least 6 characters" : "";
      case "confirmPassword":
        return value !== formData.newPassword ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  const errors = useMemo(() => ({
    email: validateField("email", formData.email),
    tempPassword: validateField("tempPassword", formData.tempPassword),
    newPassword: validateField("newPassword", formData.newPassword),
    confirmPassword: validateField("confirmPassword", formData.confirmPassword),
  }), [formData]);

   useEffect(() => {
  if (successMessage) {
    toast.success(successMessage);
  } else if (error) {
    toast.error(error);
  }
}, [successMessage, error]);
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };
 
 const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched({
    email: true,
    tempPassword: true,
    newPassword: true,
    confirmPassword: true
  });

  const hasErrors = Object.values(errors).some(err => err !== "");
  if (hasErrors) return;

  const res = await dispatch(
    updateTempPassword({
      email: formData.email,
      password: formData.tempPassword,
      newPassword: formData.newPassword
    })
  );

  if (res.meta.requestStatus === "fulfilled") {
    navigate("/login");
  }
};

  const inputClass = "w-full bg-white border rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20";
  const errorInputClass = "border-red-500 focus:ring-red-100";

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .anim-fadeup { animation: fadeUp 0.6s ease both; }
        .anim-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#F0D5A1] p-6 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-amber-500/10 pointer-events-none" />

        <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 md:p-12 anim-fadeup relative z-10">
          
          <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-amber-600 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </button>

          <div className="text-center mb-10">
            <div className="flex justify-center w-full">
              <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-900 font-black text-lg shadow-lg">L</div>
                <span className="text-xl font-black text-slate-900">Learnx</span>
              </Link>
            </div>
            <h1 className="text-xl font-black text-slate-800 mt-4 uppercase tracking-tight">Set New Password</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Reset your temporary credentials</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-4 h-4 text-amber-500" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={`${inputClass} ${touched.email && errors.email ? errorInputClass : "border-slate-100"}`} 
                />
                {touched.email && errors.email && <p className="text-red-500 text-[9px] font-black uppercase mt-1.5 ml-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <Shield className="absolute left-4 top-4 w-4 h-4 text-amber-500" />
                <input 
                  type="password" 
                  name="tempPassword" 
                  placeholder="Temporary Password" 
                  value={formData.tempPassword} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={`${inputClass} ${touched.tempPassword && errors.tempPassword ? errorInputClass : "border-slate-100"}`} 
                />
                {touched.tempPassword && errors.tempPassword && <p className="text-red-500 text-[9px] font-black uppercase mt-1.5 ml-1">{errors.tempPassword}</p>}
              </div>
            </div>

            {/* Row 2: New Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <RiLockPasswordFill className="absolute left-4 top-4 w-4 h-4 text-amber-500" />
                <input 
                 type={showNewPassword ? "text" : "password"}
                  name="newPassword" 
                  placeholder="New Password" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={`${inputClass} ${touched.newPassword && errors.newPassword ? errorInputClass : "border-slate-100"}`} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-amber-500"
                >
                 {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
                {touched.newPassword && errors.newPassword && <p className="text-red-500 text-[9px] font-black uppercase mt-1.5 ml-1">{errors.newPassword}</p>}
              </div>

              <div className="relative">
                <RiLockPasswordFill className="absolute left-4 top-4 w-4 h-4 text-amber-500" />
                <input 
                 type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" 
                  placeholder="Confirm New Password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={`${inputClass} ${touched.confirmPassword && errors.confirmPassword ? errorInputClass : "border-slate-100"}`} 
                />
                 <button 
                  type="button" 
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-amber-500"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {touched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-[9px] font-black uppercase mt-1.5 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-[#0F172A] flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 disabled:opacity-70 hover:bg-slate-800 active:scale-95 mt-4"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 anim-spin" /> Updating...</>
              ) : (
                <>Update Password <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPassword;