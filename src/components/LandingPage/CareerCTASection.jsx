import React from "react";
import hiring from '../../assets/CTA-images/hiring.svg'
import edu from "../../assets/CTA-images/education.svg"

export default function CareerCTASection() {
  return (
    <section className="relative overflow-hidden pb-5 rounded-md">
      <div className="grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-[#f8d184] px-[8%] py-10  md:py-20 relative">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              Get to know yourself better!
            </h2>

            <p className="text-gray-700 text-base mb-8">
              Discover your career strengths & weaknesses
            </p>

            <button className="bg-[#f4cb7f] hover:bg-[#e6b14e] text-slate-900 font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-md">
              Take The Free Personality Assessment
            </button>
          </div>

          {/* Illustration */}
          <img
            src={edu}
            alt="Personality Assessment"
            className="hidden md:block absolute right-10 bottom-0 h-52 object-contain"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#f8d184] px-[8%] py-16 md:py-20 relative">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
              Get hired for your dream job!
            </h2>

            <p className="text-gray-700 text-base mb-8">
              Build your free resumé in minutes!
            </p>

            <button className="bg-[#f4cb7f] hover:bg-[#e6b14e] text-slate-900  font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-md">
              Create My Professional Resumé
            </button>
          </div>

          {/* Illustration */}
          <img
            src={hiring}
            alt="Resume Builder"
            className="hidden md:block absolute right-10 bottom-0 h-56 object-contain"
          />
        </div>
      </div>

      {/* Diagonal divider overlay */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-full w-[120px] bg-[#fdfdfc]/20 transform -skew-x-12" />
      </div>

    </section>
  );
}