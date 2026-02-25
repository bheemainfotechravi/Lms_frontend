import React from "react";
import { ArrowRight } from "lucide-react";
import job from '../assets/career-images/job.svg'
import skill from '../assets/career-images/skill.svg'
import career from '../assets/career-images/career.svg' 

/**
 * Alison-style "Career Ready Plan" component (3 option cards)
 * - TailwindCSS required
 * - Replace images with your own if you want
 */
export default function CareerReadyPlan() {
  const items = [
    {
      title: (
        <>
          I want to <span className="font-extrabold">apply for</span>
          <br />a job
        </>
      ),
      img: job,
      alt: "Apply for a job",
    },
    {
      title: (
        <>
          I want to <span className="font-extrabold">find a</span>
          <br />new career
        </>
      ),
      img: career,
      alt: "Find a new career",
    },
    {
      title: (
        <>
          I want to <span className="font-extrabold">upskill</span> in
          <br />
          my current career
        </>
      ),
      img: skill,
      alt: "Upskill in current career",
    },
  ];

  return (
    <section className="py-10 md:py-20 px-[5%] bg-[#e9b75c] my-3 rounded-xl">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
            Not sure where to begin? Or even what you want to do?
          </h2>
          <p className="mt-4 text-slate-600 text-sm md:text-base">
            Answer a few short questions and we'll provide you with a{" "}
            <span className="font-bold">Career Ready Plan!</span>
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <button
              key={idx}
              className={[
                "group w-full text-left",
                "bg-white border border-gray-200 rounded-2xl shadow-sm",
                "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
                "flex items-center gap-5 p-5",
              ].join(" ")}
              onClick={() => {
                // optional: route/scroll/handler
                console.log("Selected:", it.alt);
              }}
            >
              {/* Image */}
              <div className="w-20 h-16 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={it.img}
                  alt={it.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-gray-900 font-semibold text-base leading-snug">
                  {it.title}
                </p>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full border border-[#f3c97c] flex items-center justify-center bg-[#f3c97c] hover:bg-white shrink-0 group-hover:bg-[#f3c97c]0 group-hover:border-[#f3c97c] transition">
                <ArrowRight className="w-5 h-5 text-slate-900  transition" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}