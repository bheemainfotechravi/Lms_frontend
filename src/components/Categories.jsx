import React from "react";
import {
  BarChart3,
  Bot,
  Cloud,
  Palette,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
  ArrowRight,
} from "lucide-react";
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



const Categories = () => {
  return (
    <section className="py-20 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <SectionHeader
            tag="Browse by Category"
            title="Explore Top"
            highlight="Categories"
            desc="From coding to creative arts — find your path to success."
          />

          <button className="inline-flex items-center gap-2 bg-slate-100 backdrop-blur-xl border border-white/25 text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-white/20 transition-all shrink-0 w-fit">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={i}
                className={[
                  "group text-left w-full relative overflow-hidden rounded-2xl p-6",
                  "bg-white/10 backdrop-blur-2xl border border-white/25",
                  "shadow-[0_10px_32px_rgba(0,0,0,0.08)]",
                  "transition-all duration-200",
                  "hover:-translate-y-1 hover:bg-white/15 hover:border-white/35",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                ].join(" ")}
              >
                {/* soft gradient glow */}
                <div
                  className={[
                    "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-br",
                    cat.accent,
                  ].join(" ")}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className={[
                      "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center",
                      "ring-1 ring-white/25",
                      "backdrop-blur-xl",
                      cat.iconBg,
                      cat.ring,
                      "transition-all duration-200",
                    ].join(" ")}
                  >
                    <Icon className={["w-6 h-6", cat.iconText].join(" ")} />
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-900 font-extrabold text-base leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-slate-700/75 text-sm mt-1">
                      {cat.count} Courses
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 text-primary/90 text-sm font-bold">
                      Explore
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* bottom hairline */}
                <div className="relative mt-5 h-px w-full bg-white/15" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;