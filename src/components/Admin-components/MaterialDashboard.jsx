import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { Plus, Trash2, Clock, HelpCircle } from "lucide-react"; 

export default function MaterialDashboard({ isOpen, onClose, course }) {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("materials"); 

  
  const [quizDuration, setQuizDuration] = useState(300); 
  const [quizQuestions, setQuizQuestions] = useState([
    { questions: "", options: ["", "", "", ""], correct: 0 }
  ]);

  const [stagedItems, setStagedItems] = useState([
    { title: "", material_type: "pdf", link: "", file: null }
  ]);

  useEffect(() => {
    if (isOpen && course?.id) fetchMaterials();
  }, [isOpen, course]);

  const fetchMaterials = async () => {
    try {
      const res = await axiosInstance.get(`/std_material/${course.id}`);
      if (res.data.success) {
        setMaterials(res.data.material || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMaterials([]);
    }
  };

  
  const addQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, { questions: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const removeQuizQuestion = (index) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handleQuizInputChange = (qIndex, field, value) => {
    const updated = [...quizQuestions];
    updated[qIndex][field] = value;
    setQuizQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[optIndex] = value;
    setQuizQuestions(updated);
  };

const submitAssessment = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    console.log(course.id)
    const payload = {
      
      course_id: Number(course.id), 
      duration_second: Number(quizDuration),
      assessment_data: quizQuestions.map(q => ({
        question: q.questions, 
        options: q.options,
        correct_options:(q.correct)
      }))
    };

    console.log("FINAL PAYLOAD ATTEMPT:", payload);

    const res = await axiosInstance.post(`/assessment/add_assessment/${course.id}`, payload);

    if (res.data.success) {
      alert("Assessment saved successfully!");
      setActiveTab("materials");
    }
  } catch (err) {
    console.error("Submission Error Details:", err.response?.data);
    setError(err.response?.data?.message || "Check console for details");
  } finally {
    setIsLoading(false);
  }
};
  
  const addMoreItems = () => {
    setStagedItems([...stagedItems, { title: "", material_type: "pdf", link: "", file: null }]);
  };

  const removeItem = (index) => {
    setStagedItems(stagedItems.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...stagedItems];
    updated[index][field] = value;
    setStagedItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const uploadPromises = stagedItems.map(async (item) => {
        const payload = new FormData();
        payload.append("course_title", course.title);
        payload.append("course_id", course.id);
        payload.append("title", item.title);
        payload.append("material_type", item.material_type);

        if (item.material_type === "link") {
          payload.append("link", item.link);
        } else {
          if (!item.file) throw new Error(`Please upload a PDF for "${item.title}"`);
          payload.append("pdf", item.file);
        }
        return axiosInstance.post("/std_material/new", payload);
      });

      await Promise.all(uploadPromises);
      setStagedItems([{ title: "", material_type: "pdf", link: "", file: null }]);
      setShowForm(false);
      fetchMaterials();
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
            <h2 className="text-xl font-bold text-slate-800">Management Dashboard</h2>
            <div className="flex gap-4 mt-2">
                <button 
                    onClick={() => setActiveTab("materials")}
                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === "materials" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent"}`}
                >
                    Course Content
                </button>
                <button 
                    onClick={() => setActiveTab("assessment")}
                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === "assessment" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent"}`}
                >
                    Final Assessment
                </button>
            </div>
          </div>
          <div className="flex gap-3">
            {activeTab === "materials" && (
                <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                + Add Materials
                </button>
            )}
            <button onClick={onClose} className="text-slate-400 text-3xl hover:text-slate-600">&times;</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "materials" ? (
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
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-4 px-4 font-bold text-slate-700">{m.title}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          m.material_type === 'pdf' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {m.material_type === 'pdf' ? 'Doc' : 'Video'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs truncate max-w-[200px]">
                        <a href={m.file_url || m.youtube_url} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                          View {m.material_type === 'pdf' ? 'Document' : 'Video'}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-400 text-xs">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <p className="text-sm font-medium text-slate-400">No content added yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="max-w-3xl mx-auto py-4">
               <div className="bg-indigo-50 p-6 rounded-2xl mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-indigo-900">Quiz Settings</h3>
                    <p className="text-xs text-indigo-600">This assessment will appear at the end of the course.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-indigo-900 uppercase">Duration (Sec):</label>
                    <input 
                        type="number" 
                        value={quizDuration} 
                        onChange={(e) => setQuizDuration(e.target.value)}
                        className="w-20 p-2 rounded-lg border border-indigo-200 text-sm font-bold focus:outline-indigo-500"
                    />
                  </div>
               </div>

               <form onSubmit={submitAssessment} className="space-y-8">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/30 relative">
                        <button 
                            type="button" 
                            onClick={() => removeQuizQuestion(qIndex)}
                            className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="mb-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Question {qIndex + 1}</label>
                            <input 
                                type="text" 
                                required
                                value={q.questions}
                                onChange={(e) => handleQuizInputChange(qIndex, 'questions', e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500 font-bold"
                                placeholder="Enter question string..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                    <input 
                                        type="radio" 
                                        name={`correct-${qIndex}`}
                                        checked={q.correct === oIndex}
                                        onChange={() => handleQuizInputChange(qIndex, 'correct', oIndex)}
                                        className="w-4 h-4 accent-indigo-600"
                                    />
                                    <input 
                                        type="text" 
                                        required
                                        value={opt}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs outline-indigo-500"
                                        placeholder={`Option ${oIndex + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                  ))}

                  <div className="flex gap-4">
                    <button 
                        type="button" 
                        onClick={addQuizQuestion}
                        className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all"
                    >
                        + Add More Question
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg disabled:bg-slate-300"
                    >
                        {isLoading ? "Saving Assessment..." : "Save Assessment"}
                    </button>
                  </div>
               </form>
            </div>
          )}
        </div>

        {/* Existing Material Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Add Materials</h3>
              {error && <p className="bg-red-50 text-red-500 p-3 mb-4 text-xs rounded-lg">{error}</p>}
              
              <form onSubmit={handleSubmit} className="overflow-y-auto pr-2 space-y-6">
                {stagedItems.map((item, index) => (
                  <div key={index} className="p-4 border border-slate-100 rounded-2xl relative bg-slate-50/50">
                    {stagedItems.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full w-6 h-6 text-xs shadow-sm">✕</button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Topic Title" required 
                        className="w-full border p-2.5 rounded-xl text-sm outline-indigo-500"
                        value={item.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} 
                      />
                      <select 
                        className="w-full border p-2.5 rounded-xl text-sm"
                        value={item.material_type} onChange={(e) => handleInputChange(index, 'material_type', e.target.value)}
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="link">YouTube Link</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      {item.material_type === "link" ? (
                        <input 
                          type="url" placeholder="Paste YouTube Link" required 
                          className="w-full border p-2.5 rounded-xl text-sm outline-indigo-500"
                          value={item.link} onChange={(e) => handleInputChange(index, 'link', e.target.value)} 
                        />
                      ) : (
                        <div className="flex items-center gap-4">
                           <label className="text-xs font-bold text-slate-500">Upload PDF:</label>
                           <input 
                            type="file" 
                            accept=".pdf" 
                            required 
                            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                            onChange={(e) => handleInputChange(index, 'file', e.target.files[0])} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  type="button" onClick={addMoreItems}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-colors"
                >
                  + Add Another Row
                </button>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:bg-slate-300">
                    {isLoading ? "Uploading..." : `Upload ${stagedItems.length} Item(s)`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}