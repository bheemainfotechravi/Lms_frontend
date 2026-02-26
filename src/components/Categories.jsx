import React from "react";
import { ArrowRight } from "lucide-react";
import CATEGORIES from "../data/Categories";

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
  const Icon = cat.icon;

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
      {/* hover glow (soft) */}
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br",
          cat.accent || "from-primary/5 to-secondary/5",
        ].join(" ")}
      />

      <div className="relative flex items-start gap-4">
        {/* Icon box */}
        <div
          className={[
            "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center",
            "border border-gray-200 bg-gray-50",
            "group-hover:scale-105 transition-all duration-200",
            cat.iconBg || "",
          ].join(" ")}
        >
          <Icon className={["w-6 h-6", cat.iconText || "text-gray-800"].join(" ")} />
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-slate-900 font-extrabold text-base leading-tight">
            {cat.label}
          </p>
          <p className="text-slate-600 text-sm mt-1">{cat.count} Courses</p>

          <div className="mt-4 inline-flex items-center gap-1.5 text-primary text-sm font-bold">
            Explore
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* bottom hairline */}
      <div className="relative mt-5 h-px w-full bg-gray-100" />
    </button>
  );
}

const Categories = () => {
  return (
    <section className="py-20 px-[5%] bg-gradient-to-b from-white to-[#f3c97c]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;