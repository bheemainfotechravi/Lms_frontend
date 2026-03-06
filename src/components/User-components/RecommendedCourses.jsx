// RecommendedCourses.jsx

import { useState, useEffect } from "react";
import axiosInstance, { image_URL } from "../../utils/axiosinstance.js";

import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaClock,
  FaSignal,
  FaBookOpen
} from "react-icons/fa";


const CATEGORY_FILTERS = ["All", "Development", "AI & ML", "Design", "Cloud"];

export default function RecommendedCourses({ limit, onViewAll }) {
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/get");

        const formatted = res.data.courses.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          short_description: c.short_description,
          price: parseInt(c.price),
          level: c.level,
          language: c.language,
          duration: c.duration,
          total_lectures: c.total_lectures,
          category: c.category_name || "Development",
          instructor: "Expert Instructor",
          rating: 4.8,
          students: 120,
          thumbnail: c.thumbnail,
          is_published: c.is_published
        }));

        setCourses(formatted);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const filtered = courses
    .filter((c) =>
      activeFilter === "All" ? true : c.category === activeFilter
    )
    .slice(0, limit || courses.length);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-gray-900 font-black text-sm">
            Recommended for You ✨
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Based on your enrolled courses
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-primary text-xs font-bold hover:opacity-75"
          >
            Browse All →
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition
              ${activeFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
          <FaBookOpen className="text-3xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm font-semibold">
            No courses found in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c) => (
            <div key={c.id} className="group [perspective:1000px]">
              <div className="relative h-[320px] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                {/* FRONT SIDE */}
                <div className="absolute inset-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col [backface-visibility:hidden]">

                  {/* Thumbnail */}
                  {/* Thumbnail */}
                  <div className="h-40 w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">

                    {c.thumbnail ? (
                      <img
                        src={`${image_URL}/uploads/${c.thumbnail}`}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <FaImage size={28} />
                      </div>
                    )}

                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between">

                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                      {c.category}
                    </p>

                    <h4 className="text-gray-900 text-sm font-bold leading-snug mb-1 line-clamp-2 min-h-[40px]">
                      {c.title}
                    </h4>

                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {c.short_description}
                    </p>

                    <div className="flex items-center justify-between mb-3">

                      <div className="flex items-center gap-1">
                        <FaStar className="text-amber-400 text-xs" />
                        <span className="text-xs font-bold text-gray-700">
                          {c.rating}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <FaClock />
                        {c.duration}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">

                      <span className="text-gray-900 text-base font-black">
                        ₹{c.price}
                      </span>

                      <button className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90">
                        Enroll
                      </button>

                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">

                  <h3 className="font-bold text-sm mb-4 text-center tracking-wide">
                    Course Overview
                  </h3>

                  <div className="space-y-3 text-xs">

                    <div className="flex items-center gap-2 text-gray-200">
                      <FaClock className="text-primary" />
                      <span>Duration: {c.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-200">
                      <FaStar className="text-yellow-400" />
                      <span>{c.students}+ Learners</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-200">
                      <FaBookOpen className="text-secondary" />
                      <span>Instructor: {c.instructor}</span>
                    </div>

                    <p className="text-gray-300 text-xs mt-3 leading-relaxed line-clamp-4">
                      {c.short_description}
                    </p>

                  </div>

                  <button className="mt-5 bg-white text-gray-900 text-xs font-bold py-2 rounded-lg hover:bg-gray-100 transition">
                    View Course
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}