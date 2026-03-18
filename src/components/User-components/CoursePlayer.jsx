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
  const [pendingLessonIds, setPendingLessonIds] = useState([]);
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

  const totalLessons = allLessons.length;
  const totalDone = completedLessonSet.size;

  // fallback values if api values are not available
  const calculatedRemainingLessons = Math.max(totalLessons - totalDone, 0);
  const calculatedProgress =
    totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  const remainingLessons =
    typeof apiRemainingLessons === "number"
      ? apiRemainingLessons
      : calculatedRemainingLessons;

  const progress =
    typeof apiProgress === "number" && !Number.isNaN(apiProgress)
      ? Math.round(apiProgress)
      : calculatedProgress;

  function getYoutubeEmbed(url) {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&/]+)/;
    const match = url.match(reg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/std_material/${id}`);
      const materials = res.data?.material || [];

      if (!materials.length) {
        setCurriculum([]);
        setCourse(null);
        setActiveLesson(null);
        return;
      }

      const materialLessons = materials.map((m, index) => ({
        id: String(m.id || m.material_id || index + 1),
        title: m.title || `Lesson ${index + 1}`,
        duration: m.duration || "5 min",
        video_url: getYoutubeEmbed(m.youtube_url) || m.video_url || null,
        resources: m.resources || [],
        material_file: m.file_url || null,
        sectionTitle: "Course Lessons",
      }));

      setCurriculum([
        {
          id: 1,
          title: "Course Lessons",
          lectures: materialLessons.length,
          lessons: materialLessons,
        },
      ]);

      setCourse({
        id: String(id),
        title: res.data?.course?.title || "Course Player",
        description:
          res.data?.course?.description || "Course materials and lessons",
        instructor: res.data?.course?.instructor || "Expert Instructor",
        rating: res.data?.course?.rating || 4.8,
        duration: `${materialLessons.length} lessons`,
        what_you_learn: res.data?.course?.what_you_learn || [],
      });

      setExpandedSections({ 1: true });
      setActiveLesson(null);
    } catch (error) {
      console.error("Error loading course materials:", error);
      setCourse(null);
      setCurriculum([]);
      setActiveLesson(null);
    }
  }, [id]);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/course/check-course-progress/${id}`);

      const progressArray = res.data?.progress || [];
      const progressItem = progressArray[0];

      if (!progressItem) {
        setCompletedLessons([]);
        setApiProgress(0);
        setApiRemainingLessons(0);
        setApiStatus("");
        return;
      }

      setCompletedLessons(
        (progressItem.completed_lessons || []).map((item) => String(item))
      );

      setApiRemainingLessons(Number(progressItem.remaining_lessons) || 0);
      setApiProgress(parseFloat(progressItem.progress_percent) || 0);
      setApiStatus(progressItem.status || "");
    } catch (error) {
      console.error("Error fetching progress:", error);
      setCompletedLessons([]);
      setApiProgress(0);
      setApiRemainingLessons(0);
      setApiStatus("");
    }
  }, [id]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCourse(), fetchProgress()]);
    } catch (error) {
      console.error("Error loading course player:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchCourse, fetchProgress]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markLessonComplete = useCallback(
    async (lessonId) => {
      const normalizedLessonId = String(lessonId);

      if (!normalizedLessonId) return;
      if (completedLessons.includes(normalizedLessonId)) return;
      if (pendingLessonIds.includes(normalizedLessonId)) return;

      const updatedCompletedLessons = [
        ...completedLessons,
        normalizedLessonId,
      ];

      setPendingLessonIds((prev) => [...prev, normalizedLessonId]);
      setCompletedLessons(updatedCompletedLessons);

      // optimistic UI update
      const newTotalDone = updatedCompletedLessons.length;
      const newRemaining = Math.max(totalLessons - newTotalDone, 0);
      const newProgress =
        totalLessons > 0 ? Math.round((newTotalDone / totalLessons) * 100) : 0;

      setApiRemainingLessons(newRemaining);
      setApiProgress(newProgress);
      setApiStatus(newRemaining === 0 ? "Completed" : "In Progress");

      try {
        await axiosInstance.patch(`/course/update-course-progress/${id}`, {
          completed_lessons_ids: updatedCompletedLessons,
        });

        await fetchProgress();

        if (updatedCompletedLessons.length === totalLessons && !reviewSubmitted) {
          setShowReviewModal(true);
        }
      } catch (error) {
        console.error("Error updating progress:", error);
        setCompletedLessons((prev) =>
          prev.filter((item) => item !== normalizedLessonId)
        );
        await fetchProgress();
      }
    },
    [completedLessons, pendingLessonIds, id, totalLessons, fetchProgress]
  );

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const selectLesson = async (lesson, sectionTitle) => {
    const lessonWithSection = {
      ...lesson,
      id: String(lesson.id),
      sectionTitle,
    };

    setActiveLesson(lessonWithSection);
    setActiveTab("overview");
    await markLessonComplete(lessonWithSection.id);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin" />
          <p className="text-[#0F172A] font-bold text-sm">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center text-center">
        <div>
          <FaBookOpen className="text-4xl text-[#EAD7B1] mx-auto mb-3" />
          <p className="text-[#0F172A] font-black text-lg">Course not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#E3A83C] text-[#0F172A] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#cf962c] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar user={user} />

      <div className="bg-[#F6F1E7]" style={{ minHeight: "100vh" }}>
        <div className="bg-white border-b border-[#EAD7B1] sticky top-0 z-40 shadow-sm">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate("/user/mycourses")}
              className="text-[#E3A83C] hover:text-[#cf962c]"
            >
              <FaChevronLeft />
            </button>

            <p className="text-[#0F172A] font-black text-sm truncate">
              {course.title}
            </p>
          </div>
        </div>

        <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>
          <div
            className="bg-white border-r border-[#EAD7B1] w-[320px] min-w-[320px] overflow-y-auto sticky top-[57px]"
            style={{ height: "calc(100vh - 57px)" }}
          >
            <div className="px-4 py-4 border-b border-[#EAD7B1] bg-white sticky top-0 z-10">
              <h3 className="text-[#0F172A] font-black text-sm">
                {course.title}
              </h3>

              <p className="text-gray-400 text-xs mt-1">
                {activeLesson?.sectionTitle || "Select a lesson to begin"}
              </p>

              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-[#0F172A]">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full h-2 bg-[#EAD7B1] rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#E3A83C] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-gray-400 text-xs mt-1">
                  {totalDone}/{totalLessons} lessons completed
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  {remainingLessons} remaining
                </p>

                {apiStatus && (
                  <p className="text-[#E3A83C] text-xs mt-1 font-semibold">
                    {apiStatus}
                  </p>
                )}
              </div>
            </div>

            {curriculum.length > 0 ? (
              curriculum.map((section) => (
                <div key={section.id} className="border-b border-[#EAD7B1]">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F6F1E7] transition text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${expandedSections[section.id]
                          ? "bg-[#E3A83C] text-white"
                          : "bg-[#F6F1E7] text-[#0F172A] border border-[#EAD7B1]"
                          }`}
                      >
                        {section.id}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[#0F172A] font-bold text-xs truncate">
                          {section.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {section.lectures} lectures
                        </p>
                      </div>
                    </div>

                    {expandedSections[section.id] ? (
                      <FaChevronUp className="text-[#E3A83C] text-xs ml-2 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 text-xs ml-2 flex-shrink-0" />
                    )}
                  </button>

                  {expandedSections[section.id] && (
                    <div className="bg-[#FDFAF5]">
                      {section.lessons?.map((lesson, index) => {
                        const isActive =
                          String(activeLesson?.id) === String(lesson.id);
                        const isDone = completedLessonSet.has(String(lesson.id));

                        return (
                          <button
                            key={lesson.id || index}
                            onClick={() => selectLesson(lesson, section.title)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-[#EAD7B1] last:border-0 ${isActive
                              ? "bg-[#E3A83C]/10 border-l-2 border-l-[#E3A83C]"
                              : "hover:bg-[#F6F1E7]"
                              }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {isDone ? (
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                  <FaCheck className="text-white text-xs" />
                                </div>
                              ) : isActive ? (
                                <div className="w-5 h-5 rounded-full bg-[#E3A83C] flex items-center justify-center">
                                  <FaPlayCircle className="text-white text-xs" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-[#EAD7B1]" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-semibold truncate ${isActive
                                  ? "text-[#E3A83C]"
                                  : isDone
                                    ? "text-gray-400 line-through"
                                    : "text-[#0F172A]"
                                  }`}
                              >
                                {lesson.title}
                              </p>

                              <div className="flex items-center gap-1.5 mt-0.5">
                                <FaVideo className="text-gray-300 text-xs" />
                                <span className="text-gray-400 text-xs">
                                  {lesson.duration || "—"}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <FaBookOpen className="text-2xl text-[#EAD7B1] mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No curriculum available</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
              <div
                className="relative bg-[#0F172A] w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                {activeLesson ? (
                  activeLesson.video_url ? (
                    <iframe
                      src={activeLesson.video_url}
                      title={activeLesson?.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <p>No video available</p>
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <FaPlayCircle className="text-[#E3A83C] text-3xl" />
                    <p className="text-white font-bold text-sm">
                      Please select a lesson to start
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={goPrev}
                  disabled={!activeLesson || currentIndex <= 0}
                  className="bg-white border border-[#EAD7B1] text-[#0F172A] text-sm font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  onClick={goNext}
                  disabled={
                    !activeLesson || currentIndex === -1
                  }
                  className="bg-[#E3A83C] text-[#0F172A] text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#cf962c] disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="flex gap-1 bg-white rounded-xl border border-[#EAD7B1] p-1 shadow-sm overflow-x-auto">
                {["overview", "notes", "resources", "q&a"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold capitalize transition whitespace-nowrap ${activeTab === tab
                      ? "bg-[#0F172A] text-white shadow"
                      : "text-gray-400 hover:text-[#0F172A] hover:bg-[#F6F1E7]"
                      }`}
                  >
                    {tab === "q&a"
                      ? "Q&A"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                    <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                      About This Course
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {course.description || "No description available."}
                    </p>
                  </div>

                  {course.what_you_learn?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                      <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                        What You'll Learn
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.what_you_learn.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheckCircle className="text-[#E3A83C] text-xs mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                    <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                      Your Instructor
                    </h3>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E3A83C] to-[#0F172A] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                        {course.instructor?.charAt(0) || "I"}
                      </div>

                      <div>
                        <p className="text-[#0F172A] font-black text-sm">
                          {course.instructor}
                        </p>
                        <p className="text-[#E3A83C] text-xs font-semibold">
                          Course Instructor
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-[#E3A83C] text-xs" />
                          <span className="text-gray-500 text-xs">
                            {course.rating} Rating
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                    My Notes
                    {activeLesson && (
                      <span className="text-gray-400 font-normal text-xs">
                        — {activeLesson.title}
                      </span>
                    )}
                  </h3>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your notes for this lesson here..."
                    rows={8}
                    className="w-full bg-[#F6F1E7] border border-[#EAD7B1] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-gray-400 resize-none focus:outline-none focus:border-[#E3A83C] transition"
                  />

                  <div className="flex justify-end mt-3">
                    <button className="bg-[#E3A83C] text-[#0F172A] font-black text-xs px-5 py-2 rounded-xl hover:bg-[#cf962c] transition">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                    Lesson Resources
                  </h3>

                  {activeLesson?.resources?.length > 0 ? (
                    <div className="space-y-2">
                      {activeLesson.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-[#F6F1E7] border border-[#EAD7B1] rounded-xl hover:border-[#E3A83C] transition group"
                        >
                          <FaDownload className="text-[#E3A83C] text-sm" />
                          <span className="text-[#0F172A] text-sm font-semibold group-hover:text-[#E3A83C] transition">
                            {resource.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : activeLesson?.material_file ? (
                    <div className="space-y-2">
                      <a
                        href={activeLesson.material_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#F6F1E7] border border-[#EAD7B1] rounded-xl hover:border-[#E3A83C] transition group"
                      >
                        <FaDownload className="text-[#E3A83C] text-sm" />
                        <span className="text-[#0F172A] text-sm font-semibold group-hover:text-[#E3A83C] transition">
                          Download lesson file
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FaDownload className="text-2xl text-[#EAD7B1] mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        No resources for this lesson
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "q&a" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" />
                    Questions & Answers
                  </h3>

                  <textarea
                    placeholder="Ask a question about this lesson..."
                    rows={4}
                    className="w-full bg-[#F6F1E7] border border-[#EAD7B1] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder-gray-400 resize-none focus:outline-none focus:border-[#E3A83C] transition mb-3"
                  />

                  <div className="flex justify-end mb-6">
                    <button className="bg-[#E3A83C] text-[#0F172A] font-black text-xs px-5 py-2 rounded-xl hover:bg-[#cf962c] transition">
                      Post Question
                    </button>
                  </div>

                  <div className="py-6 text-center border-t border-[#EAD7B1]">
                    <FaQuestionCircle className="text-2xl text-[#EAD7B1] mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      No questions yet. Be the first to ask!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <CourseReviewModal
        isOpen={showReviewModal}
        courseId={id}
        onClose={() => setShowReviewModal(false)}
        onSubmitted={() => {
          setShowReviewModal(false);
          setReviewSubmitted(true);
        }}
      />
    </>
  );
}