import React from "react";
import { BookOpen, GraduationCap, Star, Trophy } from "lucide-react";
import Categories from "./Categories";

const STATS = [
  { value: "50K+", label: "Active Students", icon: GraduationCap },
  { value: "1,200+", label: "Expert Courses", icon: BookOpen },
  { value: "300+", label: "Top Instructors", icon: Trophy },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
];

const Trustedby = () => {
  return (
    <section className="py-10 px-[5%] bg-gradient-to-t from-slate-100 to-red-200">
      {/* Trusted logos row (glass) */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="  rounded-2xl py-5 px-6 ">
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <span className="text-slate-700/60 text-xs font-bold tracking-widest uppercase">
              Trusted by learners at
            </span>
            {["Google", "Amazon", "Flipkart", "Zomato", "Swiggy", "Razorpay", "BYJU'S"].map((c) => (
              <span key={c} className="text-slate-800/80 text-lg font-black bg-white/20 p-3 rounded-2xl backdrop-blur-2xl border border-white/25 ">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row (gradient glass) */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-500 backdrop-blur-2xl border border-white/20 rounded-3xl py-10 px-6 shadow-[0_18px_56px_rgba(0,0,0,0.14)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mb-2 flex justify-center">
                  <s.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</div>
                <div className="text-white/80 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Categories/>
      </div>
    </section>
  );
};

export default Trustedby;