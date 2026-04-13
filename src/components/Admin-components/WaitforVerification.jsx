import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, Mail } from 'lucide-react';

const WaitforVerification = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0D5A1] p-6 relative overflow-hidden">
      <div 
        onClick={() => navigate("/")}
        className="flex items-center gap-3 mb-12 cursor-pointer hover:opacity-80 transition-all gap-2 cursor-pointer shrink-0 "
      >
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-900 font-black text-lg">L</div>
                <span className="text-xl font-black">Learnx</span>

      </div>

      <div className=" w-full max-w-md bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-10 text-center -mt-6 relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-amber-100 rounded-[30px] rotate-6" />
            <div className="relative w-full h-full bg-amber-500 rounded-[30px] flex items-center justify-center text-slate-900 shadow-xl shadow-amber-200 animate-pulse">
                <Clock size={40} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
                <ShieldCheck size={20} className="text-emerald-500" />
            </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
            Verification Pending
        </h1>
        
        <div className="space-y-4 mb-10">
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Your account is currently under review by our team. We take security seriously to ensure the best experience.
            </p>
            
            <div className="flex items-center justify-center gap-3 bg-slate-50 py-3 px-4 rounded-2xl border border-slate-100/50">
                <Mail size={16} className="text-amber-600" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Check your inbox for updates
                </span>
            </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
            <button 
                onClick={() => navigate("/")}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                <FaArrowLeft /> Back to Home
            </button>
            
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                It Usually takes 24-48 hours
            </p>
        </div>
      </div>

      {/* Footer Support */}
      <button className="mt-3 text-xs font-black hover:text-blue-600 transition-colors uppercase tracking-widest">
        Contact Support
      </button>

    </div>
  );
};

export default WaitforVerification;