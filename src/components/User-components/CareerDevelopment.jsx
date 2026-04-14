import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance.js";
import { useSelector } from "react-redux";
import DashboardNavbar from "../../components/User-components/DashboardNavbar.jsx";
import { 
  FaMapMarkerAlt, FaBookmark, FaTelegramPlane, 
  FaMoneyBillWave, FaBriefcase, FaCalendarAlt 
} from "react-icons/fa";
import toast from "react-hot-toast";
import CareerHeader from "./CareerHeader.jsx";
import Footer from "../LandingPage/Footer.jsx";

export default function CareerDevelopment() {
  const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("career");
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
const navigation = useNavigate();
  useEffect(() => {
    fetchAllJobs();
  }, []);


  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/company/get_hiring`);
      const data = res.data?.message?.jobs || []; 
      setAllJobs(data);
      setFilteredJobs(data);
      if (data.length > 0) setSelectedJob(data[0]); 
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  

  const handleSearch = (params) => {
    const { title, location } = params;
    const filtered = allJobs.filter(job => {
      const matchTitle = job.job_title.toLowerCase().includes(title.toLowerCase()) || 
                         (job.company && job.company.toLowerCase().includes(title.toLowerCase()));
      const matchLocation = job.location.toLowerCase().includes(location.toLowerCase());
      return matchTitle && matchLocation;
    });
    setFilteredJobs(filtered);
    setSelectedJob(filtered.length > 0 ? filtered[0] : null);
  };

  const handleFilter = (type) => {
    let sorted = [...filteredJobs];
    if (type === 'date') {
      sorted.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    } else if (type === 'salary') {
      sorted.sort((a, b) => Number(b.salary) - Number(a.salary));
    } else if (type === 'all') {
      sorted = [...allJobs];
    }
    setFilteredJobs(sorted);
    if (sorted.length > 0) setSelectedJob(sorted[0]);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#E3A83C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
     <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <CareerHeader onSearch={handleSearch} onFilterChange={handleFilter} />
      <div className="min-h-screen bg-white font-sans text-left overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex h-[calc(100vh-145px)]">
          
          <div className="w-full md:w-[40%] h-full overflow-y-auto p-4 space-y-4 bg-slate-50/30 no-scrollbar">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => {
                const isLastItem = index === filteredJobs.length - 1;
                return (
                  <div 
                    key={job.slug}
                    onClick={() => setSelectedJob(job)}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative bg-white 
                      ${selectedJob?.slug === job.slug 
                        ? 'border-[#E3A83C] shadow-lg scale-[1.01]' 
                        : 'border-slate-200 hover:border-[#E3A83C]/50'
                      }
                      ${isLastItem ? 'mb-8' : ''}
                    `}
                  >
                    <button className="absolute top-5 right-5 text-slate-300 hover:text-[#E3A83C]">
                      <FaBookmark size={18}/>
                    </button>
                    
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">
                      {job.job_title}
                    </h3>
                    <p className="text-slate-600 text-[10px] mt-1 font-black uppercase tracking-[0.15em]">
                      {job.company || "Skills Sphere Partner"}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 font-medium">
                      <FaMapMarkerAlt size={12} className="text-[#E3A83C]" /> {job.location}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="bg-[#E3A83C]/10 px-3 py-1.5 rounded-xl text-[11px] font-black text-[#E3A83C] border border-[#E3A83C]/20 uppercase">
                        ₹{Number(job.salary).toLocaleString()} / month
                      </div>
                      <div className="bg-rose-50 px-2 py-1 rounded text-[10px] font-black text-rose-600 border border-rose-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                        Ends: {new Date(job.last_date).toLocaleDateString('en-GB')}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[#E3A83C] font-black text-[10px] uppercase tracking-widest bg-[#E3A83C]/5 w-fit px-3 py-1 rounded-lg">
                       <FaTelegramPlane /> Easily apply
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                No matching jobs found
              </div>
            )}
          </div>

          <div className="hidden md:block flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
            {selectedJob ? (
              <div className="flex flex-col h-full border border-slate-200 rounded-[32px] shadow-sm overflow-hidden bg-white">
                <div className="p-8 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{selectedJob.job_title}</h1>
                      <p className="text-[#E3A83C] font-black text-sm uppercase tracking-widest">{selectedJob.company || "Skills Sphere Partner"}</p>
                    </div>
<button 
  className="bg-[#E3A83C] text-white px-12 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#E3A83C]/20 active:scale-95"
  onClick={() => navigation(`/user/apply/${selectedJob.slug}`)} // Yahan exact path dalo
>
  Apply Now
</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Position & Deadline</h4>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 text-slate-800 font-black text-sm bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100">
                           <FaMoneyBillWave className="text-[#E3A83C]" />
                           <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase">Monthly</span><span>₹{Number(selectedJob.salary).toLocaleString()}</span></div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-800 font-black text-sm bg-rose-50/50 px-5 py-4 rounded-2xl border border-rose-100">
                           <FaCalendarAlt className="text-rose-500" />
                           <div className="flex flex-col"><span className="text-[10px] text-rose-400 uppercase">Last Date</span><span>{new Date(selectedJob.last_date).toDateString()}</span></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Full Job Description</h4>
                      <div className="text-slate-600 text-[15px] leading-loose space-y-6 font-medium italic border-l-4 border-[#E3A83C]/30 pl-8">
                          {selectedJob.description.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic uppercase text-[10px] tracking-widest">Select a job to view details</div>
            )}
          </div>

        </div>
      </div>
      <Footer/>
    </>
  );
}