import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Save, Loader2, AlertCircle, Briefcase, FileText } from "lucide-react";
import axiosInstance from "../../utils/axiosinstance";
import { useSelector } from "react-redux";
import DashboardNavbar from "./DashboardNavbar";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const {slug } = useParams();
  const { user: authUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    domain: "tech", 
    pdf: null,   
  });

  const userId = authUser?.id;

  useEffect(() => {
    if (slug) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [slug]);

 const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/student/student-profile/${slug}`);
      
      
      
      const userData = res.data.user; 

      if (userData) {
        setFormData({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || authUser?.email || "",
          mobile: userData.mobile || "",
          domain: userData.domain || "tech",
          
          pdf: userData.resume || null, 
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      
      setFormData(prev => ({
        ...prev,
        firstName: authUser?.first_name || "",
        email: authUser?.email || "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return setMessage({ type: "error", text: "Session expired." });

    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
  
      const data = new FormData();
      data.append("first_name", formData.firstName);
      data.append("last_name", formData.lastName);
      data.append("mobile", formData.mobile);
      data.append("domain", formData.domain);
      
      if (formData.pdf instanceof File) {
        data.append("pdf", formData.pdf); 
      }

      await axiosInstance.patch(`/student/update-student-profile/${slug}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setMessage({ type: "success", text: "Profile and Resume updated successfully!" });
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: "Failed to save changes. Check backend parser." });
    } finally {
      setUpdating(false);
    }
  };

  const getInitial = () => formData.firstName?.charAt(0) || formData.email?.charAt(0) || "U";

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#E3A83C] mb-2" size={40} />
      <p className="text-gray-500 font-bold">Loading Profile...</p>
    </div>
  );

  return (
        <div className="min-h-screen bg-[#F6F1E7] flex flex-col">
          <DashboardNavbar/>
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-[#EAD7B1] shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F172A] p-8 flex flex-col items-center text-white">
          <div className="w-24 h-24 rounded-full bg-[#E3A83C] flex items-center justify-center text-3xl font-black mb-4 border-4 border-white/20">
            {getInitial().toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-gray-400 text-sm font-medium">{formData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              <AlertCircle size={18} />
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><User size={12} /> First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#EAD7B1] outline-none focus:ring-2 focus:ring-[#E3A83C] transition-all" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><User size={12} /> Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#EAD7B1] outline-none focus:ring-2 focus:ring-[#E3A83C] transition-all" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Briefcase size={12} /> Career Domain</label>
              <select name="domain" value={formData.domain} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#EAD7B1] bg-white outline-none focus:ring-2 focus:ring-[#E3A83C]">
                <option value="tech">Technology / IT</option>
                <option value="non-tech">Management / HR</option>
                <option value="medical">Medical / Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Phone size={12} /> Mobile Number</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#EAD7B1] outline-none focus:ring-2 focus:ring-[#E3A83C] transition-all" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><FileText size={12} /> Resume (PDF/DOC)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#F6F1E7] file:text-[#E3A83C] font-bold cursor-pointer" 
                />
                {typeof formData.pdf === 'string' && (
                  <a href={formData.pdf} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E3A83C] underline font-bold whitespace-nowrap">View Current</a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="w-full md:w-auto px-12 py-4 bg-[#0F172A] text-white font-black rounded-2xl hover:bg-[#1e293b] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="text-[#E3A83C]" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;