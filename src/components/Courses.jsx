import React from 'react'
import COURSES from '../data/Courses'

export function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
          fill={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          stroke={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          strokeWidth="1">
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
      <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">{tag}</p>
      <h2 className="text-4xl font-black tracking-tight mb-3 text-gray-900">
        {title}{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{highlight}</span>
      </h2>
      {desc && <p className="text-slate-500 text-base">{desc}</p>}
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl ${course.borderHover}`}>
      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${course.thumbClass} flex items-center justify-center relative`}>
        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
          <course.icon className={`w-8 h-8 ${course.accentClass}`} />
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${course.tagClass}`}>
          {course.tag}
        </span>
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-500 border border-gray-200">
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${course.accentClass}`}>{course.category}</p>
        <h3 className="text-gray-900 text-sm font-bold leading-snug mb-2">{course.title}</h3>
        <p className="text-gray-400 text-xs mb-3">by {course.instructor}</p>

        <div className="flex items-center justify-between mb-2">
          <StarRating rating={course.rating} />
          <span className="text-gray-400 text-xs">{course.students} students</span>
        </div>

        <div className="flex gap-4 mb-4">
          <span className="text-gray-500 text-xs inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {course.hours}h content
          </span>
          <span className="text-gray-500 text-xs inline-flex items-center gap-1.5">
            <ScrollText className="w-4 h-4" /> Certificate
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-gray-900 text-xl font-black">₹{course.price}</span>
            <span className="text-gray-400 text-xs line-through ml-2">₹{course.originalPrice}</span>
          </div>
          <button className={`border text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 ${course.btnClass}`}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

const Courses = () => {
  return (
       <section className="py-20 px-[5%] bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader tag="Featured Courses" title="Most Popular" highlight="Right Now" desc="Handpicked courses loved by thousands of students." />
            <button className="border border-primary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0">
              View All Courses →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </div>
      </section>
  )
}

export default Courses
