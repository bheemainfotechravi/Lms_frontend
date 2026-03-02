import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
// Import all icons from lucide-react to allow dynamic rendering
import * as LucideIcons from "lucide-react";
import axiosInstance from "../utils/axiosinstance";

/* ---- Section Header ---- */
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

/* ---- Single Card ---- */
function CategoryCard({ cat }) {
  // Dynamically get the Icon component based on the string from backend
  // Fallback to 'Layers' if the icon name is missing or invalid
  const IconComponent = LucideIcons[cat.icon] || LucideIcons.Layers;

  return (
    <button
      className={[
        "group text-left w-full relative overflow-hidden rounded-2xl p-6",
        "bg-white border border-gray-200",
        "shadow-sm transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/25",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br",
          cat.accent || "from-primary/5 to-secondary/5",
        ].join(" ")}
      />

      <div className="relative flex items-start gap-4">
        {/* ICON CONTAINER - Replaces Image Container */}
        <div className="w-12 h-12 rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-primary">
          <IconComponent 
             size={24} 
             className="transition-transform duration-300 scale-150 group-hover:scale-[1.8]" 
          />
        </div>

        <div className="flex-1">
          <p className="text-slate-900 font-extrabold text-base leading-tight">
            {cat.label}
          </p>

          <p className="text-slate-600 text-sm mt-1">
            {cat.count} Courses
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 text-primary text-sm font-bold">
            Explore
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      <div className="relative mt-5 h-px w-full bg-gray-100" />
    </button>
  );
}

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/get");

        // Transform backend data → UI-friendly format
        const formatted = res.data.categories.map((cat) => ({
          id: cat.id,
          label: cat.name,
          count: cat.courseCount || 0, 
          icon: cat.icon,
          accent: "from-primary/5 to-secondary/5",
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
          <SectionHeader
            tag="Browse by Category"
            title="Explore Top"
            highlight="Categories"
            desc="From coding to creative arts — find your path to success."
          />

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