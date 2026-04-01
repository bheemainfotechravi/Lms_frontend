import { useEffect, useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance"; 

export default function UpdateCourseModal({
  isOpen,
  onClose,
  course,
  onRefresh, 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    level: "",
    language: "",
    duration: "",
    total_lectures: "",
    category_name: "", 
    is_published: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        short_description: course.short_description || "",
        price: course.price || "",
        level: course.level || "",
        language: course.language || "",
        duration: course.duration || "",
        total_lectures: course.total_lectures || "",
        category_name: course.category_name || "",
        is_published: course.is_published === 1, 
      });
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    setIsUpdating(true);
    const loadingToast = toast.loading("Updating records...");

    try {
      
      const res = await axiosInstance.patch(`/user/course/update/${course.slug}`, formData); 
      
      if (res.data.success) {
        toast.success("Course synced successfully!", { id: loadingToast });
        if(onRefresh) onRefresh(); 
        onClose(); 
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4">
      <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Update Course</h2>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 italic">
              Category: {formData.category_name} (Fixed)
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
            <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Syllabus / Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Language" className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" />
             <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" />
             <input type="number" name="total_lectures" value={formData.total_lectures} onChange={handleChange} placeholder="Lectures" className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit cursor-pointer" onClick={() => setFormData(p => ({...p, is_published: !p.is_published}))}>
            <div className={`w-10 h-5 rounded-full transition-all relative ${formData.is_published ? 'bg-emerald-500' : 'bg-slate-300'}`}>
               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_published ? 'right-1' : 'left-1'}`} />
            </div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 cursor-pointer">Live Deployment (Published)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Discard</button>
            <button type="submit" disabled={isUpdating} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95 transition-all">
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {isUpdating ? "Syncing..." : "Commit Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}