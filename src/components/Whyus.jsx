import { BadgeCheck, Smartphone, SmartphoneCharging, Target, Users } from 'lucide-react';
import React from 'react'



const Whyus = () => {
    const WHY_US = [
  { icon: Target, title: "Industry-Aligned Curriculum", desc: "Built with input from top companies so you learn exactly what employers need.", iconBg: "bg-violet-50" },
  { icon: BadgeCheck, title: "Verified Certificates", desc: "Certificates recognized by 500+ companies across India and globally.", iconBg: "bg-cyan-50" },
  { icon: Users, title: "Expert Instructors", desc: "Learn from professionals with 10+ years of real-world experience.", iconBg: "bg-emerald-50" },
  { icon: Smartphone, title: "Learn Anywhere", desc: "Access on any device, anytime. Download lessons for offline learning.", iconBg: "bg-amber-50" },
  { icon: Users, title: "Community Support", desc: "Join thousands of learners in active discussion forums and peer groups.", iconBg: "bg-pink-50" },
  { icon: SmartphoneCharging, title: "Lifetime Access", desc: "Buy once, access forever. Free updates whenever the course improves.", iconBg: "bg-violet-50" },
];
  return (
       <section className="py-20 px-[5%] bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Why LearnX</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Succeed</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200">
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5`}>
                  <f.icon className="w-7 h-7 text-gray-800" />
                </div>
                <h3 className="text-gray-900 font-black text-base mb-2.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Whyus
