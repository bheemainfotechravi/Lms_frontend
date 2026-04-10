import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaArrowRight } from "react-icons/fa";

const roles = [
  {
    id: "student",
    title: "Student",
    desc: "Learn new skills, get certifications, and boost your career.",
    icon: <FaUserGraduate />,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-200",
  },
  {
    id: "teacher",
    title: "Instructor",
    desc: "Share your knowledge, create courses, and manage students.",
    icon: <FaChalkboardTeacher />,
    color: "from-[#E3A83C] to-[#c9922e]",
    shadow: "shadow-orange-200",
  },
  {
    id: "corporate",
    title: "Business",
    desc: "Hire top talent, post jobs, and grow your organization.",
    icon: <FaBuilding />,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-200",
  },
];

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

 const handleContinue = () => {
    if (!selectedRole) return;

    if (selectedRole === "student") {
      navigate("/register");
    } else {
      navigate(`/admin/registration?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0D5A1] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full text-center space-y-3 mb-16">
      <div className="flex justify-center w-full">
     <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
    <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-900 font-black text-lg">
      L
    </div>
    <span className="text-xl font-black">
      Learnx
    </span>
     </Link>
   </div>
        <p className="text-black mt-5 font-black text-[13px] md:text-xs uppercase tracking-widest">
          Select your account type to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`group cursor-pointer p-10 rounded-[40px] border-4 transition-all duration-300 bg-white flex flex-col items-center text-center ${
              selectedRole === role.id
                ? `border-[#E3A83C] ${role.shadow} -translate-y-2`
                : "border-transparent hover:border-slate-200"
            }`}
          >
            {/* Icon Circle */}
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white text-4xl mb-8 shadow-xl transform group-hover:scale-110 transition-transform duration-500`}>
              {role.icon}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
              {role.title}
            </h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed mb-4">
              {role.desc}
            </p>
            
            {/* Minimal Dot Indicator */}
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedRole === role.id ? "bg-[#E3A83C] scale-150" : "bg-slate-100"
            }`} />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-10 w-full max-w-xs">
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full flex items-center justify-center gap-4 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all ${
            selectedRole
              ? "bg-[#E3A83C] text-white shadow-2xl shadow-[#E3A83C]/30 hover:bg-[#c9922e] active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Proceed <FaArrowRight className="text-xs" />
        </button>
      </div>

      {/* Login Link */}
      <p className="mt-10 text-[13px] font-black uppercase tracking-widest">
        Already a member?{" "}
        <button onClick={() => navigate("/login")} className="text-blue-500 uppercase tracking-widest border-b border-[#E3A83C]/30 pb-0.5">
          Login
        </button>
      </p>
    </div>
  );
}