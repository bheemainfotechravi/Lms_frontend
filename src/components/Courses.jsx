import React from "react";
import COURSES from "../data/Courses";
import { Clock, ScrollText, Users, ArrowRight } from "lucide-react";


export function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          stroke={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          strokeWidth="1"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span className="text-amber-800 text-xs font-bold ml-1">{rating}</span>
    </div>
  );
}

function SectionHeader({ tag, title, highlight, desc }) {
  return (
    <div>
      <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">
        {tag}
      </p>
      <h2 className="text-4xl font-black tracking-tight mb-3 text-gray-900">
        {title}{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {desc && <p className="text-slate-500 text-base">{desc}</p>}
    </div>
  );
}

function CourseCard({ course }) {
  const points =
    course.points?.length > 0
      ? course.points
      : [
          "Understand core concepts step-by-step",
          "Build real-world projects and workflows",
          "Get a certificate after completion",
        ];

  return (
    <div
      className={[
        "group relative  bg-white border border-gray-200 rounded-2xl overflow-hidden",
        "transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl",
        course.borderHover || "",
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div
        className={[
          "h-40 bg-gradient-to-br flex items-center justify-center relative",
          course.thumbClass || "from-slate-50 to-slate-100",
        ].join(" ")}
      >
        <div className=" rounded-full bg-white shadow-lg flex items-center justify-center">
          
          <img src={course.image} alt={course.title} />
        </div>

        {/* Tag */}
        {course.tag && (
          <span
            className={[
              "absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full",
              course.tagClass || "bg-gray-100 text-gray-700",
            ].join(" ")}
          >
            {course.tag}
          </span>
        )}

        {/* Level */}
        {course.level && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-500 border border-gray-200">
            {course.level}
          </span>
        )}

        {/* subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Default Body */}
      <div className="p-5">
        <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${course.accentClass || "text-gray-700"}`}>
          {course.category}
        </p>

        <h3 className="text-gray-900 text-sm font-extrabold leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-400 text-xs mb-3">by {course.instructor}</p>

        <div className="flex items-center justify-between mb-3">
          <StarRating rating={course.rating} />
          <span className="text-gray-400 text-xs inline-flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {course.students} students
          </span>
        </div>

        <div className="flex gap-4">
          <span className="text-gray-500 text-xs inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {course.hours}h
          </span>
          <span className="text-gray-500 text-xs inline-flex items-center gap-1.5">
            <ScrollText className="w-4 h-4" /> Certificate
          </span>
        </div>
      </div>

      {/* Hover Details Panel (Alison style) */}
      <div
        className={[
          "absolute inset-x-0 bottom-0",
          "translate-y-[55%] group-hover:translate-y-0",
          "transition-transform duration-300 ease-out",
          "bg-white/95 backdrop-blur border-t border-gray-200",
          "p-5",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-900 text-xs font-black tracking-wide uppercase">
            You will learn how to
          </p>
          <span className="text-[11px] font-bold text-gray-500">
            {course.level || "Course"}
          </span>
        </div>

        <ul className="space-y-2 mb-4">
          {points.slice(0, 3).map((t, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-slate-600 leading-snug">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="line-clamp-2">{t}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <span className="text-gray-900 text-lg font-black">₹{course.price}</span>
            <span className="text-gray-400 text-xs line-through ml-2">
              ₹{course.originalPrice}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="border border-gray-300 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-gray-50 transition">
              More Info
            </button>

            <button
              className={[
                "text-xs font-bold px-3.5 py-2 rounded-lg transition inline-flex items-center gap-1.5",
                course.btnClass
                  ? course.btnClass
                  : "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600",
              ].join(" ")}
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Helps click area feel premium */}
      <div className="absolute inset-0 pointer-events-none ring-0 group-hover:ring-2 group-hover:ring-primary/15 transition" />
    </div>
  );
}

const Courses = () => {
  return (
    <section className="py-20 px-[5%]  bg-gradient-to-b from-[#f3c97c] to-white/30 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            tag="Featured Courses"
            title="Most Popular"
            highlight="Right Now"
            desc="Handpicked courses loved by thousands of students."
          />
          <button className="border border-primary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0">
            View All Courses →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;