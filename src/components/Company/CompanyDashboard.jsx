import React, { useState, useEffect } from "react";
import { 
  Plus, Briefcase, GraduationCap, LayoutDashboard, 
  Loader2, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, ShieldCheck
} from "lucide-react";
import PostModal from "./PostModal";
import axiosInstance from "../../utils/axiosinstance";
import CompanyNavbar from "./CompanyNavbar";
import toast from "react-hot-toast";

export default function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const endpoint = activeTab === "jobs" ? "/company/jobs/get" : "/company/internships/get";
            const res = await axiosInstance.get(endpoint);
            setData(res.data.posts || []);
        } catch (error) {
            toast.error("Failed to load records from server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab !== "overview") {
            fetchData();
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <CompanyNavbar />

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Corporate Dashboard
                        </h1>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                            Manage your recruitment pipeline
                        </p>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Create New Post
                    </button>
                </div>

                <div className="flex overflow-x-auto pb-2 md:pb-0 no-scrollbar mb-8">
                    <div className="flex gap-3 bg-white p-2 rounded-[25px] border border-slate-200 w-fit shadow-sm">
                        <button 
                            onClick={() => setActiveTab("overview")} 
                            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <LayoutDashboard size={16} /> Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab("jobs")} 
                            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight whitespace-nowrap transition-all ${activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Briefcase size={16} /> Jobs
                        </button>
                        <button 
                            onClick={() => setActiveTab("internships")} 
                            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight whitespace-nowrap transition-all ${activeTab === 'internships' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <GraduationCap size={16} /> Internships
                        </button>
                    </div>
                </div>

                <div className="transition-all duration-300">
                    {activeTab === "overview" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                                    <Briefcase size={32} />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase">Active Jobs</h3>
                                <p className="text-xs font-bold text-slate-400 mt-2 italic">Posts pending or verified</p>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase">Internships</h3>
                                <p className="text-xs font-bold text-slate-400 mt-2 italic">Paid & Unpaid opportunities</p>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase">Verification</h3>
                                <p className="text-xs font-bold text-slate-400 mt-2 italic">Super Admin monitoring</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[35px] md:rounded-[45px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position Details</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Hiring Period</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Compensation</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center">
                                                    <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Fetching data...</p>
                                                </td>
                                            </tr>
                                        ) : data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-20 text-center">
                                                    <AlertCircle className="mx-auto text-slate-200 mb-3" size={48} />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No records found</p>
                                                </td>
                                            </tr>
                                        ) : data.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="p-6 min-w-[200px]">
                                                    <p className="text-sm font-black text-slate-800 uppercase leading-tight">{item.title}</p>
                                                    <p className="text-[9px] text-indigo-500 font-bold uppercase mt-1 tracking-tighter">{item.category}</p>
                                                </td>
                                                <td className="p-6 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] uppercase tracking-tighter">
                                                        <Clock size={12} className="text-slate-300" />
                                                        {new Date(item.start_date).toLocaleDateString('en-IN')} 
                                                        <ChevronRight size={10} className="text-slate-200" />
                                                        {new Date(item.end_date).toLocaleDateString('en-IN')}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${item.is_paid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                                                        {item.is_paid ? `₹${item.salary}` : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center">
                                                        {item.status === 'verified' ? (
                                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"><CheckCircle size={12} /> Verified</div>
                                                        ) : item.status === 'rejected' ? (
                                                            <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"><XCircle size={12} /> Rejected</div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"><AlertCircle size={12} /> Pending</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <PostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchData} 
            />
        </div>
    );
}