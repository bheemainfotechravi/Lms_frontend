import  { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { sendOTP, verifyOTP, resetPassword, setStep } from "../../features/RecoverPassword/forgotPasswordSlice";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
  step,
  sendOTPLoading,
  verifyOTPLoading,
  resetPasswordLoading,
  error,
  successMessage
} = useSelector((state) => state.forgotPassword);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const inputClass = "w-full bg-white border border-black rounded-xl px-10 py-3.5 text-sm text-black placeholder-gray-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";
  const errorInputClass = "border-red-500 focus:border-red-600";



useEffect(() => {
  if (successMessage) {
    toast.success(successMessage);
  } else if (error) {
    toast.error(error);
  }
}, [successMessage, error]);

  const handleSendOTP = (e) => {
  e.preventDefault();

  if (!formData.email) {
    return setErrors({ email: "Email is required" });
  }

  dispatch(sendOTP(formData.email));
};

  const handleVerifyOTP = (e) => {
  e.preventDefault();

  if (!formData.otp) {
    return setErrors({ otp: "Please enter OTP" });
  }

  dispatch(
    verifyOTP({
      email: formData.email,
      otp: formData.otp,
    })
  );
};




const handleResetPassword = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirm_password) {
    return toast.error("Passwords do not match");
  }

  const res = await dispatch(
    resetPassword({
      email: formData.email,
      password: formData.password,
      otp: formData.otp,
    })
  );

  if (res.meta.requestStatus === "fulfilled") {
    toast.success("Password Reset Successful!");
    navigate("/login");
  }
};
  return (
    <div className="min-h-screen bg-[#F0D5A1] flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 md:p-12 relative z-10 border-4 border-black/5">
        
        {/* Back Button */}
        <button 
          onClick={() => step > 1 ? dispatch(setStep(step - 1)) : navigate("/login")}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-amber-600 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" /> {step === 1 ? "Back to Login" : "Previous Step"}
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 text-amber-600">
             {step === 1 && <FaEnvelope size={40} />}
             {step === 2 && <ShieldCheck size={45} />}
             {step === 3 && <FaLock size={40} />}
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "New Password"}
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-2">
            {step === 1 && "Enter email to receive 6-digit OTP"}
            {step === 2 && `OTP sent to ${formData.email}`}
            {step === 3 && "Create a strong new password"}
          </p>
        </div>

       {step === 1 && (
  <form onSubmit={handleSendOTP} className="space-y-5">
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest ml-1 mb-1.5 block text-slate-500 text-left">
        Email Address
      </label>
      
      <div className="relative">
        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 z-10" />
        <input
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          className={`${inputClass} ${errors.email ? errorInputClass : "border-black"}`}
        />
      </div>
      {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 text-left">{errors.email}</p>}
    </div>
    
    <ActionButton loading={sendOTPLoading} text="Send OTP" icon={<FaPaperPlane />} />
  </form>
)}
        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="relative">
              <FaKey className="absolute left-4 top-[58px] -translate-y-1/2 text-slate-900 z-10" />
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 mb-1.5 block text-slate-500">Enter OTP</label>
              <input
                type="text"
                maxLength="6"
                placeholder="6-Digit Code"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, "")})}
                className={`${inputClass} tracking-[1em] text-center font-black`}
              />
            </div>
            <ActionButton loading={verifyOTPLoading} text="Verify Code" icon={<ShieldCheck size={16}/>} />
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase cursor-pointer hover:text-amber-600" onClick={handleSendOTP}>
              Resend Code
            </p>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <FaLock className="absolute left-4 top-[58px] -translate-y-1/2 text-slate-900 z-10" />
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 mb-1.5 block text-slate-500">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={inputClass}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[58px] -translate-y-1/2 text-slate-400">
                {showPassword ? <FaEyeSlash/> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-[58px] -translate-y-1/2 text-slate-900 z-10" />
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 mb-1.5 block text-slate-500">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                className={inputClass}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[58px] -translate-y-1/2 text-slate-400">
                {showConfirmPassword ? <FaEyeSlash/> : <FaEye />}
              </button>
            </div>
            <ActionButton loading={resetPasswordLoading} text="Reset Password" icon={<ArrowRight size={16}/>} />
          </form>
        )}

      </div>
    </div>
  );
}

// Reusable Button Component
function ActionButton({ loading, text, icon }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>{text} {icon}</>
      )}
    </button>
  );
}