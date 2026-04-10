import React, { useState } from "react";
import { 
  X, CheckCircle, XCircle, Mail, Phone, Building, 
  Briefcase, Globe, Loader2, ShieldAlert, ChevronRight, 
  ChevronLeft, MapPin, Hash, User 
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance";

export default function AdminRequestModal({ requests = [], onClose, onRefresh }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(null); 

  if (!requests || requests.length === 0) return null;

  const currentRequest = requests[currentIndex];
  const totalRequests = requests.length;

  if (!currentRequest) {
    onClose();
    return null;
  }

const handleAction = async (status) => {
  try {
    setLoading(status);

    
    const payload = {
      user_email: currentRequest.email, 
      approval_status: status,                     
      remarks: status === "Approved" ? "Verified" : "Rejected" 
    };

    console.log("Sending Payload:", payload); 

    const res = await axiosInstance.patch("/admin/update_req_status", payload);

    if (res.data.success || res.status === 200) {
      toast.success(`Request ${status} successfully!`);
      
      
      if (currentIndex === totalRequests - 1) {
        onRefresh(); 
        onClose();   
      } else {
        setCurrentIndex((prev) => prev + 1); 
      }
    }
  } catch (error) {
    console.error("API Error:", error.response?.data);
    
    toast.error(error.response?.data?.message || "Fields are missing in payload");
  } finally {
    setLoading(null);
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card - Increased Width (max-w-2xl) and Responsive Height */}
      <div className="relative bg-white w-full max-w-2xl rounded-[30px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 my-auto">
        
        {/* Header Section - Optimized Padding */}
        <div className="p-5 sm:p-8 bg-slate-900 text-white relative">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
             <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">
                {currentIndex + 1} / {totalRequests}
             </span>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 font-black text-2xl sm:text-3xl shadow-xl shrink-0">
              {currentRequest.first_name?.charAt(0)}
            </div>
            <div className="pr-16 sm:pr-24">
              <h2 className="text-lg sm:text-2xl font-black tracking-tighter uppercase leading-tight truncate">
                {currentRequest.first_name} {currentRequest.last_name}
              </h2>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                {currentRequest.role_name}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body - Two Column Grid on Desktop for better Width usage */}
        <div className="p-6 sm:p-8 space-y-6 bg-white max-h-[60vh] overflow-y-auto custom-scrollbar">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Contact Details */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact Information</p>
                <div className="grid grid-cols-1 gap-2">
                  <DetailRow icon={<Mail className="text-indigo-500" size={14}/>} value={currentRequest.email} />
                  <DetailRow icon={<Phone className="text-indigo-500" size={14}/>} value={currentRequest.mobile} />
                </div>
              </div>

              {/* Right Column: Meta Data */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">System Audit</p>
                <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Date</p>
                      <div className="flex items-center gap-1 font-bold text-slate-700 text-[10px]"><User size={10}/> {new Date(currentRequest.user_created_at).toLocaleDateString()}</div>
                   </div>
                </div>
              </div>
           </div>

            {/* Section: Professional Profile (Wide View) */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Profile</p>
              <div className="bg-slate-50 p-4 sm:p-5 rounded-[24px] border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-inner">
                {currentRequest.role_name === "corporate" ? (
                  <>
                    <DetailRow icon={<Building className="text-slate-400" size={15}/>} value={currentRequest.company_name} />
                    <DetailRow icon={<Globe className="text-slate-400" size={15}/>} value={currentRequest.industry} />
                    <DetailRow icon={<MapPin className="text-slate-400" size={15}/>} value={currentRequest.location} />
                    <DetailRow icon={<ShieldAlert className="text-slate-400" size={15}/>} value="Verified Business" />
                  </>
                ) : (
                  <>
                    <DetailRow icon={<Briefcase className="text-slate-400" size={15}/>} value={currentRequest.experience || "N/A"} />
                    <DetailRow icon={<ShieldAlert className="text-slate-400" size={15}/>} value="Educational Instructor" />
                  </>
                )}
              </div>
            </div>
        </div>

        {/* Footer Actions - Flexible Layout */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => handleAction("rejected")}
              disabled={!!loading}
              className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-600 border-2 border-rose-200 bg-white hover:bg-rose-50 transition-all disabled:opacity-50"
            >
              {loading === "rejected" ? <Loader2 size={16} className="animate-spin" /> : "Reject"}
            </button>

            <button
              onClick={() => handleAction("Approved")}
              disabled={!!loading}
              className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white shadow-xl hover:bg-black transition-all disabled:opacity-50"
            >
              {loading === "approved" ? <Loader2 size={16} className="animate-spin" /> : "Approve Access"}
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
             <button disabled={currentIndex === 0 || !!loading} onClick={() => setCurrentIndex(prev => prev - 1)} className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-10 flex items-center gap-2"><ChevronLeft size={14}/> Previous</button>
             <button disabled={currentIndex === totalRequests - 1 || !!loading} onClick={() => setCurrentIndex(prev => prev + 1)} className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-10 flex items-center gap-2">Next <ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, value }) {
  return (
    <div className="flex items-center gap-3 p-1 overflow-hidden">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight truncate">{value || "---"}</span>
    </div>
  );
}