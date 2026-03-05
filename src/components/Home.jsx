import React, {  useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  ScrollText,
  BadgeCheck,
  Users,
} from "lucide-react";

import Footer from "./Footer";
import Courses from "./Courses";
import Categories from "./Categories";
import CareerReadyPlan from "./CareerReadyPlan";
import SkillPills from "./SkillPills";
import CareerCTASection from "./CareerCTASection";
import IBM from '../assets/home/IBM.jpg'
import Google from '../assets/home/Google.webp'
import MIT from "../assets/home/MIT.png"
import MS from "../assets/home/Ms.avif"


const NAV_LINKS = [
  { name: "Browse", id: "categories" },
  { name: "Courses", id: "courses" },
  { name: "Career Ready", id: "career" },
  { name: "Skills", id: "skills" },
  { name: "For Business", id: "business" },
];

/* ── Segmented Toggle (like screenshot) ── */
const HeroToggle = ({ active, setActive }) => {
  const tabs = [
    { key: "cert", label: "Learn & Get Certificates" },
    { key: "career", label: "Build Your Career" },
    { key: "earn", label: "Earn on LearnX" },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full p-1 shadow-sm inline-flex gap-1">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={[
                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#d68d06] text-white shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-[#f2e9d8]",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ── Main Home ── */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("cert");


  const heroCopy = {
    cert: {
      title: "Free Online Courses With Certificates & Diplomas",
      subtitle: "Learn from industry experts. Get certified. Study at your own pace.",
      placeholder: "What do you want to learn today?",
      cta: "Search",
    },
    career: {
      title: "Build Your Career With Job-Ready Skills",
      subtitle: "Guided learning paths, projects, and career support for faster outcomes.",
      placeholder: "Search a career path, role, or skill…",
      cta: "Explore",
    },
    earn: {
      title: "Earn on LearnX As An Instructor",
      subtitle: "Publish courses, grow your audience, and monetize your expertise.",
      placeholder: "Search how to become an instructor…",
      cta: "Learn More",
    },
  };

  const current = heroCopy[activeTab];

  return (
    <div
      className=" min-h-screen overflow-x-hidden"
    >
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-[5%] transition-all duration-300 bg-white/10  backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto h-[70px] flex items-center relative">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-slate-900 font-black text-lg bg-amber-600">
              L
            </div>
            <span className="text-xl font-black ">
              LearnX
            </span>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleScroll(link.id)}
                className="relative text-slate-900 text-md font-semibold transition-colors hover:text-[#d68d06]
        after:absolute after:left-0 after:-bottom-1 after:h-[2px]
        after:w-0 after:bg-[#d68d06] after:transition-all
        hover:after:w-full"
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

      {/* ════════════ HERO (LMS style like screenshot) ════════════ */}
      <section className="pt-28 pb-0 px-[5%] bg-[#F0D5A1]  border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Toggle */}
          <HeroToggle active={activeTab} setActive={setActiveTab} />

          {/* Title */}
          <div className="text-center mt-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
              {current.title}
            </h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
              {current.subtitle}
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <span className="px-4 py-4 text-gray-500">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={current.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-gray-900 text-sm bg-transparent py-4 min-w-0"
              />
              <button className="bg-[#d68d06] hover:bg-[#b77a08] text-white px-7 py-4 text-sm font-bold shrink-0">
                {current.cta}
              </button>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-10 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-5">
              Learn From World Leading Experts
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-700 font-semibold">
              <img src={Google} alt="google" className="w-24 h-16 rounded-2xl" />
              <img src={MS} alt="microsoft" className="w-18 h-16 rounded-2xl"/>
              <img src={IBM} alt="ibm" className="w-18 h-16 rounded-2xl"/>
              <img src={MIT} alt="mit" className="w-18 h-16 rounded-2xl"/>

            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 bg-[#e9b75c] rounded-2xl my-2 ">
          <div className="max-w-7xl mx-auto px-[5%] py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">Rated Excellent</p>
                  <p className="text-xs text-slate-600">Trusted by learners</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">50M+ Learners</p>
                  <p className="text-xs text-slate-600">Worldwide community</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">15M+ Graduates</p>
                  <p className="text-xs text-slate-600">Certified success</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black">190+ Countries</p>
                  <p className="text-xs text-slate-600">Global reach</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="categories">
          <Categories />
        </section>

        <section id="courses">
          <Courses />
        </section>

        <section id="career">
          <CareerReadyPlan />
        </section>

        <section id="skills">
          <SkillPills />
        </section>

        <section id="business">
          <CareerCTASection />
        </section>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <Footer />
    </div>
  );
}