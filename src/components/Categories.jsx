import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../utils/axiosinstance";
 
/* ---------------- Section Header ---------------- */
function SectionHeader({ tag, title, highlight, desc }) {
  return (
    <div>
      <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">
        {tag}
      </p>
      <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900">
        {title}{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {desc && <p className="text-slate-700/80 text-base">{desc}</p>}
    </div>
  );
}
 
/* ---------------- Category Card ---------------- */
function CategoryCard({ cat }) {
  return (
    <button
      className={[
        "group w-full rounded-2xl p-6 text-center",
        "bg-[#D68D06] text-black",
        "shadow-md transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-xl",
      ].join(" ")}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow">
          <img
            src={cat.icon}
            alt={cat.name}
            className="w-7 h-7 object-contain"
          />
        </div>
      </div>
 
      {/* Category Name */}
      <p className="font-bold text-xl leading-tight">
        {cat.name}
      </p>
 
      {/* Course Count */}
      <p className="font-bold text-lg opacity-90 mt-1">
        {cat.count} Courses
      </p>
 
      {/* Explore */}
      <div className="mt-4 flex items-center justify-center gap-1 text-lg font-bold text-white">
        Explore
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
 
/* ---------------- Main Categories Section ---------------- */
const Categories = () => {
  const [categories, setCategories] = useState([]);
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/get");
 
 
 
        const formatted = res.data.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          count: cat.course_count || 0,
          icon: cat.icon,
        }));
 
 
        setCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
 
    fetchCategories();
  }, []);
 
  return (
    <section className="py-20 px-[5%] bg-gradient-to-b from-white to-[#f3c97c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
 
          <div className="text-center sm:text-left">
            <SectionHeader
           
              title="Explore Top"
              highlight="Categories"
            />
          </div>
 
          <button className="inline-flex items-center gap-2 border border-primary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0 w-fit">
            View All <ArrowRight className="w-4 h-4" />
          </button>
 
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};
 
export default Categories;