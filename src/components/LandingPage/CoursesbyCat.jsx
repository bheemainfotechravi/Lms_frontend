import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaClock, FaBookOpen, FaImage } from "react-icons/fa";
import DashboardNavbar from "../User-components/DashboardNavbar.jsx";
import Footer from "../LandingPage/Footer.jsx";

export default function CoursesbyCat() {
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchCoursesByCategoryId();
        }
    }, [id]);


    const fetchCoursesByCategoryId = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/course/courses/${id}`);

            const formatted = res.data.courses.map((c) => ({
                id: c.id,
                title: c.title,
                short_description: c.short_description,
                price: parseInt(c.price),
                duration: c.duration,
                category: c.category_name || "Development",
                rating: 4.8, 
                students: 120, 
                instructor: "Expert Instructor",
                thumbnail: c.thumbnail
            }));

            setCourses(formatted);

            // Set the category name from the first course found
            if (formatted.length > 0) {
                setCategoryName(formatted[0].category);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DashboardNavbar />
            <div className="min-h-screen bg-[#fceed4]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Dynamic Header */}
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                        <div>
                            <h2 className="text-[#0F172A] font-black text-3xl uppercase tracking-tight">
                                {categoryName || "Category"} Courses
                            </h2>
                            <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-widest">
                                Explore our professional selection
                            </p>
                        </div>
                        <button onClick={() => navigate(-1)} className=" text-[#E3A83C] font-black text-sm hover:text-black">
                            &larr; BACK
                        </button>
                    </div>

                    {/* Content Section */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin mb-4" />
                            <p className="text-gray-500 font-black animate-pulse">LOADING COURSES...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="bg-white rounded-[40px] border-2 border-[#EAD7B1] py-20 text-center shadow-xl">
                            <FaBookOpen className="text-5xl text-[#EAD7B1] mx-auto mb-4" />
                            <p className="text-[#0F172A] text-xl font-black">No courses found</p>
                            <p className="text-gray-400 text-sm mt-1">Check back later for new content in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {courses.map((c) => (
                                <div 
                                    key={c.id} 
                                    onClick={() => navigate(`/course/${c.id}`)} 
                                    className="group cursor-pointer [perspective:1000px] h-[400px]"
                                >
                                     <div className="relative h-[320px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* FRONT SIDE (Restored Original Style) */}
                <div className="absolute inset-0 bg-white rounded-2xl border border-[#EAD7B1] shadow-sm overflow-hidden flex flex-col [backface-visibility:hidden]">
                  <div className="h-40 w-full bg-[#F6F1E7] flex items-center justify-center overflow-hidden">
                    {c.thumbnail ? (
                      <img
                        src={`${c.thumbnail}`}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaImage className="text-gray-400 text-xl" />
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs font-bold text-[#E3A83C] uppercase mb-1">
                      {c.category}
                    </p>
                    <h4 className="text-[#0F172A] text-sm font-bold leading-snug mb-1 line-clamp-2 min-h-[40px]">
                      {c.title}
                    </h4>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 min-h-[32px]">
                      {c.short_description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-amber-400 text-xs" />
                        <span className="text-xs font-bold text-gray-700">{c.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaClock /> {c.duration}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[#0F172A] text-base font-black">₹{c.price}</span>
                      <button className="bg-[#E3A83C] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#cf962c] transition">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE (Restored Original Style) */}
                <div className="absolute inset-0 rounded-2xl bg-[#0F172A] text-white p-5 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="font-bold text-sm mb-4 text-center">Course Overview</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaClock className="text-[#E3A83C]" />
                      <span>Duration: {c.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaStar className="text-yellow-400" />
                      <span>{c.students}+ Learners</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaBookOpen className="text-[#E3A83C]" />
                      <span>Instructor: {c.instructor}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-3 line-clamp-4">
                      {c.short_description}
                    </p>
                  </div>
                  <button className="mt-10 h-10 bg-[#E3A83C] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#cf962c] transition">
                    Enroll Course
                  </button>
                </div>

              </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}