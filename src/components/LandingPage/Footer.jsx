import React from "react";
import { FaHeart, FaLock, FaStar } from "react-icons/fa";
import { FaXTwitter, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";

const Footer = () => {
  return (
    <footer className="bg-[#fdc762] pt-16 pb-8 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-slate-900 font-black">
                L
              </div>
              <span className="text-xl font-black">LearnX</span>
            </div>
            <p className="text-slate-900 text-sm leading-relaxed mb-6 max-w-[240px]">
              Empowering learners across India and beyond with world-class online education.
            </p>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-[#ec9b05] flex items-center justify-center text-slate-700 cursor-pointer hover:bg-white/20 hover:text-primary transition">
                <FaXTwitter size={16} />
              </div>
              <div className="w-12 h-12 rounded-full bg-white border border-[#ec9b05] flex items-center justify-center text-slate-700 cursor-pointer hover:bg-white/20 hover:text-primary transition">
                <FaLinkedinIn size={16} />
              </div>
              <div className="w-12 h-12 rounded-full bg-white border border-[#ec9b05] flex items-center justify-center text-slate-700 cursor-pointer hover:bg-white/20 hover:text-primary transition">
                <FaFacebookF size={16} />
              </div>
              <div className="w-12 h-12 rounded-full bg-white border border-[#ec9b05] flex items-center justify-center text-slate-700 cursor-pointer hover:bg-white/20 hover:text-primary transition">
                <FaYoutube size={16} />
              </div>
            </div>
          </div>
          {[
            {
              title: "Platform",
              links: ["Browse Courses", "Instructors", "Pricing", "Enterprise", "Mobile App"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Press", "Contact"],
            },
            {
              title: "Support",
              links: ["Help Center", "Terms", "Privacy Policy", "Refund Policy", "Cookie Policy"],
            },
          ].map((col, i) => (
            <div key={i}>
              <p className="text-slate-900 font-black text-sm mb-5">{col.title}</p>

              {col.links.map((link, j) => (
                <p
                  key={j}
                  className="text-slate-800 text-sm mb-3 cursor-pointer hover:text-primary transition hover:underline"
                >
                  {link}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
         <p className="text-slate-900 text-xs flex items-center justify-center gap-1">
        © 2026 LearnX. All rights reserved. 
        <span>Made with</span>
        <FaHeart className="text-red-500 inline" /> 
        <span>in India.</span>
      </p>
          <p className="text-slate-900 text-xs">
           <FaLock className=" inline"/> <span> Secure Payments •</span> <GrCertificate className="inline"/> <span> ISO Certified • </span>  <FaStar  className="inline" />  <span>4.9/5 Rated</span> 
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;