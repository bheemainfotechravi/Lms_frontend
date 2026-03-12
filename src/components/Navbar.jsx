import React from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { name: "Browse", id: "categories" },
  { name: "Courses", id: "courses" },
  { name: "Career Ready", id: "career" },
  { name: "Skills", id: "skills" },
  { name: "For Business", id: "business" },
];

const Navbar = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300 bg-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-[70px] flex items-center relative">
<Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
  <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-900 font-black text-lg">
    L
  </div>
  <span className="text-xl font-black ">
    LearnX
  </span>
</Link>

        {/* Center Links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleScroll(link.id)}
              className="relative text-slate-900 text-md font-semibold transition-colors hover:text-[#d68d06] 
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
                after:w-0 after:bg-[#d68d06] after:transition-all hover:after:w-full"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="ml-auto flex items-center gap-3">
          <Link to="/login">
            <button className="border border-[#d68d06] text-gray-700 text-sm font-semibold px-5 py-2 rounded-xl hover:border-primary hover:text-primary transition-all">
              Log In
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-[#d68d06] text-gray-700 text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 hover:-translate-y-px transition-all">
              Register
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;