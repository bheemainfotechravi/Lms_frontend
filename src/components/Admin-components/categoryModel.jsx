import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance"; 

function CategoryModal({ isOpen, onClose, onAddCategory }) {
  const [data, setData] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.trim() === "" || !imageFile) return;

    setIsSubmitting(true);
    // console.log("data:", data);
    // console.log("typeof data:", typeof data);
    // console.log("imageFile:", imageFile);
    
    try {
      // 1. Prepare FormData for the backend
      const formData = new FormData();
      console.log("Submitting category with name:",typeof data);
      console.log("Submitting category with image file:", typeof imageFile);
      formData.append("name", data);
      formData.append("icon", imageFile);

      const response = await axiosInstance.post("/category/add", formData);


      onAddCategory(response.data.category || response.data);

      setData("");
      setImageFile(null);
      onClose();
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Error saving category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-black mb-5 text-slate-900">New Category</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
              Category Name
            </label>
            <input
              type="text"
              autoFocus
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g. Cloud Computing"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
              Upload Icon
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;