import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../components/User-components/DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";
import {
  FaClock, FaBookOpen, FaGlobe, FaSignal,
  FaCheckCircle, FaStar, FaUsers
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useSelector((state) => state.auth);
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

  const fetchCourse = async (Slug) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/course/get/${Slug}`);
      const responseData = res.data?.data;

      if (responseData && responseData.course) {
        setCourse(mapCourseData(responseData.course, responseData));
      } else {
        setCourse(null);
      }
    } catch (error) {
      const errorData = error.response?.data?.data;
      if (error.response?.status === 404 && errorData?.course) {
        setCourse(mapCourseData(errorData.course, errorData));
      } else {
        toast.error("Failed to load course details");
        setCourse(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user?.id) {
      toast.error("Please login to enroll");
      navigate("/login", { state: { redirectTo: `/course/${slug}` } });
      return;
    }

    try {
      setEnrolling(true);
      const payload = { user_id: user.id, course_id: course.id, amount: course.price };
      await axiosInstance.post("/course/enroll", payload);
      toast.success("Course added to My Courses ");
      navigate("/user/mycourses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
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
      <div className="bg-white p-10 rounded-3xl border border-[#EAD7B1] shadow-sm">
        <FaBookOpen className="text-5xl text-[#EAD7B1] mx-auto mb-4" />
        <p className="font-black text-[#0F172A] text-xl">Course not found</p>
        <button onClick={() => navigate(-1)} className="mt-6 bg-[#E3A83C] text-[#0F172A] px-8 py-3 rounded-xl font-black shadow-lg active:scale-95 transition">Go Back</button>
      </div>
    </div>
  );

  const filledStars = Math.round(course.rating || 0);

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-[#F6F1E7] pb-20 lg:pb-10 text-left">
        <div className="bg-white border-b border-[#EAD7B1]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
            <button onClick={() => navigate("/user/dashboard")} className="hover:text-[#E3A83C] transition">Courses</button>
            <span className="text-[#EAD7B1]">/</span>
            <span className="text-[#E3A83C]">{course.category}</span>
            <span className="text-[#EAD7B1]">/</span>
            <span className="text-[#0F172A] truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-[#EAD7B1] p-8 shadow-sm">
              <span className="inline-block bg-[#E3A83C]/10 text-[#E3A83C] border border-[#EAD7B1] text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-6 tracking-[0.2em]">
                {course.category}
              </span>
              <h1 className="text-[#0F172A] font-black text-3xl lg:text-4xl mb-4 leading-tight tracking-tight">{course.title}</h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium italic">{course.short_description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-sm ${i < filledStars ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`} />
                  ))}
                  <span className="text-[#E3A83C] text-sm font-black ml-2">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-tighter">({course.total_ratings} ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <FaUsers className="text-[#E3A83C] text-base" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  { icon: <FaClock />, text: course.duration },
                  { icon: <FaBookOpen />, text: `${course.total_lectures} lectures` },
                  { icon: <FaSignal />, text: course.level },
                  { icon: <FaGlobe />, text: course.language },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#F6F1E7] border border-[#EAD7B1] px-4 py-2 rounded-2xl text-[11px] font-black text-gray-600 uppercase tracking-tight">
                    <span className="text-[#E3A83C]">{m.icon}</span>
                    {m.text}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest pt-4 border-t border-[#F6F1E7]">
                By <span className="text-[#E3A83C] font-black">{course.instructor}</span> · Updated <span className="text-[#0F172A] font-black">{course.last_updated}</span>
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAD7B1] p-8 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-lg mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-1.5 h-6 bg-[#E3A83C] rounded-full" /> What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.what_you_learn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#E3A83C] text-base mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-[13px] font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAD7B1] p-8 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-lg mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-1.5 h-6 bg-[#E3A83C] rounded-full" /> Full Course Description
              </h2>
              <div className="text-gray-600 text-[13px] leading-loose whitespace-pre-line font-medium border-l-4 border-[#F6F1E7] pl-6 italic">
                {course.description}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAD7B1] p-8 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-lg mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-1.5 h-6 bg-[#E3A83C] rounded-full" /> Student Reviews
              </h2>
              {course.reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {course.reviews.map((rev, i) => (
                    <div key={i} className="bg-[#FDFAF5] border border-[#EAD7B1] rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Verified Student</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, si) => (
                            <FaStar key={si} className={`text-xs ${si < rev.rating ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed italic">"{rev.review_text || "No specific feedback provided."}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#FDFAF5] rounded-3xl border border-dashed border-[#EAD7B1]">
                   <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No reviews for this course yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-24">
            <PurchaseCard course={course} enrolling={enrolling} onEnroll={handleEnroll} />
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAD7B1] px-6 py-5 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div>
            <p className="text-[#0F172A] font-black text-2xl tracking-tighter">₹{course.price.toLocaleString()}</p>
            <p className="text-[#E3A83C] text-[10px] font-black uppercase tracking-[0.2em]">Unlimited Access</p>
          </div>
          <button onClick={handleEnroll} disabled={enrolling} className="bg-[#E3A83C] text-[#0F172A] font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl active:scale-95 transition disabled:opacity-50">
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

function PurchaseCard({ course, enrolling, onEnroll }) {
  return (
    <div className="bg-white rounded-[32px] border border-[#EAD7B1] shadow-2xl overflow-hidden transition-all hover:shadow-3xl">
      <div className="h-48 bg-slate-100 relative group">
        <img src={course.thumbnail} alt="thumb" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-[#E3A83C] flex items-center justify-center text-[#0F172A] shadow-2xl scale-75 group-hover:scale-100 transition duration-300">
            <span className="text-xl ml-1">▶</span>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#0F172A] font-black text-3xl tracking-tighter">₹{course.price.toLocaleString()}</span>
          <span className="text-gray-300 text-sm font-bold line-through">₹{(course.price * 2).toLocaleString()}</span>
        </div>
        <button onClick={onEnroll} disabled={enrolling} className="w-full bg-[#E3A83C] text-[#0F172A] font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-[#E3A83C]/20 hover:shadow-2xl transition active:scale-[0.98] disabled:opacity-50">
          {enrolling ? "Wait a moment..." : "Enroll Now →"}
        </button>
        <div className="mt-8 pt-6 border-t border-[#F6F1E7] space-y-3">
          <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">
            Lifetime Access Included
          </p>
        </div>
      </div>
    </div>
  );
}