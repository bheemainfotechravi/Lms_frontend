import React from 'react'


const Footer = () => {
  return (
     <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">L</div>
                <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LearnX</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-[240px]">
                Empowering learners across India and beyond with world-class online education.
              </p>
              <div className="flex gap-2">
                {["𝕏", "in", "f", "▶"].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:text-primary hover:border-primary transition-colors">
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
                <p className="text-gray-900 font-black text-sm mb-5">{col.title}</p>
                {col.links.map((link, j) => (
                  <p key={j} className="text-slate-500 text-sm mb-3 cursor-pointer hover:text-primary transition-colors">{link}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-xs">© 2025 LearnX. All rights reserved. Made with ❤️ in India.</p>
            <p className="text-gray-400 text-xs">🔒 Secure Payments &nbsp;•&nbsp; 📜 ISO Certified &nbsp;•&nbsp; ⭐ 4.9/5 Rated</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
