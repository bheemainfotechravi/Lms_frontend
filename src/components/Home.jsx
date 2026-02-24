import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  ScrollText,
  Check,
} from "lucide-react";
import Footer from "./Footer";
import CTA from "./CTA";
import Testimonials from "./Testimonials";
import Whyus from "./Whyus";
import Trustedby from "./Trustedby";
import Courses from "./Courses";

/* ── Main Home ── */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">

      {/* ── KEYFRAMES (minimal — only what Tailwind can't do) ── */}
      <style>{`
        @keyframes float  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-16px)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        .anim-float  { animation: float  4s ease-in-out infinite }
        .anim-float2 { animation: float2 3.5s ease-in-out infinite }
        .anim-pulse  { animation: pulse-dot 2s infinite }
      `}</style>

      {/* ════════════ NAVBAR ════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300
        ${scrolled ? "bg-white/20 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-gray-50/80 backdrop-blur-xl border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto h-[70px] flex items-center relative">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg">L</div>
            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text ">LearnX</span>
          </div>

          {/* Center links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {["Explore", "Courses", "Instructors", "For Business", "Pricing"].map(l => (
              <a key={l} className="text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer">{l}</a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login">
              <button className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2 rounded-xl hover:border-primary hover:text-primary transition-all">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-gradient-to-r from-primary to-secondary text-gray-700 border-gray-200 text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 hover:-translate-y-px transition-all">
                Register
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section className="min-h-screen pt-32 pb-20 px-[5%] bg-gradient-to-t from-red-200 to-slate-100 flex items-center relative overflow-hidden">

        {/* Blobs */}
        <div className="absolute top-[8%] right-[6%] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[8%] left-[2%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2
                bg-white/10 backdrop-blur-xl
                border border-white/20
                rounded-full px-4 py-1.5 mb-7
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-bold">
                India's #1 EdTech Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.07] tracking-tight mb-6 text-gray-900">
              Learn Skills<br />
              <span className=" bg-clip-text  text-gray-900">That Matter.</span><br />
              Land Jobs<br />
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">That Pay.</span>
            </h1>

            <p className="text-slate-900 text-lg leading-relaxed mb-9 max-w-md">
              Master in-demand skills with world-class courses from industry experts. Get certified, get hired — at your pace.
            </p>

            {/* Search */}
            <div className="flex bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md">
              <span className="px-4 py-4 shrink-0 text-gray-500">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search for a course, skill, or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-gray-900 text-sm bg-transparent py-4 min-w-0"
              />
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-7 text-sm font-bold shrink-0">
                Search
              </button>
            </div>


          </div>

          {/* Right — floating card */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">

              {/* Main card */}
              <div className="bg-white rounded-3xl p-7 border border-violet-100 anim-float"
                style={{ boxShadow: "0 24px 80px rgba(124,58,237,0.14), 0 4px 20px rgba(0,0,0,0.07)" }}>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shrink-0">⚡</div>
                  <div>
                    <p className="text-gray-900 font-black text-sm">React Bootcamp 2025</p>
                    <p className="text-gray-400 text-xs mt-0.5">48h · 124 lectures · Certificate</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 text-xs font-semibold">Your Progress</span>
                    <span className="text-primary text-xs font-black">68%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="w-[68%] h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  </div>
                </div>

                {[
                  { name: "Hooks & State Management", done: true },
                  { name: "React Router v6", done: true },
                  { name: "REST API Integration", done: false },
                ].map((lesson, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2.5 border-t border-gray-50">
                    <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${lesson.done ? "bg-emerald-50 border-emerald-400 text-emerald-600" : "bg-gray-50 border-gray-200"}`}>
                      {lesson.done ? <Check className="w-3.5 h-3.5" /> : null}
                    </div>
                    <span className={`text-xs ${lesson.done ? "text-gray-400 line-through" : "text-gray-700 font-semibold"}`}>
                      {lesson.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Badge: Certificate */}
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 border border-violet-100 anim-float2"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.11)" }}>
                <span className="text-xl">🏆</span>
                <div>
                  <p className="text-gray-900 text-xs font-black">Certificate Earned!</p>
                  <p className="text-red-400 text-xs font-semibold">React Developer</p>
                </div>
              </div>

              {/* Badge: Students */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 border border-violet-100 anim-float"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.11)" }}>
                <span className="text-xl">👩‍💻</span>
                <div>
                  <p className="text-gray-900 text-xs font-black">50,000+ Students</p>
                  <p className="text-primary text-xs font-semibold">Actively Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ TRUSTED BY ════════════ */}
      <Trustedby/>

      {/* ════════════ COURSES ════════════ */}
   <Courses/>

      {/* ════════════ WHY US ════════════ */}
 <Whyus/>

      {/* ════════════ TESTIMONIALS ════════════ */}
     <Testimonials/>

      {/* ════════════ CTA ════════════ */}
     <CTA/>

      {/* ════════════ FOOTER ════════════ */}
     <Footer/>
    </div>
  );
}