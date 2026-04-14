import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitorOff, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const LectureNotAvailable = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        
        {/* Visual Icon Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-100 rounded-[30px] rotate-6 scale-110 opacity-50" />
        <div className="relative w-24 h-24 bg-white border-2 border-amber-100 rounded-[30px] flex items-center justify-center text-amber-600 shadow-xl shadow-amber-100/50">
          <MonitorOff size={44} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white text-white shadow-lg">
          <AlertCircle size={16} fill="currentColor" stroke="none" />
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight uppercase">
        Lecture Not Found
      </h2>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed font-medium mb-10">
        It looks like this lecture hasn't been uploaded yet or has been moved. Check back later or contact your instructor.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-white text-slate-900 border-2 border-slate-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    </div>
  </>
  );

};

export default LectureNotAvailable;