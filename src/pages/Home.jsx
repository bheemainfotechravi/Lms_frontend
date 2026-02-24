import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { icon: "⚡", label: "Development",  count: 142 },
  { icon: "📊", label: "Data Science", count: 86  },
  { icon: "🎨", label: "Design",       count: 74  },
  { icon: "📈", label: "Marketing",    count: 63  },
  { icon: "🔐", label: "Cybersecurity",count: 49  },
  { icon: "🤖", label: "AI & ML",      count: 91  },
  { icon: "☁️", label: "Cloud",        count: 58  },
  { icon: "📱", label: "Mobile Dev",   count: 67  },
];

const COURSES = [
  {
    id: 1,
    title: "Complete React & Node.js Bootcamp",
    instructor: "Sarah Mitchell",
    rating: 4.9, students: "12.4k", price: 1299, originalPrice: 3999,
    tag: "Bestseller", tagClass: "bg-amber-100 text-amber-700",
    level: "Intermediate", hours: 48, category: "Development", emoji: "⚡",
    thumbClass: "from-violet-50 to-violet-100",
    accentClass: "text-violet-600", borderHover: "hover:border-violet-400",
    btnClass: "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white",
  },
  {
    id: 2,
    title: "Machine Learning A-Z with Python",
    instructor: "Dr. James Patel",
    rating: 4.8, students: "9.1k", price: 1499, originalPrice: 4499,
    tag: "Hot 🔥", tagClass: "bg-red-100 text-red-600",
    level: "Advanced", hours: 62, category: "AI & ML", emoji: "🤖",
    thumbClass: "from-cyan-50 to-cyan-100",
    accentClass: "text-cyan-600", borderHover: "hover:border-cyan-400",
    btnClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass 2025",
    instructor: "Priya Sharma",
    rating: 4.9, students: "7.8k", price: 999, originalPrice: 2999,
    tag: "New", tagClass: "bg-emerald-100 text-emerald-700",
    level: "Beginner", hours: 35, category: "Design", emoji: "🎨",
    thumbClass: "from-pink-50 to-pink-100",
    accentClass: "text-pink-500", borderHover: "hover:border-pink-400",
    btnClass: "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white",
  },
  {
    id: 4,
    title: "AWS Solutions Architect Certification",
    instructor: "Mark Reynolds",
    rating: 4.7, students: "15.2k", price: 1799, originalPrice: 5499,
    tag: "Bestseller", tagClass: "bg-amber-100 text-amber-700",
    level: "Intermediate", hours: 54, category: "Cloud", emoji: "☁️",
    thumbClass: "from-amber-50 to-amber-100",
    accentClass: "text-amber-500", borderHover: "hover:border-amber-400",
    btnClass: "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white",
  },
];

const STATS = [
  { value: "50K+",   label: "Active Students",   icon: "👨‍🎓" },
  { value: "1,200+", label: "Expert Courses",     icon: "📚" },
  { value: "300+",   label: "Top Instructors",    icon: "🏆" },
  { value: "98%",    label: "Satisfaction Rate",  icon: "⭐" },
];

const WHY_US = [
  { icon: "🎯", title: "Industry-Aligned Curriculum", desc: "Built with input from top companies so you learn exactly what employers need.", iconBg: "bg-violet-50" },
  { icon: "🏅", title: "Verified Certificates",       desc: "Certificates recognized by 500+ companies across India and globally.",         iconBg: "bg-cyan-50"    },
  { icon: "👨‍🏫", title: "Expert Instructors",         desc: "Learn from professionals with 10+ years of real-world experience.",           iconBg: "bg-emerald-50" },
  { icon: "📱", title: "Learn Anywhere",              desc: "Access on any device, anytime. Download lessons for offline learning.",        iconBg: "bg-amber-50"   },
  { icon: "🤝", title: "Community Support",           desc: "Join thousands of learners in active discussion forums and peer groups.",      iconBg: "bg-pink-50"    },
  { icon: "♾️", title: "Lifetime Access",             desc: "Buy once, access forever. Free updates whenever the course improves.",        iconBg: "bg-violet-50"  },
];

const TESTIMONIALS = [
  {
    name: "Ankit Verma",  role: "Frontend Developer @ Zomato",
    text: "This platform completely transformed my career. The React bootcamp was worth every rupee — I got placed within 2 months!",
    avatar: "AV", cardClass: "bg-violet-50 border border-violet-100", avatarClass: "bg-violet-100 text-violet-700 border-2 border-violet-400",
  },
  {
    name: "Ritika Joshi", role: "Data Analyst @ Flipkart",
    text: "The ML course content is top-notch and very practical. I landed my dream job within 3 months of completing it.",
    avatar: "RJ", cardClass: "bg-cyan-50 border border-cyan-100", avatarClass: "bg-cyan-100 text-cyan-700 border-2 border-cyan-400",
  },
  {
    name: "Sameer Khanna", role: "UX Designer @ Swiggy",
    text: "Best investment I ever made. The instructors are genuine industry professionals who teach what actually matters.",
    avatar: "SK", cardClass: "bg-emerald-50 border border-emerald-100", avatarClass: "bg-emerald-100 text-emerald-700 border-2 border-emerald-400",
  },
];

/* ── Star Rating ── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
          fill={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          stroke={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
          strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
      <span className="text-amber-800 text-xs font-bold ml-1">{rating}</span>
    </div>
  );
}

/* ── Course Card ── */
function CourseCard({ course }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl ${course.borderHover}`}>
      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${course.thumbClass} flex items-center justify-center relative`}>
        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl">
          {course.emoji}
        </div>
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${course.tagClass}`}>
          {course.tag}
        </span>
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-gray-500 border border-gray-200">
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${course.accentClass}`}>{course.category}</p>
        <h3 className="text-gray-900 text-sm font-bold leading-snug mb-2">{course.title}</h3>
        <p className="text-gray-400 text-xs mb-3">by {course.instructor}</p>

        <div className="flex items-center justify-between mb-2">
          <StarRating rating={course.rating} />
          <span className="text-gray-400 text-xs">{course.students} students</span>
        </div>

        <div className="flex gap-4 mb-4">
          <span className="text-gray-500 text-xs">🕐 {course.hours}h content</span>
          <span className="text-gray-500 text-xs">📜 Certificate</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-gray-900 text-xl font-black">₹{course.price}</span>
            <span className="text-gray-400 text-xs line-through ml-2">₹{course.originalPrice}</span>
          </div>
          <button className={`border text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 ${course.btnClass}`}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ tag, title, highlight, desc }) {
  return (
    <div>
      <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">{tag}</p>
      <h2 className="text-4xl font-black tracking-tight mb-3 text-gray-900">
        {title}{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{highlight}</span>
      </h2>
      {desc && <p className="text-slate-500 text-base">{desc}</p>}
    </div>
  );
}

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
        ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-gray-50/80 backdrop-blur-xl border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto h-[70px] flex items-center relative">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg">L</div>
            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text ">LearnX</span>
          </div>

          {/* Center links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {["Explore","Courses","Instructors","For Business","Pricing"].map(l => (
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
      <section className="min-h-screen pt-32 pb-20 px-[5%] flex items-center relative overflow-hidden"
        style={{ background: "linear-gradient(155deg, #ffffff 0%, #F5F3FF 45%, #ECFEFF 100%)" }}>

        {/* Blobs */}
        <div className="absolute top-[8%] right-[6%] w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }}/>
        <div className="absolute bottom-[8%] left-[2%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)" }}/>
        <div className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "30px 30px" }}/>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-7 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary anim-pulse"/>
              <span className="text-primary text-xs font-bold">🚀 India's #1 EdTech Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.07] tracking-tight mb-6 text-gray-900">
              Learn Skills<br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">That Matter.</span><br/>
              Land Jobs<br/>
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">That Pay.</span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed mb-9 max-w-md">
              Master in-demand skills with world-class courses from industry experts. Get certified, get hired — at your pace.
            </p>

            {/* Search */}
            <div className="flex bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md">
              <span className="px-4 py-4 text-xl shrink-0">🔍</span>
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

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-400 text-sm">Trending:</span>
              {["React","Python","UI/UX","AWS","ChatGPT"].map(tag => (
                <span key={tag} className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer hover:bg-violet-50 hover:text-primary hover:border-violet-300 transition-all">
                  {tag}
                </span>
              ))}
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
                    <div className="w-[68%] h-2 rounded-full bg-gradient-to-r from-primary to-secondary"/>
                  </div>
                </div>

                {[
                  { name: "Hooks & State Management", done: true  },
                  { name: "React Router v6",          done: true  },
                  { name: "REST API Integration",     done: false },
                ].map((lesson, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2.5 border-t border-gray-50">
                    <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border ${lesson.done ? "bg-emerald-50 border-emerald-400 text-emerald-600" : "bg-gray-50 border-gray-200"}`}>
                      {lesson.done ? "✓" : ""}
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
                  <p className="text-emerald-500 text-xs font-semibold">React Developer</p>
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
      <div className="bg-white border-y border-gray-100 py-6 px-[5%]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-10 flex-wrap">
          <span className="text-gray-300 text-xs font-bold tracking-widest uppercase">Trusted by learners at</span>
          {["Google","Amazon","Flipkart","Zomato","Swiggy","Razorpay","BYJU'S"].map(c => (
            <span key={c} className="text-gray-400 text-sm font-black">{c}</span>
          ))}
        </div>
      </div>

      {/* ════════════ STATS ════════════ */}
      <div className="py-16 px-[5%] bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</div>
              <div className="text-white/75 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════ CATEGORIES ════════════ */}
      <section className="py-20 px-[5%] bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader tag="Browse by Category" title="Explore Top" highlight="Categories" desc="From coding to creative arts — find your path to success." />
            <button className="border border-primary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-7 text-center cursor-pointer shadow-sm hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <p className="text-gray-900 font-bold text-sm mb-1">{cat.label}</p>
                <p className="text-gray-400 text-xs">{cat.count} Courses</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ COURSES ════════════ */}
      <section className="py-20 px-[5%] bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader tag="Featured Courses" title="Most Popular" highlight="Right Now" desc="Handpicked courses loved by thousands of students." />
            <button className="border border-primary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0">
              View All Courses →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </div>
      </section>

      {/* ════════════ WHY US ════════════ */}
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
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center text-2xl mb-5`}>{f.icon}</div>
                <h3 className="text-gray-900 font-black text-base mb-2.5">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
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
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
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

      {/* ════════════ CTA ════════════ */}
      <section className="py-24 px-[5%] border-t border-violet-100"
        style={{ background: "linear-gradient(155deg, #F5F3FF 0%, #EDE9FE 40%, #ECFEFF 100%)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-7 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary anim-pulse"/>
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
              <button className="bg-gradient-to-r from-primary to-secondary text-white font-black px-9 py-4 rounded-xl text-base hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg">
                🚀 Start Learning Free
              </button>
            </Link>
            <Link to="/courses">
              <button className="bg-white border border-gray-200 text-gray-700 font-bold px-9 py-4 rounded-xl text-base hover:bg-violet-50 hover:border-violet-300 transition-all">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
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
                {["𝕏","in","f","▶"].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:text-primary hover:border-primary transition-colors">
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Platform", links: ["Browse Courses","Instructors","Pricing","Enterprise","Mobile App"] },
              { title: "Company",  links: ["About Us","Careers","Blog","Press","Contact"] },
              { title: "Support",  links: ["Help Center","Terms","Privacy Policy","Refund Policy","Cookie Policy"] },
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
    </div>
  );
}