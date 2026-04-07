import React, { useState, useEffect } from "react";
import { 
  Plus, Briefcase, GraduationCap, LayoutDashboard, 
  Loader2, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, ShieldCheck, Trash2
} from "lucide-react";
import PostModal from "./PostModal";
import axiosInstance from "../../utils/axiosinstance";
import CompanyNavbar from "./CompanyNavbar";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; 

export default function CompanyDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Backend key: companySlug (Jo admin_login se aa rahi hai)
    const companySlug = user?.companySlug


    const fetchData = async () => {
    if (!companySlug) return;
    
    try {
        setLoading(true);
        const res = await axiosInstance.get(`/company/get_jobs/${companySlug}`);
        
        const allJobs = res.data?.message?.jobs || []; 

        if (Array.isArray(allJobs)) {
            if (activeTab === "jobs") {
                setData(allJobs.filter(p => p.type?.toLowerCase() === "job"));
            } else if (activeTab === "internships") {
                setData(allJobs.filter(p => p.type?.toLowerCase() === "internship"));
            } else {
                setData(allJobs);
            }
        } else {
            setData([]);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        setData([]);
        toast.error("Failed to load records");
    } finally {
        setLoading(false);
    }
};

  // Function definition
const handleDelete = (jobSlug) => { // Yahan 'jobSlug' receive ho raha hai
    toast((t) => (
        <div className="flex flex-col gap-3 p-1">
            <p className="text-xs font-black uppercase tracking-tight text-slate-800 text-left">
                Are you sure you want to remove this post?
            </p>
            <div className="flex gap-2">
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        await executeDelete(jobSlug); // Wahi variable yahan pass karo
                    }}
                    className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                    Yes, Delete
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                    Cancel
                </button>
            </div>
        </div>
    ), { duration: 5000, position: 'top-center' });
};

// 2. Asli Delete Function jo API hit karega
const executeDelete = async (jobSlug) => {
    const loadingToast = toast.loading("Processing request...");
    
    try {
        // API Route: /api/company/remove_post/:slug
        // Yahan 'jobSlug' path parameter mein ja raha hai
        const res = await axiosInstance.delete(`/company/remove_post/${jobSlug}`);
        
        if (res.data.success || res.status === 200) {
            toast.success("Position removed successfully!", { id: loadingToast });
            fetchData(); // List refresh karo
        }
    } catch (error) {
        console.error("Delete Error:", error);
        const errorMsg = error.response?.data?.message || "Failed to remove post";
        toast.error(errorMsg, { id: loadingToast });
    }
};

    useEffect(() => {
        fetchData();
    }, [activeTab, companySlug]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 text-left">
            <CompanyNavbar />

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Corporate Dashboard
                        </h1>
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                            {user?.first_name}'s Recruitment Pipeline
                        </p>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"
                    >
                        <Plus size={18} /> Create New Post
                    </button>
                </div>

                {/* Tabs Section */}
                <div className="flex overflow-x-auto pb-2 mb-8">
                    <div className="flex gap-3 bg-white p-2 rounded-[25px] border border-slate-200 w-fit shadow-sm">
                        <button onClick={() => setActiveTab("overview")} className={`px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight flex items-center gap-2 ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}><LayoutDashboard size={16} /> Overview</button>
                        <button onClick={() => setActiveTab("jobs")} className={`px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight flex items-center gap-2 ${activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}><Briefcase size={16} /> Jobs</button>
                        <button onClick={() => setActiveTab("internships")} className={`px-6 py-3 rounded-[20px] font-black text-xs uppercase tracking-tight flex items-center gap-2 ${activeTab === 'internships' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}><GraduationCap size={16} /> Internships</button>
                    </div>
                </div>

                {/* Table / Overview Content */}
                <div className="transition-all">
                    {activeTab === "overview" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                            {/* ... Overview Cards ... */}
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4"><Briefcase size={32} /></div>
                                <h3 className="text-sm font-black uppercase">Postings Management</h3>
                                <p className="text-xs text-slate-400 mt-2">Manage your job and internship openings</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position Details</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Salary</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Deadline</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
                                        ) : data.length === 0 ? (
                                            <tr><td colSpan="5" className="py-20 text-center"><AlertCircle className="mx-auto text-slate-200 mb-2" /><p className="text-[10px] font-black text-slate-400 uppercase">No active posts found</p></td></tr>
                                        ) : data.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-6">
                                                    <p className="text-sm font-black text-slate-800 uppercase leading-tight">{item.job_title}</p>
                                                    <p className="text-[9px] text-indigo-500 font-bold uppercase mt-1 tracking-tighter">{item.type}</p>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-slate-500 uppercase">{item.location}</td>
                                                <td className="p-6 text-center">
                                                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                        ₹{item.salary}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center text-xs font-bold text-slate-500">
                                                    {new Date(item.last_date).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="p-6 text-right">
                                       <button onClick={() => handleDelete(item.slug)} 
                                            className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                             <Trash2 size={18} />
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