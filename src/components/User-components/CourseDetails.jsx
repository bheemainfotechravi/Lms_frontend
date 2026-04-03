import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../components/User-components/DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";
import {
  FaClock, FaBookOpen, FaGlobe, FaSignal,
  FaCheckCircle, FaInfinity, FaMobile, FaImage,
  FaStar, FaUsers
} from "react-icons/fa";

export default function CourseDetails() {
  const { id: slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (slug) fetchCourse(slug);
  }, [slug]);

  const mapCourseData = (c, extra = {}) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    short_description: c.short_description,
    price: parseInt(c.price) || 0,
    level: c.level,
    language: c.language,
    duration: c.duration,
    total_lectures: c.total_lectures,
    thumbnail: c.thumbnail,
    instructor: c.instructor_name || "Expert Instructor",
    students: c.students || 0,
    last_updated: c.updated_at
      ? new Date(c.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "Recently",
    requirements: Array.isArray(c.requirements) ? c.requirements : [],
    category: c.category_name || "Development",
    what_you_learn: c.material_titles
      ? c.material_titles.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(c.what_you_learn) ? c.what_you_learn : [],
    rating: Number(extra?.avgRating || 0),
    total_ratings: Number(extra?.totalReviews || 0),
    reviews: Array.isArray(extra?.reviews) ? extra.reviews : [],
  });

  const fetchCourse = async (targetSlug) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/course/get/${targetSlug}`);
      const c = res.data.data;
      setCourse(mapCourseData(c, res.data));
    } catch (error) {
      const errorData = error.response?.data;
      if (error.response?.status === 404 && errorData?.data) {
        setCourse(mapCourseData(errorData.data));
      } else {
        console.error("Fetch Error:", error);
        setCourse(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user?.id) {
      alert("Please login to enroll");
      navigate("/login", { state: { redirectTo: `/course/${slug}` } });
      return;
    }

    try {
      setEnrolling(true);
      const payload = { user_id: user.id, course_id: course.id, amount: course.price };
      await axiosInstance.post("/course/enroll", payload);
      alert("Course added to My Courses 🎉");
      navigate("/user/mycourses");
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center text-center">
      <div>
        <FaBookOpen className="text-4xl text-[#EAD7B1] mx-auto mb-3" />
        <p className="font-black">Course not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#E3A83C] px-5 py-2 rounded-xl font-bold">Go Back</button>
      </div>
    </div>
  );

  const filledStars = Math.round(course.rating || 0);

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-[#F6F1E7] pb-20 lg:pb-0">
        <div className="bg-white border-b border-[#EAD7B1]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
            <button onClick={() => navigate("/user/dashboard")} className="hover:text-[#E3A83C] font-semibold transition">Courses</button>
            <span>/</span>
            <span className="text-[#E3A83C] font-semibold">{course.category}</span>
            <span>/</span>
            <span className="text-[#0F172A] font-semibold truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-5">
            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <span className="inline-block bg-[#E3A83C]/10 text-[#E3A83C] border border-[#EAD7B1] text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 tracking-widest">
                {course.category}
              </span>
              <h1 className="text-[#0F172A] font-black text-2xl lg:text-3xl mb-3 leading-tight">{course.title}</h1>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{course.short_description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < filledStars ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`} />
                  ))}
                  <span className="text-[#E3A83C] text-sm font-bold ml-1">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs ml-1">({course.total_ratings} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FaUsers className="text-[#E3A83C]" />
                  <span>{course.students} students</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: <FaClock />, text: course.duration },
                  { icon: <FaBookOpen />, text: `${course.total_lectures} lectures` },
                  { icon: <FaSignal />, text: course.level },
                  { icon: <FaGlobe />, text: course.language },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-[#F6F1E7] border border-[#EAD7B1] px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-600">
                    <span className="text-[#E3A83C]">{m.icon}</span>
                    {m.text}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-[11px]">
                By <span className="text-[#E3A83C] font-black uppercase">{course.instructor}</span> · Updated <span className="text-[#0F172A] font-bold">{course.last_updated}</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-4 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" /> What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.what_you_learn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <FaCheckCircle className="text-[#E3A83C] text-sm mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-3 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" /> Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-4 flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" /> Course Reviews
              </h2>
              {course.reviews.length > 0 ? (
                <div className="space-y-4">
                  {course.reviews.map((rev, i) => (
                    <div key={i} className="bg-[#FDFAF5] border border-[#EAD7B1] rounded-2xl p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-black uppercase text-gray-400">Student Review</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, si) => (
                            <FaStar key={si} className={`text-[10px] ${si < rev.rating ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{rev.review_text || "No comments."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">No reviews yet.</p>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-24">
            <PurchaseCard course={course} enrolling={enrolling} onEnroll={handleEnroll} />
          </div>
        </div>

        {/* Mobile Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAD7B1] px-5 py-4 flex items-center justify-between z-50 shadow-2xl">
          <div>
            <p className="text-[#0F172A] font-black text-xl">₹{course.price.toLocaleString()}</p>
            <p className="text-gray-400 text-[10px] font-bold uppercase">Lifetime Access</p>
          </div>
          <button onClick={handleEnroll} disabled={enrolling} className="bg-[#E3A83C] text-[#0F172A] font-black text-sm px-8 py-3 rounded-xl shadow-lg active:scale-95 transition disabled:opacity-50">
            {enrolling ? "Wait..." : "Enroll Now"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

function PurchaseCard({ course, enrolling, onEnroll }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAD7B1] shadow-xl overflow-hidden">
      <div className="h-48 bg-slate-100 relative group">
        <img src={course.thumbnail} alt="thumb" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#E3A83C] flex items-center justify-center text-white shadow-xl">▶</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#0F172A] font-black text-3xl">₹{course.price.toLocaleString()}</span>
          <span className="text-gray-300 text-sm line-through">₹{course.price * 2}</span>
        </div>
        <button onClick={onEnroll} disabled={enrolling} className="w-full bg-[#E3A83C] text-[#0F172A] font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition active:scale-[0.98] disabled:opacity-50">
          {enrolling ? "Processing..." : "Enroll Now →"}
        </button>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-4 tracking-widest border-t border-[#F6F1E7] pt-4">
          Full Lifetime Access Included
        </p>
      </div>
    </div>
  );
}