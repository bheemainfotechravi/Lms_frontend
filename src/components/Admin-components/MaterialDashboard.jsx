import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";

export default function MaterialDashboard({ isOpen, onClose, course }) {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    material_type: "pdf",
    link: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen && course?.id) fetchMaterials();
  }, [isOpen, course]);

  const fetchMaterials = async () => {
    try {
      const res = await axiosInstance.get(`/std_material/${course.id}`);
      // UPDATE: Tera response structure res.data.material hai
      if (res.data.success) {
        setMaterials(res.data.material || []);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMaterials([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("material_type", formData.material_type);
      payload.append("course_title", course.title);

      if (formData.material_type === "pdf") {
        if (!selectedFile) throw new Error("Please select file .");
        payload.append("file", selectedFile);
      } else {
        if (!formData.link) throw new Error("Please enter Youtube link .");
        payload.append("link", formData.link);
      }

      const response = await axiosInstance.post("/std_material/new", payload);
      
      if (response.data.success) {
        setFormData({ title: "", material_type: "pdf", link: "" });
        setSelectedFile(null);
        setShowForm(false);
        fetchMaterials(); // Reload table
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{course?.title}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
              + Add Topic
            </button>
            <button onClick={onClose} className="text-slate-400 text-3xl hover:text-slate-600">&times;</button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left">
            <thead className="border-b text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="pb-4 px-4">Topic Name</th>
                <th className="pb-4 px-4">Type</th>
                <th className="pb-4 px-4">Content</th>
                <th className="pb-4 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {materials.length > 0 ? (
                materials.map((m, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-700">{m.title}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        m.material_type === 'pdf' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {m.material_type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs truncate max-w-[200px]">
                      {m.material_type === 'pdf' ? (
                        <span className="text-slate-500">{m.file_url}</span>
                      ) : (
                        <a href={m.youtube_url} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                          View Video
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-400 text-xs">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 italic">No data found in this course.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-800">New Content</h3>
              {error && <p className="bg-red-50 text-red-500 p-2 text-xs rounded-lg">{error}</p>}
              
              <input type="text" placeholder="Title (e.g. Lecture 1)" required className="w-full border p-3 rounded-xl outline-indigo-500"
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />

              <select className="w-full border p-3 rounded-xl"
                value={formData.material_type} onChange={(e) => setFormData({...formData, material_type: e.target.value})}>
                <option value="pdf">PDF Document</option>
                <option value="video">Video / YouTube Link</option>
              </select>

              {formData.material_type === "pdf" ? (
                <input type="file" accept=".pdf" required className="text-xs" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} />
              ) : (
                <input type="url" placeholder="Paste YouTube Link" required className="w-full border p-3 rounded-xl outline-indigo-500"
                  value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">
                  {isLoading ? "Saving..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}