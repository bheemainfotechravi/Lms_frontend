import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosinstance.js";
import CourseReviewModal from "./CourseReviewModal.jsx";
import DashboardNavbar from "./DashboardNavbar.jsx";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5"; // Added for close button
import Footer from "../LandingPage/Footer.jsx";
import {
  FaPlayCircle, FaCheckCircle, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaDownload, FaVideo
} from "react-icons/fa";
import { FaClipboardList, FaLock } from "react-icons/fa6";
import LectureNotAvailable from "./LectureNotAvailable.jsx";

export default function CoursePlayer() {
  const { id: slug } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ 1: true });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [completedLessons, setCompletedLessons] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [apiProgress, setApiProgress] = useState(0);

  // --- Helpers & Logic ---
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const reg = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/;
    const match = url.match(reg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const allLessons = useMemo(() => {
    return curriculum.flatMap((section) =>
      (section.lessons || []).map((lesson) => ({
        ...lesson,
        sectionTitle: section.title,
      }))
    );
  }, [curriculum]);

  const currentIndex = allLessons.findIndex(
    (lesson) => String(lesson.id) === String(activeLesson?.id)
  );

  const totalLessons = allLessons.length;
  const progress = apiProgress;
  

const fetchProgress = useCallback(async () => {
  try {
    const res = await axiosInstance.get(`/course/${slug}/progress`);
 

    if (res.data.success) {
      const data = res.data.data;
      setApiProgress(Math.round(parseFloat(data.progress) || 0));
      setCompletedCount(data.completed || 0);
    }
  } catch (error) {
    console.error("Progress sync failed:", error);
  }
}, [slug]);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/std_material/${slug}`);
      const materials = res.data?.message.material || [];
      if (materials.length > 0) {
        const materialLessons = materials.map((m, index) => ({
          id: String(m.id || m.material_id),
          title: m.title || `Lesson ${index + 1}`,
          duration: m.duration || "Video",
          video_url: getYoutubeEmbed(m.youtube_url) || m.file_url || null,
          resources: m.resources || [],
        }));
        setCurriculum([{ id: 1, title: "Course Content", lessons: materialLessons }]);
        setCourse({
          title: res.data?.course?.title || "Course Player",
          description: res.data?.course?.description || "No description available",
        });
        if (!activeLesson) setActiveLesson(materialLessons[0]);
      }
    } catch (error) {
      console.error(error);
      setCourse(null);
      setCurriculum([]);
    }
  }, [slug, activeLesson]);

  const markLessonComplete = useCallback(async (lessonId) => {
    const normalizedId = String(lessonId);
    if (loading || !curriculum.length || completedLessons.includes(normalizedId)) return;

    const updatedList = [...completedLessons, normalizedId];
    setCompletedLessons(updatedList);

    try {
      const res = await axiosInstance.post(`/course/${slug}/complete_material`, {
        material_id: normalizedId
      });
      if (res.data.success) {
        const serverProgress = parseFloat(res.data.data.progress) || 0;
        setApiProgress(Math.round(serverProgress));
        if (Array.isArray(res.data.message.completed_lessons)) {
          setCompletedLessons(res.data.message.completed_lessons.map(id => String(id)));
        }
        if (Math.round(serverProgress) >= 100 && !reviewSubmitted) {
          setShowReviewModal(true);
        }
      }
    } catch (error) {
      fetchProgress();
    }
  }, [completedLessons, slug, fetchProgress, reviewSubmitted, loading, curriculum]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourse(), fetchProgress()]);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  const selectLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveTab("overview");
    markLessonComplete(lesson.id);
    setShowSidebar(false); 
  };

  const goNext = () => {
    if (currentIndex < allLessons.length - 1) selectLesson(allLessons[currentIndex + 1]);
  };

  const goPrev = () => {
    if (currentIndex > 0) selectLesson(allLessons[currentIndex - 1]);
  };

  if (loading) return <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center font-bold text-slate-500 uppercase tracking-widest">Syncing Progress...</div>;

  return (
    <>
      <DashboardNavbar user={user} />
      <div className="bg-[#F6F1E7] min-h-screen relative overflow-x-hidden">
        
        {/* TOP NAV BAR */}
        <div className="bg-white border-b border-[#EAD7B1] sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowSidebar(true)} className="lg:hidden font-bold text-[#E3A83C] hover:scale-110 transition">
            <CgMenuRight size={22} />
          </button>
          <button onClick={() => navigate("/user/mycourses")} className="text-[#E3A83C] hover:scale-110 transition">
            <FaChevronLeft />
          </button>
          <p className="text-[#0F172A] font-black text-sm truncate uppercase tracking-tight">
            {course?.title || "Course Player"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 57px)" }}>
          
          {/* MOBILE OVERLAY */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-[49] lg:hidden transition-opacity"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* SIDEBAR (Drawer logic) */}
          <div className={`
            fixed lg:sticky top-0 lg:top-[57px] left-0 h-full lg:h-[calc(100vh-57px)] 
            bg-white border-r border-[#EAD7B1] w-[280px] sm:w-[350px] z-[50] lg:z-30
            transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto
          `}>
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end p-5 border-b border-[#EAD7B1]">
                <button onClick={() => setShowSidebar(false)}><IoClose size={26} className="text-amber-500" /></button>
            </div>

            <div className="p-5 border-b border-[#EAD7B1] bg-slate-50/50">
              <div className="flex justify-between text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">
                <span>Course Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#EAD7B1] rounded-full overflow-hidden border border-white">
                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                {completedCount} OF {totalLessons} LESSONS
              </p>
            </div>

            {curriculum.map((section) => (
              <div key={section.id}>
                <button onClick={() => setExpandedSections(p => ({...p, [section.id]: !p[section.id]}))} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                  <span className="text-[#0F172A] font-black text-xs uppercase tracking-widest">{section.title}</span>
                  {expandedSections[section.id] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>

                {expandedSections[section.id] && (
                  <div className="bg-slate-50/30">
                    {section.lessons?.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isDone = completedLessons.includes(String(lesson.id));
                      return (
                        <button key={lesson.id} onClick={() => selectLesson(lesson)} className={`w-full flex items-start gap-3 px-5 py-4 text-left transition border-b border-[#EAD7B1]/30 last:border-0 ${isActive ? "bg-white border-l-4 border-l-[#E3A83C] shadow-sm" : ""}`}>
                          <div className="mt-0.5">{isDone ? <FaCheckCircle className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-[#EAD7B1]" />}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${isActive ? "text-[#E3A83C]" : isDone ? "text-gray-400" : "text-[#0F172A]"}`}>{lesson.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-bold uppercase"><FaVideo size={10} /><span>{lesson.duration}</span></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => progress >= 100 && navigate(`/quiz/${slug}`)}
              disabled={progress < 100}
              className={`w-full flex items-center gap-4 px-6 py-5 border-t border-[#EAD7B1] transition ${progress >= 100 ? "bg-indigo-50 hover:bg-indigo-100" : "opacity-50 cursor-not-allowed bg-gray-100"}`}
            >
              {progress >= 100 ? <FaClipboardList className="text-indigo-600" /> : <FaLock className="text-gray-400" />}
              <div className="text-left">
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-tighter">Final Assignment</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">{progress >= 100 ? "Ready to Start" : "Unlock at 100%"}</p>
              </div>
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 lg:h-[calc(100vh-57px)] overflow-y-auto p-4 lg:p-8">
            {!course ? (
              <div className="h-full flex items-center justify-center">
                <LectureNotAvailable />
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-[#0F172A] rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video relative">
                  {activeLesson?.video_url ? (
                    <iframe src={activeLesson.video_url} className="w-full h-full" allowFullScreen title="video" allow="autoplay; encrypted-media" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                      <FaPlayCircle size={60} className="animate-pulse" />
                      <p className="font-black uppercase tracking-widest text-xs">Select a topic to start learning</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex gap-2">
                    <button onClick={goPrev} disabled={currentIndex <= 0} className="bg-white border border-[#EAD7B1] text-xs font-black uppercase px-6 py-3 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition">Prev</button>
                    <button onClick={goNext} disabled={currentIndex >= allLessons.length - 1} className="bg-[#E3A83C] text-[#0F172A] text-xs font-black uppercase px-6 py-3 rounded-2xl hover:shadow-lg disabled:opacity-30 transition">Next</button>
                  </div>
                  <div className="flex gap-2 bg-white rounded-2xl border border-[#EAD7B1] p-1.5 shadow-sm">
                    {["overview", "notes", "resources"].map((t) => (
                      <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? "bg-[#0F172A] text-white shadow-lg" : "text-gray-400 hover:text-slate-600"}`}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-[#EAD7B1] p-8 shadow-sm">
                  {activeTab === "overview" && (
                    <div>
                      <h3 className="font-black text-[#E3A83C] uppercase text-xs tracking-[0.2em] mb-4">Lesson Context</h3>
                      <h2 className="text-[#0F172A] font-black text-xl mb-4 leading-tight">{activeLesson?.title}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
                    </div>
                  )}
                  {activeTab === "notes" && (
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Type notes here..." rows={8} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none transition-all" />
                  )}
                  {activeTab === "resources" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeLesson?.resources?.length > 0 ? activeLesson.resources.map((r, i) => (
                        <a key={i} href={r.url} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                          <span className="font-bold text-xs text-slate-700 truncate">{r.name}</span>
                          <FaDownload className="text-indigo-500 group-hover:scale-110 transition" />
                        </a>
                      )) : <p className="text-gray-400 text-sm italic py-10 text-center w-full">No downloadable materials.</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <CourseReviewModal 
        isOpen={showReviewModal} 
        courseId={slug} 
        onClose={() => setShowReviewModal(false)} 
        onSubmitted={() => { setShowReviewModal(false); setReviewSubmitted(true); }} 
      />
    </>
  );
}