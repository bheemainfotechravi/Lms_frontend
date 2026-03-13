import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../components/User-components/DashboardNavbar.jsx"
import Footer from "../../components/LandingPage/Footer.jsx"
import {
  FaClock, FaBookOpen, FaGlobe, FaSignal,
  FaCheckCircle,
  FaInfinity, FaMobile, FaImage
} from "react-icons/fa";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/course/get/${id}`);
      const c = res.data.data;
      setCourse({
        id: c.id,
        title: c.title,
        description: c.description,
        short_description: c.short_description,
        price: parseInt(c.price),
        level: c.level,
        language: c.language,
        duration: c.duration,
        total_lectures: c.total_lectures,
        category_id: c.category_id,
        is_published: c.is_published,
        thumbnail: c.thumbnail,
        instructor: c.instructor_name || "Expert Instructor",
        rating: c.rating || 4.8,
        total_ratings: c.total_ratings || 0,
        students: c.students || 0,
        last_updated: c.updated_at
          ? new Date(c.updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "Recently",
        requirements: c.requirements || [],
        curriculum: c.curriculum || [],
        category: c.category_name || "Development",
        what_you_learn: c.material_titles
          ? c.material_titles.split(",").map((t) => t.trim()).filter(Boolean)
          : c.what_you_learn || [],
      });
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
  if (!user || !user.id) {
    alert("Please login to enroll in this course");

    navigate("/login", {
      state: { redirectTo: `/course/${id}` }
    });

    return;
  }

  try {
    setEnrolling(true);

    const payload = {
      user_id: user.id,
      course_id: course.id,
      amount: course.price
    };

    const res = await axiosInstance.post("/course/enroll", payload);

    console.log("Course enrolled:", res.data);

    alert("Course added to My Courses 🎉");

    navigate("/courses");

  } catch (error) {
    console.error("Error buying course:", error.response?.data || error);
    alert("Failed to purchase course");
  } finally {
    setEnrolling(false);
  }
};

  if (loading) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin" />
        <p className="text-[#0F172A] font-bold text-sm">Loading course...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center">
      <div className="text-center">
        <FaBookOpen className="text-4xl text-[#EAD7B1] mx-auto mb-3" />
        <p className="text-[#0F172A] font-black text-lg">Course not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#E3A83C] text-[#0F172A] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#cf962c] transition">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-[#F6F1E7]">

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-[#EAD7B1]">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
            <button onClick={() => navigate("/user/dashboard")} className="hover:text-[#E3A83C] transition font-semibold">Courses</button>
            <span>/</span>
            <span className="text-[#E3A83C] font-semibold">{course.category}</span>
            <span>/</span>
            <span className="text-[#0F172A] font-semibold truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        {/* ── Single Main Layout: Info Left + Card Right ── */}
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: All content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Course Header */}
            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <span className="inline-block bg-[#E3A83C]/10 text-[#E3A83C] border border-[#EAD7B1] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                {course.category}
              </span>

              <h1 className="text-[#0F172A] font-black text-2xl leading-tight mb-3">
                {course.title}
              </h1>

              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {course.short_description}
              </p>

              {/* Rating */}
              {/* <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < filledStars ? "text-[#E3A83C]" : "text-[#EAD7B1]"}`} />
                  ))}
                  <span className="text-[#E3A83C] text-sm font-bold ml-1">{course.rating}</span>
                  <span className="text-gray-400 text-xs ml-1">({course.total_ratings.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FaUsers className="text-[#E3A83C]" />
                  <span>{course.students.toLocaleString()} students enrolled</span>
                </div>
              </div> */}

              {/* Meta Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: <FaClock />, text: course.duration },
                  { icon: <FaBookOpen />, text: `${course.total_lectures} lectures` },
                  { icon: <FaSignal />, text: course.level },
                  { icon: <FaGlobe />, text: course.language },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-[#F6F1E7] border border-[#EAD7B1] px-3 py-1.5 rounded-full text-xs text-gray-600">
                    <span className="text-[#E3A83C]">{m.icon}</span>
                    <span className="font-semibold">{m.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-400 text-xs">
                By <span className="text-[#E3A83C] font-bold">{course.instructor}</span>
                <span className="mx-2 text-gray-300">·</span>
                Last updated <span className="text-[#0F172A] font-semibold">{course.last_updated}</span>
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" />
                What You'll Learn
              </h2>
              {course.what_you_learn.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {course.what_you_learn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-[#E3A83C] text-sm mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Details coming soon.</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" />
                Course Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
            </div>

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
                <h2 className="text-[#0F172A] font-black text-base mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#E3A83C] rounded-full" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E3A83C] flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Details */}
            <div className="bg-white rounded-2xl border border-[#EAD7B1] p-6 shadow-sm">
              <h2 className="text-[#0F172A] font-black text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#E3A83C] rounded-full" />
                Course Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: <FaClock />, label: "Duration", value: course.duration },
                  { icon: <FaBookOpen />, label: "Lectures", value: course.total_lectures },
                  { icon: <FaSignal />, label: "Level", value: course.level },
                  { icon: <FaGlobe />, label: "Language", value: course.language },
                  { icon: <FaInfinity />, label: "Access", value: "Full Lifetime" },
                  { icon: <FaMobile />, label: "Devices", value: "Mobile & Desktop" },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F6F1E7] rounded-xl border border-[#EAD7B1]">
                    <div className="text-[#E3A83C] text-sm">{d.icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{d.label}</p>
                      <p className="text-[#0F172A] text-xs font-bold">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* ── RIGHT: Sticky Purchase Card — shown once, desktop only ── */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <PurchaseCard course={course} enrolling={enrolling} onEnroll={handleEnroll} />
            </div>
          </div>
        </div>

        {/* ── Mobile Buy Bar ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAD7B1] px-5 py-3 flex items-center justify-between z-50 shadow-xl">
          <div>
            <p className="text-[#0F172A] font-black text-xl">₹{course.price.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">One-time payment</p>
          </div>
          <button onClick={handleEnroll} disabled={enrolling}
            className="bg-[#E3A83C] text-[#0F172A] font-black text-sm px-6 py-3 rounded-xl hover:bg-[#cf962c] transition disabled:opacity-60">
            {enrolling ? "Processing..." : "Enroll Now"}
          </button>
        </div>

      </div>

      <Footer />
    </>
  );
}

// ── Purchase Card ──
function PurchaseCard({ course, enrolling, onEnroll }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAD7B1] shadow-lg overflow-hidden">

      {/* Thumbnail */}
      <div className="h-44 bg-[#F6F1E7] flex items-center justify-center overflow-hidden relative group">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <FaImage className="text-4xl text-[#EAD7B1]" />
        )}
        <div className="absolute inset-0 bg-[#0F172A]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="w-12 h-12 rounded-full bg-[#E3A83C] flex items-center justify-center text-white text-lg shadow-lg">▶</div>
        </div>
      </div>

      <div className="p-5">
        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-[#0F172A] font-black text-3xl">₹{course.price.toLocaleString()}</span>
          <span className="text-gray-300 text-sm line-through mb-1">₹{(course.price * 2).toLocaleString()}</span>
          <span className="text-green-600 text-xs font-bold mb-1 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">50% OFF</span>
        </div>

        <button onClick={onEnroll} disabled={enrolling}
          className="w-full bg-[#E3A83C] text-[#0F172A] font-black text-sm py-3.5 rounded-xl hover:bg-[#cf962c] transition disabled:opacity-60 mb-2 shadow-md">
          {enrolling ? "Processing..." : "Enroll Now →"}
        </button>

        <p className="text-center text-gray-400 text-xs mb-4">30-Day Money-Back Guarantee</p>

        <div className="space-y-2.5 border-t border-[#EAD7B1] pt-4">
          <p className="text-[#0F172A] font-bold text-xs mb-3">This course includes:</p>
          {[
            { icon: <FaClock />, text: `${course.duration} of on-demand content` },
            { icon: <FaBookOpen />, text: `${course.total_lectures} lectures` },
            { icon: <FaInfinity />, text: "Full lifetime access" },
            { icon: <FaMobile />, text: "Access on mobile & desktop" },
            { icon: <FaGlobe />, text: `Language: ${course.language}` },
            { icon: <FaSignal />, text: `Level: ${course.level}` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-gray-500 text-xs">
              <span className="text-[#E3A83C] w-3">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

