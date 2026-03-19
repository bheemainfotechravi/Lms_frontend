import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axiosInstance from "../../utils/axiosinstance.js";
import DashboardNavbar from "./DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";
import {
  FaPlayCircle, FaCheckCircle, FaChevronDown, FaChevronUp,
  FaBookOpen, FaClock, FaChevronLeft, FaChevronRight,
  FaStar, FaDownload, FaQuestionCircle,
  FaBars, FaTimes, FaCircle, FaCheck, FaVideo,
} from "react-icons/fa";

export default function CoursePlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
  fetchCourse();
  fetchCourseDetails();
}, [id]);

  function getYoutubeEmbed(url) {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(reg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/std_material/${id}`);

      const materials = res.data.material || [];

      const lessons = materials.map((m, index) => ({
        title: m.title,
        duration: "5 min",
        video_url: getYoutubeEmbed(m.youtube_url),
        sectionTitle: "Course Lessons"
      }));

      const formattedCurriculum = [
        {
          id: 1,
          title: "Course Lessons",
          lectures: lessons.length,
          lessons
        }
      ];

      setCourse({
        id,
        title: "Course Player",
        description: "Course materials and lessons",
        instructor: "Expert Instructor",
        rating: 4.8,
        duration: `${lessons.length} lessons`,
        what_you_learn: []
      });

      setCurriculum(formattedCurriculum);

      if (lessons.length > 0) {
        setExpandedSections({ 1: true });
        setActiveLesson(lessons[0]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails= async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(`/course/get/${id}`);

    const data = res.data.course;

    if (!data) return;

    // Format sections for sidebar
    const formattedCurriculum = data.sections.map((section) => ({
      id: section.id,
      title: section.title,
      lectures: section.lessons.length,
      lessons: section.lessons.map((lesson) => ({
        title: lesson.title,
        duration: lesson.duration || "5 min",
        video_url: lesson.youtube_url
          ? getYoutubeEmbed(lesson.youtube_url)
          : lesson.video_url || null,
        sectionTitle: section.title
      }))
    }));

    // Set course details
    setCourse({
      id: data.id,
      title: data.title,
      description: data.description,
      instructor: data.instructor || "Instructor",
      rating: data.rating || 4.5,
      duration: `${formattedCurriculum.reduce(
        (acc, section) => acc + section.lectures,
        0
      )} lessons`,
      what_you_learn: data.what_you_learn || []
    });

    setCurriculum(formattedCurriculum);

    // Set first lesson active
    if (formattedCurriculum.length > 0) {
      setExpandedSections({ [formattedCurriculum[0].id]: true });
      setActiveLesson(formattedCurriculum[0].lessons[0]);
    }

  } catch (error) {
    console.error("Error loading course:", error);
  } finally {
    setLoading(false);
  }
};

  const toggleSection = (id) =>
    setExpandedSections((p) => ({ ...p, [id]: !p[id] }));

  const selectLesson = (lesson, sectionTitle) => {
    setActiveLesson({ ...lesson, sectionTitle });
    setActiveTab("overview");
    videoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleComplete = (title) =>
    setCompletedLessons((p) =>
      p.includes(title) ? p.filter((l) => l !== title) : [...p, title]
    );

  const allLessons = curriculum.flatMap((s) =>
    (s.lessons || []).map((l) => ({ ...l, sectionTitle: s.title }))
  );
  const currentIndex = allLessons.findIndex((l) => l.title === activeLesson?.title);
  const goNext = () => currentIndex < allLessons.length - 1 && selectLesson(allLessons[currentIndex + 1], allLessons[currentIndex + 1].sectionTitle);
  const goPrev = () => currentIndex > 0 && selectLesson(allLessons[currentIndex - 1], allLessons[currentIndex - 1].sectionTitle);

  const totalLessons = allLessons.length;
  const totalDone = completedLessons.length;
  const progress = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin" />
        <p className="text-[#0F172A] font-bold text-sm">Loading course...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center text-center">
      <div>
        <FaBookOpen className="text-4xl text-[#EAD7B1] mx-auto mb-3" />
        <p className="text-[#0F172A] font-black text-lg">Course not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#E3A83C] text-[#0F172A] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#cf962c] transition">Go Back</button>
      </div>
    </div>
  );

  return (
    <>
      <DashboardNavbar user={user} />

      <div className="bg-[#F6F1E7]" style={{ minHeight: "100vh" }}>

        {/* Top Bar */}
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

        {/* Body */}
        <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>

          {/* ── SIDEBAR ── */}
          <div
            className="bg-white border-r border-[#EAD7B1] flex-shrink-0 overflow-y-auto transition-all duration-300"
            style={{
              width: sidebarOpen ? "320px" : "0px",
              minWidth: sidebarOpen ? "320px" : "0px",
              overflow: sidebarOpen ? "auto" : "hidden",
              position: "sticky",
              top: "57px",
              height: "calc(100vh - 57px)",
            }}
          >
            {/* Sidebar Header */}
            {/* <div className="px-4 py-4 border-b border-[#EAD7B1] bg-white sticky top-0 z-10"> */}

              {/* <h3 className="text-[#0F172A] font-black text-sm">
                {course.title}
              </h3>  */}

              {/* <p className="text-gray-400 text-xs mt-1">
                {activeLesson?.sectionTitle || "Select a lesson"}
              </p> */}

              {/* Progress */}
              {/* <div className="mt-3">

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
                  {totalDone}/{totalLessons} lessons
                </p>

              </div> */}
            {/* </div> */}

            {/* Sections */}
            {curriculum.length > 0 ? curriculum.map((section) => (
              <div key={section.id} className="border-b border-[#EAD7B1]">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F6F1E7] transition text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
                      ${expandedSections[section.id] ? "bg-[#E3A83C] text-white" : "bg-[#F6F1E7] text-[#0F172A] border border-[#EAD7B1]"}`}>
                      {section.id}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#0F172A] font-bold text-xs truncate">{section.title}</p>
                      <p className="text-gray-400 text-xs">{section.lectures} lectures</p>
                    </div>
                  </div>
                  {expandedSections[section.id]
                    ? <FaChevronUp className="text-[#E3A83C] text-xs ml-2 flex-shrink-0" />
                    : <FaChevronDown className="text-gray-400 text-xs ml-2 flex-shrink-0" />}
                </button>

                {expandedSections[section.id] && (
                  <div className="bg-[#FDFAF5]">
                    {section.lessons?.map((lesson, i) => {
                      const isActive = activeLesson?.title === lesson.title;
                      const isDone = completedLessons.includes(lesson.title);
                      return (
                        <button
                          key={i}
                          onClick={() => selectLesson(lesson, section.title)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-[#EAD7B1] last:border-0
                            ${isActive ? "bg-[#E3A83C]/10 border-l-2 border-l-[#E3A83C]" : "hover:bg-[#F6F1E7]"}`}
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
                            <p className={`text-xs font-semibold truncate
                              ${isActive ? "text-[#E3A83C]" : isDone ? "text-gray-400 line-through" : "text-[#0F172A]"}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <FaVideo className="text-gray-300 text-xs" />
                              <span className="text-gray-400 text-xs">{lesson.duration || "—"}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )) : (
              <div className="py-12 text-center">
                <FaBookOpen className="text-2xl text-[#EAD7B1] mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No curriculum available</p>
              </div>
            )}
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

              {/* Video Player */}
              <div className="relative bg-[#0F172A] w-full" style={{ aspectRatio: "16/9" }}>
                {activeLesson.video_url ? (
                  <iframe
                    src={activeLesson.video_url}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-[#E3A83C]/20 border-2 border-[#E3A83C]/40 flex items-center justify-center">
                      <FaPlayCircle className="text-[#E3A83C] text-3xl" />
                    </div>
                    <p className="text-white font-bold text-sm">{activeLesson.title}</p>
                    <p className="text-gray-400 text-xs">Video content will appear here</p>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-xl border border-[#EAD7B1] p-1 shadow-sm overflow-x-auto">
                {["overview", "notes", "resources", "q&a"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold capitalize transition whitespace-nowrap
                      ${activeTab === tab ? "bg-[#0F172A] text-white shadow" : "text-gray-400 hover:text-[#0F172A] hover:bg-[#F6F1E7]"}`}>
                    {tab === "q&a" ? "Q&A" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                    <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> About This Course
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{course.description || "No description available."}</p>
                  </div>

                  {course.what_you_learn.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                      <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.what_you_learn.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <FaCheckCircle className="text-[#E3A83C] text-xs mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                    <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> Your Instructor
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E3A83C] to-[#0F172A] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                        {course.instructor.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#0F172A] font-black text-sm">{course.instructor}</p>
                        <p className="text-[#E3A83C] text-xs font-semibold">Course Instructor</p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-[#E3A83C] text-xs" />
                          <span className="text-gray-500 text-xs">{course.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {activeTab === "notes" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> My Notes
                    {activeLesson && <span className="text-gray-400 font-normal text-xs">— {activeLesson.title}</span>}
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

              {/* Resources */}
              {activeTab === "resources" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> Lesson Resources
                  </h3>
                  {activeLesson?.resources?.length > 0 ? (
                    <div className="space-y-2">
                      {activeLesson.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-[#F6F1E7] border border-[#EAD7B1] rounded-xl hover:border-[#E3A83C] transition group">
                          <FaDownload className="text-[#E3A83C] text-sm" />
                          <span className="text-[#0F172A] text-sm font-semibold group-hover:text-[#E3A83C] transition">{r.name}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FaDownload className="text-2xl text-[#EAD7B1] mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No resources for this lesson</p>
                    </div>
                  )}
                </div>
              )}

              {/* Q&A */}
              {activeTab === "q&a" && (
                <div className="bg-white rounded-2xl border border-[#EAD7B1] p-5 shadow-sm">
                  <h3 className="text-[#0F172A] font-black text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#E3A83C] rounded-full" /> Questions & Answers
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
                    <p className="text-gray-400 text-sm">No questions yet. Be the first to ask!</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}