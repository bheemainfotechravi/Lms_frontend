import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance.js";
import { useNavigate } from "react-router-dom";

import { FaStar, FaClock, FaBookOpen, FaImage } from "react-icons/fa";
import DashboardNavbar from "./DashboardNavbar.jsx";
import Footer from "../Footer.jsx";

export default function AllCourses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/category/get");

            const formatted = res.data.categories.map((c) => ({
                id: c.id,
                name: c.name
            }));

            setCategories([{ id: "all", name: "All" }, ...formatted]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axiosInstance.get("/course/get");

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
        } catch (error) {
            console.error(error);
        }
    };

    // Filter Logic
    let displayCourses = courses;

    if (activeFilter !== "All") {
        displayCourses = courses.filter(
            (c) => c.category.toLowerCase() === activeFilter.toLowerCase()
        );
    }

    return (
        <>
            <DashboardNavbar />
            <div className="min-h-screen bg-[#fceed4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-[#0F172A] font-black text-lg">
                            All courses
                        </h2>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.name)}
                            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition
      ${activeFilter === cat.name
                                    ? "bg-[#E3A83C] text-white border-[#E3A83C]"
                                    : "bg-white text-gray-600 border-[#EAD7B1] hover:border-[#E3A83C]"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                {displayCourses.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#EAD7B1] py-16 text-center shadow-sm mt-3">
                        <FaBookOpen className="text-3xl text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-semibold">
                            No courses found in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
                        {displayCourses.map((c) => (
                            <div key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="group cursor-pointer [perspective:1000px]">

                                <div className="relative h-[320px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                                    {/* FRONT SIDE */}

                                    <div className="absolute inset-0 bg-white rounded-2xl border border-[#EAD7B1] shadow-sm overflow-hidden flex flex-col [backface-visibility:hidden]">

                                        {/* Thumbnail */}
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

                                        {/* Body */}
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
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {c.rating}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                    <FaClock />
                                                    {c.duration}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[#0F172A] text-base font-black">
                                                    ₹{c.price}
                                                </span>
                                                <button className="bg-[#E3A83C] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#cf962c] transition">
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BACK SIDE */}

                                    <div className="absolute inset-0 rounded-2xl bg-[#0F172A] text-white p-5 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">

                                        <h3 className="font-bold text-sm mb-4 text-center">
                                            Course Overview
                                        </h3>
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
                                        <button
                                            // onClick={() => handleBuyCourse(c)}
                                            className="mt-10 h-10 bg-[#E3A83C] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#cf962c] transition"
                                        >
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