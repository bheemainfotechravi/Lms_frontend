import { Rocket } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const CTA = () => {
  return (
     <section className="py-24 px-[5%] border-t border-violet-100"
        style={{ background: "linear-gradient(155deg, #F5F3FF 0%, #EDE9FE 40%, #ECFEFF 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-7 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary anim-pulse" />
            <span className="text-primary text-xs font-bold">Join 50,000+ learners today</span>
          </div>

          <h2 className="text-5xl font-black tracking-tight mb-5 text-gray-900">
            Your Dream Career is{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">One Course Away</span>
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            First 7 days free — no credit card required. Cancel anytime.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register">
              <span className="inline-flex items-center gap-2">
                <Rocket className="w-5 h-5" /> Start Learning Free
              </span>
            </Link>
            <Link to="/courses">
              <button className="bg-white border border-gray-200 text-gray-700 font-bold px-9 py-4 rounded-xl text-base hover:bg-violet-50 hover:border-violet-300 transition-all">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>
  )
}

export default CTA
