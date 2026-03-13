import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Navbar from "../LandingPage/Navbar";

import { FaStar, FaClock, FaBookOpen, FaImage } from "react-icons/fa";
import Footer from "../LandingPage/Footer";

const CategoryCourses = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axiosInstance.get(`/course/courses/${id}`);

                const formatted = res.data.courses.map((c) => ({
                    id: c.id,
                    title: c.title,
                    short_description: c.short_description,
                    price: parseInt(c.price),
                    duration: c.duration,
                    category: c.category_name || "Development",
                    instructor: "Expert Instructor",
                    rating: 4.8,
                    students: 120,
                    thumbnail: c.thumbnail
                }));

                setCourses(formatted);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, [id]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F6F1E7]">
                <section className="py-20 px-[5%]">
                    <div className="max-w-7xl mx-auto">

                        <h1 className="text-3xl font-black mb-10 text-gray-900">
                            Category Courses
                        </h1>

                        {courses.length === 0 ? (
                            <div className="text-center text-gray-500">
                                No courses found in this category.
                            </div>
                        ) : (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                                {courses.map((c) => (

                                    <div
                                        key={c.id}
                                        onClick={() => navigate(`/course/${c.id}`)}
                                        className="group cursor-pointer [perspective:1000px]"
                                    >

                                        <div className="relative h-[320px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                                            {/* FRONT */}
                                            <div className="absolute inset-0 bg-white rounded-2xl border border-[#EAD7B1] shadow-sm overflow-hidden flex flex-col [backface-visibility:hidden]">

                                                <div className="h-40 w-full bg-[#F6F1E7] flex items-center justify-center overflow-hidden">
                                                    {c.thumbnail ? (
                                                        <img
                                                            src={c.thumbnail}
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

                                            {/* BACK */}
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
                </section>
            </div>
            <Footer />
        </>
    );
};

export default CategoryCourses;