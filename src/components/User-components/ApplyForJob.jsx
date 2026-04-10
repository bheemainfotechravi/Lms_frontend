import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance.js";
import { useSelector } from "react-redux";
import DashboardNavbar from "../../components/User-components/DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";
import { FaArrowLeft, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function JobApply() {
  const { slug } = useParams(); 
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  const fetchJobDetails = async () => {
    console.log("Current Slug:", slug);
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/company/get_hiring`);
      const allJobs = res.data?.message?.jobs || [];
      const currentJob = allJobs.find((j) => j.slug === slug);
      
      if (currentJob) {
        setJob(currentJob);
      } else {
        toast.error("Job not found");
        navigate("/user/career");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Please upload your resume");

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("user_id", user.id);
      formData.append("resume", resume);
      formData.append("application_type", job?.type || "Job"); 

      await axiosInstance.post(`/student/apply_job/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Applied successfully!");
      navigate("/user/career");
    } catch (error) {
      console.error("Apply Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-[#E3A83C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col text-left">
      <DashboardNavbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-[#E3A83C]">
          <FaArrowLeft /> Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Apply for {job?.job_title}</h1>
          <p className="text-[#E3A83C] font-black text-sm uppercase tracking-widest mt-1">{job?.company}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Applicant</p>
              <p className="font-bold text-slate-700">{user?.first_name}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Email</p>
              <p className="font-bold text-slate-700 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume (PDF)</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center bg-slate-50 hover:border-[#E3A83C]/50 transition-all cursor-pointer">
              <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              {resume ? (
                <>
                  <FaCheckCircle className="text-emerald-500 text-4xl mb-3" />
                  <p className="text-sm font-bold text-slate-700">{resume.name}</p>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-slate-300 text-5xl mb-3" />
                  <p className="text-sm font-bold text-slate-400 italic">Upload your CV</p>
                </>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-[#E3A83C] text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all">
            {submitting ? "Sending..." : "Submit Application"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}