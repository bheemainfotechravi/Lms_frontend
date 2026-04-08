import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Plus, Edit3, Trash2, BookOpen, 
  Layers, CheckCircle2, XCircle, AlertCircle, Loader2
} from "lucide-react";
import CourseModal from "../../components/Admin-components/CourseModel";
import TopNavbar from "../../components/Admin-components/TopNavbar";
import axiosInstance from "../../utils/axiosinstance";
import UpdateCourseModal from "../../components/Admin-components/UpdateCourseModal";
import MaterialDashboard from "../../components/Admin-components/MaterialDashboard";
import toast from "react-hot-toast";

export default function CoursePage() {
  const [course, setCourse] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openMaterialView, setOpenMaterialView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    showCourse();
  }, []);

  const showCourse = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("admin/course/get");
      if (res.data?.success && Array.isArray(res.data.message.courses)) {
        setCourse(res.data.message.courses);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error("Failed to sync courses from server");
    } finally {
      setIsLoading(false);
    }
  };

  
  const deleteCourse = (slug, title) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-2 rounded-xl">
            <Trash2 size={20} className="text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 text-sm uppercase tracking-tight">
              Delete Course?
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              "{title}" ({slug}) will be wiped.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(slug); 
            }}
            className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
          >
            Confirm Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { 
      duration: 6000, 
      position: 'top-center', 
      style: { borderRadius: '28px', padding: '20px', border: '1px solid #F1F5F9' } 
    });
  };

  
  const executeDelete = async (slug) => {
    const loadingToast = toast.loading("Processing deletion...", {
      style: { borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }
    });

    try {
      
      const res = await axiosInstance.delete(`admin/course/delete/${slug}`);
      
      if (res.data.success) {
        setCourse((prev) => prev.filter((c) => c.slug !== slug));
        toast.success("Course removed successfully", { id: loadingToast, icon: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cloud sync failed", { id: loadingToast });
    }
  };

  const handleAddCourse = () => {
    showCourse(); 
    toast.success("New Course Added!");
  };

  const handleUpdateCourse = async (slug, data) => {
    const loadingToast = toast.loading("Updating course...");
    try {
      const res = await axiosInstance.patch(`admin/course/update/${slug}`, data);
      if (res.data.success) {
        toast.success("Course updated!", { id: loadingToast });
        showCourse(); 
        setUpdateModalOpen(false);
        setSelectedCourse(null);
      }
    } catch (error) {
      toast.error("Update failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Courses</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Management Portal</p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={18} /> Add New Course
          </button>
        </header>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Info & Slug</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} />
                    </td>
                  </tr>
                ) : course.length > 0 ? (
                  course.map((c) => (
                    <tr key={c.slug} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 min-w-[300px]">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                            {c.thumbnail ? (
                              <img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <BookOpen size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase leading-tight line-clamp-1">{c.title}</p>
                            {/* Showing SLUG here instead of ID */}
                            <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter ">{c.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-center">
                        <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                          {c.category_name || "General"}
                        </span>
                      </td>

                      <td className="p-6 text-center text-sm font-black text-slate-700 uppercase">
                         ₹{c.price}
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex justify-center">
                          {Number(c.is_published) === 1 ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                              <CheckCircle2 size={12} /> Published
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                              <XCircle size={12} /> Draft
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setSelectedCourse(c); setOpenMaterialView(true); }}
                            className="p-2.5 text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all border border-amber-100"
                            title="Manage Materials"
                          >
                            <Layers size={18} />
                          </button>
                          <button
                            onClick={() => { setSelectedCourse(c); setUpdateModalOpen(true); }}
                            className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100"
                            title="Edit Course"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            
                            onClick={() => deleteCourse(c.slug, c.title)}
                            className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                            title="Delete Course"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-32 text-center text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CourseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddCourse={handleAddCourse}
        />

        {selectedCourse && (
          <>
            <UpdateCourseModal
              isOpen={updateModalOpen}
              onClose={() => { setUpdateModalOpen(false); setSelectedCourse(null); }}
              course={selectedCourse}
              onUpdate={handleUpdateCourse}
            />
            <MaterialDashboard
              isOpen={openMaterialView}
              onClose={() => { setOpenMaterialView(false); setSelectedCourse(null); }}
              course={selectedCourse}
            />
          </>
        )}
      </main>
    </div>
  );
}