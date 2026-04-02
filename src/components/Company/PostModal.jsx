import React, { useState, useMemo } from "react";
import { X, Calendar, Briefcase, Loader2, Globe, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance";

export default function PostModal({ isOpen, onClose, onRefresh }) {
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        type: "",
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        is_paid: true,
        salary: "",
        location: "",
    });

    const errors = useMemo(() => {
        return {
            type: !formData.type,
            title: !formData.title.trim(),
            start_date: !formData.start_date,
            end_date: !formData.end_date,
            location: !formData.location.trim(),
            description: !formData.description.trim(),
            salary: formData.is_paid && (!formData.salary || Number(formData.salary) < 0),
        };
    }, [formData]);

    const isFormValid = !Object.values(errors).some((error) => error === true);

    if (!isOpen) return null;

    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        const loadingToast = toast.loading("Submitting for verification...");

        try {
            await axiosInstance.post("/company/post/create", formData);
            toast.success("Post submitted successfully!", { id: loadingToast });
            onRefresh();
            onClose();
            setFormData({
                type: "", title: "", description: "", start_date: "", 
                end_date: "", is_paid: true, salary: "", location: ""
            });
            setTouched({});
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to submit post";
            toast.error(msg, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    const getInputClass = (name) => {
        const hasError = touched[name] && errors[name];
        return `w-full bg-slate-50 border px-5 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${
            hasError 
            ? 'border-rose-500 ring-4 ring-rose-500/10 animate-shake' 
            : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/10'
        }`;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-100">
                
                <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Create Opening</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recruitment Portal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar text-left">
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opening Type</label>
                        <select 
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass("type")}
                        >
                            <option value="">-- Select Job or Internship --</option>
                            <option value="job">Full-time Job</option>
                            <option value="internship">Internship Program</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Title</label>
                        <div className="relative">
                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text" 
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Senior Frontend Developer" 
                                className={`${getInputClass("title")} pl-14`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="date" 
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${getInputClass("start_date")} pl-14 cursor-pointer`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="date" 
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${getInputClass("end_date")} pl-14 cursor-pointer`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[25px] border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compensation</p>
                                <p className="text-xs font-bold text-slate-700">{formData.is_paid ? 'Paid Position' : 'Unpaid / Voluntary'}</p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setFormData({...formData, is_paid: !formData.is_paid})} 
                            className={`w-12 h-6 rounded-full relative transition-all ${formData.is_paid ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_paid ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    {formData.is_paid && (
                        <div className="space-y-1 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salary (Monthly INR)</label>
                            <input 
                                type="number" 
                                name="salary"
                                min="0"
                                onWheel={(e) => e.target.blur()}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={formData.salary}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || (Number(val) >= 0 && !val.includes("-"))) {
                                        handleChange(e);
                                    }
                                }}
                                onBlur={handleBlur}
                                placeholder="Amount in ₹" 
                                className={`${getInputClass("salary")} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <div className="relative">
                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text" 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Remote or Indore" 
                                className={`${getInputClass("location")} pl-14`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows="4" 
                            className={`${getInputClass("description")} resize-none`}
                            placeholder="Responsibilities..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading || !isFormValid}
                            className={`w-full py-5 rounded-[22px] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                                !isFormValid || isLoading 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-slate-900 text-white shadow-slate-200 hover:bg-black'
                            }`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Submit for Verification"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}