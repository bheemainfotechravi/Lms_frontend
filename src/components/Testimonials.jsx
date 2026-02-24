import React from 'react'
import TESTIMONIALS from '../data/Testimonials.js'
const Testimonials = () => {
  return (
     <section className="py-20 px-[5%] bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Student Stories</p>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              Real Results from{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Real People</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`rounded-2xl p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200 ${t.cardClass}`}>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm ${t.avatarClass}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 font-black text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonials
