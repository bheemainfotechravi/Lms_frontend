import React from "react";
import { ChevronRight } from "lucide-react";

export default function SkillPills() {
  const pills = [
    "Information Systems",
    "Human Resources",
    "Business Management",
    "Quality Control",
    "Health Care",
    "Contract Law",
    "Management",
    "Accounting",
    "Health and Safety",
    "Project Management",
    "Supply Chain Management",
    "Business Analytics"
  ];

  return (
    <section className="py-16 md:py-20 px-[5%] bg-[#F0D5A1]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">
            Advance Your Career. Learn In-demand Skills.
          </h2>
          <p className="mt-4 text-slate-600 text-base md:text-lg">
            Upskill in business analytics, health care, graphic design,
            management and more.
          </p>
        </div>

        {/* Pills + Right Arrow */}
        <div className="mt-10 flex items-center justify-center gap-6">
          {/* Pills grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pills.map((label) => (
              <button
                key={label}
                className={[
                  "px-7 py-4 rounded-full border border-gray-300 bg-white",
                  "text-gray-700 font-semibold text-sm md:text-base",
                  "hover:border-[#f1a20f] hover:text-slate-900 hover:bg-[#f4cb7f]",
                  "transition-all duration-200",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right arrow button */}
          <button
            className={[
              "w-12 h-12 rounded-full border-2 border-[#f4b033]",
              "flex items-center justify-center",
              "hover:bg-[#f4cb7f] transition-all duration-200",
              "shrink-0",
            ].join(" ")}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-slate-900 hover:text-white" />
          </button>
        </div>

        {/* View more */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 text-slate-900 font-bold hover:underline">
            View More Skills <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}