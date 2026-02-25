import React from 'react'


const Footer = () => {
  return (
     <footer className="bg-[#fdc762] pt-16 pb-8 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-slate-900 font-black">L</div>
                <span className="text-xl font-black ">LearnX</span>
              </div>
              <p className="text-slate-900 text-sm leading-relaxed mb-6 max-w-[240px]">
                Empowering learners across India and beyond with world-class online education.
              </p>
              <div className="flex gap-2">
                {["𝕏", "in", "f", "▶"].map((icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-white border border-[#ec9b05] flex items-center justify-center text-slate-700 text-md cursor-pointer hover:text-primary hover:bg-white/10 hover:text-slate-700 transition-colors">
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Platform", links: ["Browse Courses", "Instructors", "Pricing", "Enterprise", "Mobile App"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Press", "Contact"] },
              { title: "Support", links: ["Help Center", "Terms", "Privacy Policy", "Refund Policy", "Cookie Policy"] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-slate-900 font-black text-sm mb-5">{col.title}</p>
                {col.links.map((link, j) => (
                  <p key={j} className="text-slate-800 text-sm mb-3 cursor-pointer hover:text-primary transition-colors hover:underline">{link}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
            <p className="text-slate-900 text-xs">© 2025 LearnX. All rights reserved. Made with ❤️ in India.</p>
            <p className="text-slate-900 text-xs">🔒 Secure Payments &nbsp;•&nbsp; 📜 ISO Certified &nbsp;•&nbsp; ⭐ 4.9/5 Rated</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
