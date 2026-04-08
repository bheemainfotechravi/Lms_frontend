import React, { useState, useMemo } from "react";
import { X, Calendar, Briefcase, Loader2, Globe, IndianRupee, Clock } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance";
import { useSelector } from "react-redux";
export default function PostModal({ isOpen, onClose, onRefresh }) {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});
    
    const [formData, setFormData] = useState({
        type: "",
        job_title: "",
        description: "",
        salary: "",
        location: "",
        duration: "", 
        last_date: "", 
    });
    const errors = useMemo(() => {
        return {
            type: !formData.type,
            job_title: !formData.job_title.trim(),
            last_date: !formData.last_date,
            location: !formData.location.trim(),
            description: !formData.description.trim(),
            salary: !formData.salary || Number(formData.salary) < 0,
            duration: !formData.duration.trim(),
        };
    }, [formData]);

    const isFormValid = !Object.values(errors).some((error) => error === true);

    if (!isOpen) return null;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    const slug = user?.companySlug || user?.slug; 
    if (!slug) {
        console.error("Slug missing in User Context:", user);
        toast.error("Company session error. Please re-login.");
        return;
    }
    setIsLoading(true);
    const loadingToast = toast.loading("Posting Job...");
    try {
        const payload = {
            job_title: formData.job_title,
            type: formData.type,
            description: formData.description,
            location: formData.location,
            salary: formData.salary,
            duration: formData.duration,
            last_date: formData.last_date,
            posted_date: new Date().toISOString().split('T')[0]
        };
        const targetUrl = `/company/post_job/${slug}`;
        console.log(" Posting to:", targetUrl);
        await axiosInstance.post(targetUrl, payload);        
        toast.success("Job posted successfully!", { id: loadingToast });
        onRefresh();
        onClose();
        setFormData({
            type: "", job_title: "", description: "", salary: "", 
            location: "", duration: "", last_date: ""
        });
        setTouched({});

    } catch (err) {
        console.error("Post Error:", err.response?.data);
        const msg = err.response?.data?.message || "Failed to post job";
        toast.error(msg, { id: loadingToast });
    } finally {
        setIsLoading(false);
    }
};
    const getInputClass = (name) => {
        const hasError = touched[name] && errors[name];
        return `w-full bg-slate-50 border px-5 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${
            hasError ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'
        }`;
    };
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-100">
                
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Create Opening</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recruitment Portal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto custom-scrollbar text-left">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opening Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} onBlur={handleBlur} className={getInputClass("type")}>
                                <option value="">-- Select --</option>
                                <option value="job">Full-time Job</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} onBlur={handleBlur} placeholder="Frontend Dev" className={`${getInputClass("job_title")} pl-14`} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Salary (INR)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="number" name="salary" value={formData.salary} onChange={handleChange} onBlur={handleBlur} placeholder="50000" className={`${getInputClass("salary")} pl-14`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Working Duration</label>
                            <div className="relative">
                                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="text" name="duration" value={formData.duration} onChange={handleChange} onBlur={handleBlur} placeholder="6 Months / Permanent" className={`${getInputClass("duration")} pl-14`} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                            <div className="relative">
                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="text" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} placeholder="Remote / Indore" className={`${getInputClass("location")} pl-14`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Application Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="date" name="last_date" value={formData.last_date} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass("last_date")} pl-14`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} rows="4" className={`${getInputClass("description")} resize-none`} placeholder="Key responsibilities and requirements..."></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isLoading || !isFormValid} className={`w-full py-5 rounded-[22px] font-black uppercase text-xs tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${!isFormValid || isLoading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'}`}>
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Post Job Opportunity"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}