import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axiosInstance from "../../utils/axiosinstance.js";
import CourseReviewModal from "./CourseReviewModal.jsx";
import DashboardNavbar from "./DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaBookOpen,
  FaChevronLeft,
  FaStar,
  FaDownload,
  FaQuestionCircle,
  FaCheck,
  FaVideo,
} from "react-icons/fa";
import { FaClipboardList, FaLock } from "react-icons/fa6";

export default function CoursePlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [completedLessons, setCompletedLessons] = useState([]);
  const [apiProgress, setApiProgress] = useState(0);
  const [apiRemainingLessons, setApiRemainingLessons] = useState(0);
  const [apiStatus, setApiStatus] = useState("");

  const allLessons = useMemo(() => {
    return curriculum.flatMap((section) =>
      (section.lessons || []).map((lesson) => ({
        ...lesson,
        sectionTitle: section.title,
      }))
    );
  }, [curriculum]);

  const completedLessonSet = useMemo(
    () => new Set(completedLessons.map((item) => String(item))),
    [completedLessons]
  );

  const currentIndex = allLessons.findIndex(
    (lesson) => String(lesson.id) === String(activeLesson?.id)
  );
   

  // selectLesson function ke thoda niche ye add karein
  const goNext = () => {
    if (!activeLesson) return;
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      selectLesson(nextLesson, nextLesson.sectionTitle);
    }
  };

  const goPrev = () => {
    if (!activeLesson) return;
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      selectLesson(prevLesson, prevLesson.sectionTitle);
    }
  };


  const totalLessons = allLessons.length;
  const totalDone = completedLessonSet.size;

  const calculatedProgress = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  // Final progress logic with Math.round to ensure strict 100% comparison
  const progress = typeof apiProgress === "number" && !Number.isNaN(apiProgress)
      ? Math.round(apiProgress)
      : calculatedProgress;

  const remainingLessons = typeof apiRemainingLessons === "number"
      ? apiRemainingLessons
      : Math.max(totalLessons - totalDone, 0);

  function getYoutubeEmbed(url) {
    if (!url) return null;
    const reg = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/;
    const match = url.match(reg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/std_material/${id}`);
      const materials = res.data?.material || [];
      if (!materials.length) return;

      const materialLessons = materials.map((m, index) => ({
        id: String(m.id || m.material_id || index + 1),
        title: m.title || `Lesson ${index + 1}`,
        duration: m.duration || "5 min",
        video_url: getYoutubeEmbed(m.youtube_url) || m.video_url || null,
        resources: m.resources || [],
        material_file: m.file_url || null,
      }));

      setCurriculum([{ id: 1, title: "Course Lessons", lectures: materialLessons.length, lessons: materialLessons }]);
      setCourse({
        id: String(id),
        title: res.data?.course?.title || "Course Player",
        description: res.data?.course?.description || "Course materials",
        instructor: res.data?.course?.instructor || "Expert Instructor",
        rating: res.data?.course?.rating || 4.8,
        what_you_learn: res.data?.course?.what_you_learn || [],
      });
      setExpandedSections({ 1: true });
    } catch (error) {
      console.error("Error loading course:", error);
    }
  }, [id]);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/course/check-course-progress/${id}`);
      const progressArray = res.data?.progress || [];
      const progressItem = progressArray[progressArray.length - 1];

      if (!progressItem) {
        setCompletedLessons([]);
        setApiProgress(0);
        return;
      }

      setCompletedLessons((progressItem.completed_lessons || []).map(String));
      setApiProgress(Math.min(100, Math.round(parseFloat(progressItem.progress_percent) || 0)));
      setApiRemainingLessons(Math.max(0, Number(progressItem.remaining_lessons)));
      setApiStatus(progressItem.status || "");
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [id]);

  const markLessonComplete = useCallback(async (lessonId) => {
    const normalizedId = String(lessonId);
    if (!normalizedId || completedLessons.includes(normalizedId)) return;

    const updatedList = [...completedLessons, normalizedId];
    setCompletedLessons(updatedList);

    try {
      await axiosInstance.patch(`/course/update-course-progress/${id}`, { completed_lessons_ids: updatedList });
      fetchProgress();
      if (updatedList.length >= totalLessons && !reviewSubmitted) setShowReviewModal(true);
    } catch (error) {
      fetchProgress();
    }
  }, [completedLessons, id, totalLessons, fetchProgress, reviewSubmitted]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourse(), fetchProgress()]);
      setLoading(false);
    };
    loadData();
  }, [fetchCourse, fetchProgress]);

  const selectLesson = async (lesson, sectionTitle) => {
    setActiveLesson({ ...lesson, sectionTitle });
    setActiveTab("overview");
    await markLessonComplete(lesson.id);
  };

  if (loading) return <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center animate-pulse text-sm font-bold">Loading course...</div>;
  if (!course) return <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center font-black">Course not found</div>;

  return (
    <>
      <DashboardNavbar user={user} />
      <div className="bg-[#F6F1E7]" style={{ minHeight: "100vh" }}>
        <div className="bg-white border-b border-[#EAD7B1] sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/user/mycourses")} className="text-[#E3A83C]"><FaChevronLeft /></button>
          <p className="text-[#0F172A] font-black text-sm truncate">{course.title}</p>
        </div>

        <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>
          {/* Sidebar */}
          <div className="bg-white border-r border-[#EAD7B1] w-[320px] min-w-[320px] overflow-y-auto sticky top-[57px]" style={{ height: "calc(100vh - 57px)" }}>
            <div className="px-4 py-4 border-b border-[#EAD7B1] bg-white sticky top-0 z-10">
              <h3 className="text-[#0F172A] font-black text-sm">{course.title}</h3>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#EAD7B1] rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-[#E3A83C] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-gray-400 text-[10px] mt-1 uppercase font-bold">{totalDone}/{totalLessons} lessons done • {remainingLessons} left</p>
              </div>
            </div>

            {curriculum.map((section) => (
              <div key={section.id} className="border-b border-[#EAD7B1]">
                <button onClick={() => setExpandedSections(p => ({...p, [section.id]: !p[section.id]}))} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F6F1E7]">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${expandedSections[section.id] ? "bg-[#E3A83C] text-white" : "bg-slate-100"}`}>{section.id}</div>
                    <p className="text-[#0F172A] font-bold text-xs">{section.title}</p>
                  </div>
                  {expandedSections[section.id] ? <FaChevronUp className="text-[#E3A83C] text-xs" /> : <FaChevronDown className="text-gray-400 text-xs" />}
                </button>

                {expandedSections[section.id] && (
                  <div className="bg-[#FDFAF5]">
                    {section.lessons?.map((lesson) => {
                      const isActive = activeLesson && String(activeLesson.id) === String(lesson.id);
                      const isDone = completedLessons.includes(String(lesson.id));
                      return (
                        <button key={lesson.id} onClick={() => selectLesson(lesson, section.title)} className={`w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-[#EAD7B1] last:border-0 ${isActive ? "bg-[#E3A83C]/10 border-l-2 border-l-[#E3A83C]" : ""}`}>
                          <div className="mt-0.5">{isDone ? <FaCheckCircle className="text-green-500 text-sm" /> : isActive ? <FaPlayCircle className="text-[#E3A83C] text-sm" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#EAD7B1]" />}</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${isActive ? "text-[#E3A83C]" : isDone ? "text-gray-400" : "text-[#0F172A]"}`}>{lesson.title}</p>
                            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400"><FaVideo /><span>{lesson.duration}</span></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* STRICT 100% PROGRESS CHECK FOR ASSIGNMENT */}
                <button
                  onClick={() => progress >= 100 && navigate(`/quiz/${id}`)}
                  disabled={progress < 100}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-left border-t border-[#EAD7B1] transition ${progress >= 100 ? "hover:bg-[#F6F1E7]" : "opacity-60 cursor-not-allowed bg-gray-50"}`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {progress >= 100 ? <FaClipboardList className="text-[#E3A83C] text-sm" /> : <FaLock className="text-gray-400 text-sm" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-[#0F172A]">Final Assignment</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{progress >= 100 ? "Unlocked • Start Now" : "Locked • Finish all lessons"}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-[#0F172A] w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
                {activeLesson?.video_url ? <iframe src={activeLesson.video_url} className="w-full h-full" allowFullScreen title="video" /> : 
                  <div className="h-full flex flex-col items-center justify-center text-white gap-2 opacity-50"><FaPlayCircle size={40} /><p>Select a lesson to begin</p></div>
                }
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={goPrev} disabled={!activeLesson || currentIndex <= 0} className="bg-white border border-[#EAD7B1] text-sm font-bold px-6 py-2.5 rounded-xl disabled:opacity-30">Previous</button>
                <button onClick={goNext} disabled={!activeLesson || currentIndex >= allLessons.length - 1} className="bg-[#E3A83C] text-[#0F172A] text-sm font-bold px-6 py-2.5 rounded-xl disabled:opacity-30">Next Lesson</button>
              </div>

              <div className="flex gap-2 bg-white rounded-xl border border-[#EAD7B1] p-1 shadow-sm overflow-x-auto">
                {["overview", "notes", "resources"].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-black uppercase transition ${activeTab === t ? "bg-[#0F172A] text-white" : "text-gray-400 hover:bg-[#F6F1E7]"}`}>{t}</button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm min-h-[200px]">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest text-[#E3A83C]">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                  </div>
                )}
                {activeTab === "notes" && (
                   <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lesson specific notes..." rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none" />
                )}
                {activeTab === "resources" && (
                  <div className="space-y-3">
                    {activeLesson?.resources?.length > 0 ? activeLesson.resources.map((r, i) => (
                      <a key={i} href={r.url} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-xs"><FaDownload /> {r.name}</a>
                    )) : <p className="text-gray-400 text-center py-10 italic">No resources available for this lesson.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CourseReviewModal isOpen={showReviewModal} courseId={id} onClose={() => setShowReviewModal(false)} onSubmitted={() => { setShowReviewModal(false); setReviewSubmitted(true); }} />
    </>
  );
}