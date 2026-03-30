import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../../utils/axiosinstance";
import { useAuth } from "../../context/AuthContext";
import { FaBookOpen, FaClock, FaGlobe, FaSignal, FaCheckCircle } from "react-icons/fa";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "../LandingPage/Footer";


function ProgressRing({ percent, size = 40, stroke = 3.5 }) {
  // Ensure percent is a safe number for SVG calculations
  const safePercent = isNaN(Number(percent)) ? 0 : Math.min(Math.max(Number(percent), 0), 100);

  const color = safePercent === 100 ? "#16A34A" : "#E3A83C";
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safePercent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFE6D3" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} 
        strokeDasharray={circ} 
        strokeDashoffset={offset}
        strokeLinecap="round" 
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export default function MyCourses({ limit, title = "My Courses", onViewAll }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-courses");

  useEffect(() => {
    if (!user?.id) return;

   const fetchMyCourses = async () => {
  try {
    setLoading(true);

    // 1) Get enrolled courses
    const res = await axiosInstance.get(`/course/mycourses/${user.id}`);
    const coursesData = res.data.courses || [];

    // 2) For each course, get progress from API
    const coursesWithProgress = await Promise.all(
      coursesData.map(async (c) => {
        try {
          const progressRes = await axiosInstance.get(
            `/course/check-course-progress/${c.id}`
          );
          
          const progressData = progressRes.data;
          
          let rawProgress = 0;
          let rawDone = 0;

          if (progressData.progress && Array.isArray(progressData.progress) && progressData.progress.length > 0) {
            const latest = progressData.progress[progressData.progress.length - 1];
            rawProgress = latest.progress_percent;
            rawDone = latest.completed_lessons?.length || 0;
          } else if (progressData.progress && typeof progressData.progress === 'object') {
           
            rawProgress = progressData.progress.progress_percent || 0;
            rawDone = progressData.progress.completed_lessons?.length || 0;
          }

          const cleanProgress = Math.min(parseFloat(rawProgress) || 0, 100);
 
          const cleanDone = parseInt(rawDone) || 0;

          return {
            id: c.id,
            title: c.title,
            short_description: c.short_description,
            level: c.level,
            language: c.language,
            duration: c.duration,
            totalLectures: c.total_lectures,
            instructor: c.instructor || "Expert Instructor",
            progress: cleanProgress, // Pure Number
            doneLessons: cleanDone, // Pure Number
            totalLessons: c.total_lectures || 0,
            thumbnail: c.thumbnail,
            tag: cleanProgress >= 100 ? "Completed" : "In Progress",
            tagClass: cleanProgress >= 100 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700",
          };
        } catch (err) {
          console.error(`Error for course ${c.id}:`, err);
          return {
            id: c.id,
            title: c.title,
            short_description: c.short_description,
            level: c.level,
            language: c.language,
            duration: c.duration,
            totalLectures: c.total_lectures,
            instructor: c.instructor || "Expert Instructor",
            progress: 0,
            doneLessons: 0,
            totalLessons: c.total_lectures || 0,
            thumbnail: c.thumbnail,
            tag: "In Progress",
            tagClass: "bg-yellow-100 text-yellow-700",
          };
        }
      })
    );

    setCourses(coursesWithProgress);
  } catch (error) {
    console.error("Error fetching my courses:", error);
  } finally {
    setLoading(false);
  }
};

    fetchMyCourses();
  }, [user]);

  const visibleCourses = courses.slice(0, limit || courses.length);

  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow container mx-auto max-w-7xl px-4 md:px-6 py-10">
        
        <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A]">{title}</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Manage your learning journey and track your progress.</p>
        </div>

        <div className="w-full bg-white rounded-2xl border border-[#EFE6D3] shadow-sm overflow-hidden">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFE6D3]">
            <h3 className="text-gray-800 font-bold text-sm">Enrollment List</h3>
            {onViewAll && (
              <button onClick={onViewAll} className="text-[#E3A83C] text-xs font-bold hover:opacity-80">
                View All →
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center">
               <div className="w-8 h-8 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin mx-auto mb-4" />
               <p className="text-gray-500 text-sm font-medium">Syncing your courses...</p>
            </div>
          ) : visibleCourses.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500 text-sm font-semibold mb-6">
                You haven't enrolled in any courses yet.
              </p>
              <button 
                onClick={() => navigate("/user/dashboard")}
                className="bg-[#E3A83C] text-[#0F172A] px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-md transition"
              >
                Find a Course
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F3E8D5]">
              {visibleCourses.map((course) => (
                <div key={course.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-6 px-6 py-6 hover:bg-[#FDFBF7] transition group">
                  
                  <div className="w-full lg:w-44 h-28 rounded-xl overflow-hidden shrink-0 border border-[#EFE6D3] relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[#0F172A] text-lg font-bold group-hover:text-[#E3A83C] transition-colors">
                        {course.title}
                      </p>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${course.tagClass}`}>
                        {course.tag}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">{course.short_description}</p>

                    <div className="flex flex-wrap gap-4 text-[13px] text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5"><FaBookOpen className="text-[#E3A83C]" /> {course.totalLectures} Lessons</span>
                      <span className="flex items-center gap-1.5"><FaClock className="text-[#E3A83C]" /> {course.duration}</span>
                      <span className="flex items-center gap-1.5"><FaGlobe className="text-[#E3A83C]" /> {course.language}</span>
                      <span className="flex items-center gap-1.5"><FaSignal className="text-[#E3A83C]" /> {course.level}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#F6F1E7] rounded-full h-2 max-w-sm border border-[#EAD7B1]/30">
                        <div className="bg-[#E3A83C] rounded-full h-2 transition-all duration-700" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">
                        {course.doneLessons}/{course.totalLessons} Complete
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full lg:w-auto lg:border-l lg:border-[#F3E8D5] lg:pl-6 justify-between lg:justify-end">
                    
                    <div className="relative shrink-0 flex items-center justify-center">
                      <ProgressRing percent={course.progress} size={48} />
                      <span className="absolute text-[10px] font-black text-[#0F172A]">
                        {course.progress === 100 ? <FaCheckCircle className="text-green-600 text-sm" /> : `${Math.round(course.progress)}%`}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/learning/${course.id}`)}
                      className={`text-sm font-bold px-6 py-2.5 rounded-xl border transition min-w-[140px]
                      ${course.progress === 100
                          ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                          : "border-[#E3A83C] text-[#E3A83C] bg-white hover:bg-[#E3A83C] hover:text-white"
                      }`}
                    >
                      {course.progress === 100 ? "Review" : course.progress === 0 ? "Start" : "Resume"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-3 bg-[#F9F7F2] border-t border-[#EFE6D3] flex justify-between text-[11px] font-medium text-gray-500">
            <p>Showing <span className="text-[#0F172A] font-bold">{visibleCourses.length}</span> courses</p>
            <p>{courses.filter(c => c.progress === 100).length} Completed · {courses.filter(c => c.progress > 0 && c.progress < 100).length} Ongoing</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}