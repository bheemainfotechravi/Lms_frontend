import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
    { icon: "⚡", label: "Development", count: 142 },
    { icon: "📊", label: "Data Science", count: 86 },
    { icon: "🎨", label: "Design", count: 74 },
    { icon: "📈", label: "Marketing", count: 63 },
    { icon: "🔐", label: "Cybersecurity", count: 49 },
    { icon: "🤖", label: "AI & ML", count: 91 },
    { icon: "☁️", label: "Cloud", count: 58 },
    { icon: "📱", label: "Mobile Dev", count: 67 },
];

const COURSES = [
    {
        id: 1,
        title: "Complete React & Node.js Bootcamp",
        instructor: "Sarah Mitchell",
        rating: 4.9,
        students: "12.4k",
        price: 1299,
        originalPrice: 3999,
        tag: "Bestseller",
        tagColor: "#D97706",
        tagBg: "#FEF3C7",
        level: "Intermediate",
        hours: 48,
        category: "Development",
        emoji: "⚡",
        accentColor: "#7C3AED",
        bgGradient: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
    },
    {
        id: 2,
        title: "Machine Learning A-Z with Python",
        instructor: "Dr. James Patel",
        rating: 4.8,
        students: "9.1k",
        price: 1499,
        originalPrice: 4499,
        tag: "Hot 🔥",
        tagColor: "#DC2626",
        tagBg: "#FEE2E2",
        level: "Advanced",
        hours: 62,
        category: "AI & ML",
        emoji: "🤖",
        accentColor: "#06B6D4",
        bgGradient: "linear-gradient(135deg, #ECFEFF, #CFFAFE)",
    },
    {
        id: 3,
        title: "UI/UX Design Masterclass 2025",
        instructor: "Priya Sharma",
        rating: 4.9,
        students: "7.8k",
        price: 999,
        originalPrice: 2999,
        tag: "New",
        tagColor: "#059669",
        tagBg: "#D1FAE5",
        level: "Beginner",
        hours: 35,
        category: "Design",
        emoji: "🎨",
        accentColor: "#EC4899",
        bgGradient: "linear-gradient(135deg, #FDF2F8, #FCE7F3)",
    },
    {
        id: 4,
        title: "AWS Solutions Architect Certification",
        instructor: "Mark Reynolds",
        rating: 4.7,
        students: "15.2k",
        price: 1799,
        originalPrice: 5499,
        tag: "Bestseller",
        tagColor: "#D97706",
        tagBg: "#FEF3C7",
        level: "Intermediate",
        hours: 54,
        category: "Cloud",
        emoji: "☁️",
        accentColor: "#F59E0B",
        bgGradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
    },
];

const STATS = [
    { value: "50K+", label: "Active Students", icon: "👨‍🎓" },
    { value: "1,200+", label: "Expert Courses", icon: "📚" },
    { value: "300+", label: "Top Instructors", icon: "🏆" },
    { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
];

const TESTIMONIALS = [
    {
        name: "Ankit Verma",
        role: "Frontend Developer @ Zomato",
        text: "This platform completely transformed my career. The React bootcamp was worth every rupee — I got placed within 2 months!",
        avatar: "AV",
        color: "#7C3AED",
        bg: "#F5F3FF",
        border: "#EDE9FE",
    },
    {
        name: "Ritika Joshi",
        role: "Data Analyst @ Flipkart",
        text: "The ML course content is top-notch and very practical. I landed my dream job within 3 months of completing it.",
        avatar: "RJ",
        color: "#06B6D4",
        bg: "#ECFEFF",
        border: "#CFFAFE",
    },
    {
        name: "Sameer Khanna",
        role: "UX Designer @ Swiggy",
        text: "Best investment I ever made. The instructors are genuine industry professionals who teach what actually matters.",
        avatar: "SK",
        color: "#10B981",
        bg: "#ECFDF5",
        border: "#A7F3D0",
    },
];

const WHY_US = [
    { icon: "🎯", title: "Industry-Aligned Curriculum", desc: "Built with input from top companies so you learn exactly what employers need.", color: "#7C3AED", bg: "#F5F3FF" },
    { icon: "🏅", title: "Verified Certificates", desc: "Certificates recognized by 500+ companies across India and globally.", color: "#06B6D4", bg: "#ECFEFF" },
    { icon: "👨‍🏫", title: "Expert Instructors", desc: "Learn from professionals with 10+ years of real-world experience.", color: "#10B981", bg: "#ECFDF5" },
    { icon: "📱", title: "Learn Anywhere", desc: "Access on any device, anytime. Download lessons for offline learning.", color: "#F59E0B", bg: "#FFFBEB" },
    { icon: "🤝", title: "Community Support", desc: "Join thousands of learners in active discussion forums and peer groups.", color: "#EC4899", bg: "#FDF2F8" },
    { icon: "♾️", title: "Lifetime Access", desc: "Buy once, access forever. Free updates whenever the course improves.", color: "#7C3AED", bg: "#F5F3FF" },
];

function StarRating({ rating }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                    fill={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
                    stroke={s <= Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
                    strokeWidth="1">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
            ))}
            <span style={{ color: "#92400E", fontSize: "12px", fontWeight: 700, marginLeft: "4px" }}>{rating}</span>
        </div>
    );
}

function CourseCard({ course }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#fff",
                border: `1.5px solid ${hovered ? course.accentColor : "#E5E7EB"}`,
                borderRadius: "18px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered ? `0 20px 60px ${course.accentColor}22` : "0 2px 16px rgba(0,0,0,0.07)",
                cursor: "pointer",
            }}
        >
            <div style={{ height: "155px", background: course.bgGradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#fff", boxShadow: `0 8px 32px ${course.accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>
                    {course.emoji}
                </div>
                <div style={{ position: "absolute", top: "12px", left: "12px", background: course.tagBg, color: course.tagColor, fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", border: `1px solid ${course.tagColor}33` }}>
                    {course.tag}
                </div>
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.9)", color: "#6B7280", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
                    {course.level}
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                <p style={{ color: course.accentColor, fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{course.category}</p>
                <h3 style={{ color: "#111827", fontSize: "15px", fontWeight: 700, lineHeight: 1.45, marginBottom: "8px" }}>{course.title}</h3>
                <p style={{ color: "#9CA3AF", fontSize: "13px", marginBottom: "12px" }}>by {course.instructor}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <StarRating rating={course.rating} />
                    <span style={{ color: "#9CA3AF", fontSize: "12px" }}>{course.students} students</span>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ color: "#6B7280", fontSize: "12px" }}>🕐 {course.hours}h content</span>
                    <span style={{ color: "#6B7280", fontSize: "12px" }}>📜 Certificate</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #F3F4F6" }}>
                    <div>
                        <span style={{ color: "#111827", fontSize: "20px", fontWeight: 800 }}>₹{course.price}</span>
                        <span style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "line-through", marginLeft: "8px" }}>₹{course.originalPrice}</span>
                    </div>
                    <button style={{ background: hovered ? course.accentColor : "transparent", color: hovered ? "#fff" : course.accentColor, border: `1.5px solid ${course.accentColor}`, borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.25s ease" }}>
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const fn = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-16px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }

        .fu1 { animation: fadeUp 0.7s 0.0s ease both; }
        .fu2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fu3 { animation: fadeUp 0.7s 0.30s ease both; }
        .fu4 { animation: fadeUp 0.7s 0.45s ease both; }

        .nav-link { color: #6B7280; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #111827; }

        .cat-card { transition: all 0.25s ease; cursor: pointer; background: #fff; border: 1.5px solid #F3F4F6; border-radius: 16px; padding: 28px 20px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .cat-card:hover { transform: translateY(-5px); border-color: #C4B5FD; box-shadow: 0 14px 40px rgba(124,58,237,0.12); }

        .feat-card { transition: all 0.25s ease; background: #fff; border: 1.5px solid #F3F4F6; border-radius: 18px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .feat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.1); }

        .testi-card { transition: all 0.25s ease; border-radius: 18px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .testi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.1); }

        .tag-pill { cursor: pointer; transition: all 0.2s; }
        .tag-pill:hover { background: #EDE9FE !important; color: #7C3AED !important; border-color: #C4B5FD !important; }

        .view-btn { transition: all 0.25s; }
        .view-btn:hover { background: #7C3AED !important; color: #fff !important; border-color: #7C3AED !important; }

        .cta-btn { transition: all 0.25s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(124,58,237,0.35) !important; }
        .cta-ghost:hover { background: #F5F3FF !important; border-color: #C4B5FD !important; }

        .foot-link { cursor: pointer; transition: color 0.2s; }
        .foot-link:hover { color: #7C3AED !important; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F9FAFB; }
        ::-webkit-scrollbar-thumb { background: #7C3AED; border-radius: 99px; }
        ::selection { background: #EDE9FE; color: #7C3AED; }
            `}</style>

            <div style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", color: "#111827", overflowX: "hidden" }}>

                {/* ══════════ NAVBAR ══════════ */}
                <nav style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                    background: scrollY > 40 ? "rgba(255,255,255,0.97)" : "rgba(250,250,250,0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: scrollY > 40 ? "1px solid #E5E7EB" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    padding: "0 5%",
                }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", height: "70px", display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff" }}>L</div>
                            <span style={{ fontSize: "22px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
                        </div>

                        {/* centered navigation (absolute centering) */}
                        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "36px", zIndex: 2 }}>
                            {["Explore", "Courses", "Instructors", "For Business", "Pricing"].map(l => (
                                <a key={l} className="nav-link">{l}</a>
                            ))}
                        </div>

                        {/* auth buttons grouped on the right */}
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
                            <Link to="/login">
                                <button style={{ background: "transparent", border: "1.5px solid #E5E7EB", color: "#374151", padding: "9px 20px", borderRadius: "9px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                                    Log In
                                </button>
                            </Link>

                            <Link to="/register">
                                <button style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", border: "none", color: "#fff", padding: "9px 22px", borderRadius: "9px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                                    Register
                                </button>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* ══════════ HERO ══════════ */}
                <section style={{
                    minHeight: "100vh", padding: "130px 5% 80px",
                    background: "linear-gradient(155deg, #ffffff 0%, #F5F3FF 45%, #ECFEFF 100%)",
                    display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
                }}>
                    {/* Blobs */}
                    <div style={{ position: "absolute", top: "8%", right: "6%", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "8%", left: "2%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
                    {/* Dots */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)", backgroundSize: "30px 30px", opacity: 0.55, maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 100%)", pointerEvents: "none" }} />

                    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}>

                        {/* Left */}
                        <div>
                            <div className="fu1" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", border: "1.5px solid #EDE9FE", borderRadius: "24px", padding: "7px 18px", marginBottom: "30px", boxShadow: "0 4px 20px rgba(124,58,237,0.1)" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7C3AED", animation: "pulseDot 2s infinite" }} />
                                <span style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700 }}>🚀 India's #1 EdTech Platform</span>
                            </div>

                            <h1 className="fu2" style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, lineHeight: 1.07, letterSpacing: "-2px", marginBottom: "26px", color: "#0F172A" }}>
                                Learn Skills
                                <br />
                                <span style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That Matter.</span>
                                <br />
                                Land Jobs
                                <br />
                                <span style={{ background: "linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That Pay.</span>
                            </h1>

                            <p className="fu3" style={{ color: "#64748B", fontSize: "18px", lineHeight: 1.8, marginBottom: "38px", maxWidth: "460px" }}>
                                Master in-demand skills with world-class courses from industry experts. Get certified, get hired — at your pace.
                            </p>

                            {/* Search Bar */}
                            <div className="fu3" style={{ display: "flex", background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", marginBottom: "26px", boxShadow: "0 4px 28px rgba(0,0,0,0.08)" }}>
                                <span style={{ padding: "16px 10px 16px 20px", fontSize: "20px" }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search for a course, skill, or topic..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ flex: 1, border: "none", outline: "none", color: "#111827", fontSize: "15px", fontFamily: "inherit", background: "transparent", padding: "16px 8px" }}
                                />
                                <button style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", border: "none", color: "#fff", padding: "0 28px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                                    Search
                                </button>
                            </div>

                            {/* Trending Tags */}
                            <div className="fu4" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: 500 }}>Trending:</span>
                                {["React", "Python", "UI/UX", "AWS", "ChatGPT"].map(tag => (
                                    <span key={tag} className="tag-pill" style={{ background: "#fff", border: "1.5px solid #E2E8F0", color: "#374151", fontSize: "13px", fontWeight: 600, padding: "5px 14px", borderRadius: "20px" }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right — Floating Card */}
                        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                            <div style={{ position: "relative", width: "100%", maxWidth: "395px" }}>

                                {/* Main Progress Card */}
                                <div style={{ background: "#fff", borderRadius: "22px", padding: "28px", boxShadow: "0 24px 80px rgba(124,58,237,0.14), 0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #EDE9FE", animation: "float 4s ease-in-out infinite" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
                                        <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>⚡</div>
                                        <div>
                                            <p style={{ color: "#111827", fontWeight: 800, fontSize: "15px" }}>React Bootcamp 2025</p>
                                            <p style={{ color: "#9CA3AF", fontSize: "12px", marginTop: "3px" }}>48h · 124 lectures · Certificate</p>
                                        </div>
                                    </div>

                                    <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "14px", marginBottom: "18px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                            <span style={{ color: "#374151", fontSize: "13px", fontWeight: 600 }}>Your Progress</span>
                                            <span style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 800 }}>68%</span>
                                        </div>
                                        <div style={{ background: "#E2E8F0", borderRadius: "99px", height: "8px" }}>
                                            <div style={{ width: "68%", height: "100%", borderRadius: "99px", background: "linear-gradient(90deg, #7C3AED, #06B6D4)" }} />
                                        </div>
                                    </div>

                                    {[
                                        { name: "Hooks & State Management", done: true },
                                        { name: "React Router v6", done: true },
                                        { name: "REST API Integration", done: false },
                                    ].map((lesson, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 0", borderTop: "1px solid #F1F5F9" }}>
                                            <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, background: lesson.done ? "#ECFDF5" : "#F9FAFB", border: `1.5px solid ${lesson.done ? "#10B981" : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#10B981", fontWeight: 700 }}>
                                                {lesson.done ? "✓" : ""}
                                            </div>
                                            <span style={{ color: lesson.done ? "#9CA3AF" : "#374151", fontSize: "13px", fontWeight: lesson.done ? 400 : 600, textDecoration: lesson.done ? "line-through" : "none" }}>
                                                {lesson.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Badge: Certificate */}
                                <div style={{ position: "absolute", top: "-20px", right: "-20px", background: "#fff", borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.11)", border: "1.5px solid #EDE9FE", animation: "float2 3.5s ease-in-out infinite" }}>
                                    <span style={{ fontSize: "22px" }}>🏆</span>
                                    <div>
                                        <p style={{ color: "#111827", fontSize: "13px", fontWeight: 800 }}>Certificate Earned!</p>
                                        <p style={{ color: "#10B981", fontSize: "11px", fontWeight: 600 }}>React Developer</p>
                                    </div>
                                </div>

                                {/* Badge: Students */}
                                <div style={{ position: "absolute", bottom: "-20px", left: "-20px", background: "#fff", borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.11)", border: "1.5px solid #EDE9FE", animation: "float 3s ease-in-out infinite" }}>
                                    <span style={{ fontSize: "22px" }}>👩‍💻</span>
                                    <div>
                                        <p style={{ color: "#111827", fontSize: "13px", fontWeight: 800 }}>50,000+ Students</p>
                                        <p style={{ color: "#7C3AED", fontSize: "11px", fontWeight: 600 }}>Actively Learning</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════ TRUSTED BY ══════════ */}
                <div style={{ background: "#fff", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", padding: "26px 5%" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
                        <span style={{ color: "#CBD5E1", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Trusted by learners at</span>
                        {["Google", "Amazon", "Flipkart", "Zomato", "Swiggy", "Razorpay", "BYJU'S"].map(c => (
                            <span key={c} style={{ color: "#94A3B8", fontSize: "15px", fontWeight: 800 }}>{c}</span>
                        ))}
                    </div>
                </div>

                {/* ══════════ STATS ══════════ */}
                <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)", padding: "64px 5%" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                        {STATS.map((s, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "34px", marginBottom: "8px" }}>{s.icon}</div>
                                <div style={{ fontSize: "44px", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", marginBottom: "6px" }}>{s.value}</div>
                                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════ CATEGORIES ══════════ */}
                <section style={{ padding: "90px 5%", background: "#FAFAFA" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px" }}>
                            <div>
                                <p style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Browse by Category</p>
                                <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, letterSpacing: "-0.8px", marginBottom: "12px" }}>
                                    Explore Top{" "}
                                    <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Categories</span>
                                </h2>
                                <p style={{ color: "#64748B", fontSize: "16px" }}>From coding to creative arts — find your path to success.</p>
                            </div>
                            <button className="view-btn" style={{ background: "#fff", border: "1.5px solid #7C3AED", color: "#7C3AED", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                View All →
                            </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                            {CATEGORIES.map((cat, i) => (
                                <div key={i} className="cat-card">
                                    <div style={{ fontSize: "38px", marginBottom: "12px" }}>{cat.icon}</div>
                                    <p style={{ color: "#111827", fontWeight: 700, fontSize: "15px", marginBottom: "5px" }}>{cat.label}</p>
                                    <p style={{ color: "#94A3B8", fontSize: "13px" }}>{cat.count} Courses</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════ COURSES ══════════ */}
                <section style={{ padding: "90px 5%", background: "#fff", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px" }}>
                            <div>
                                <p style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Featured Courses</p>
                                <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, letterSpacing: "-0.8px", marginBottom: "12px" }}>
                                    Most Popular{" "}
                                    <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Right Now</span>
                                </h2>
                                <p style={{ color: "#64748B", fontSize: "16px" }}>Handpicked courses loved by thousands of students.</p>
                            </div>
                            <button className="view-btn" style={{ background: "#fff", border: "1.5px solid #7C3AED", color: "#7C3AED", padding: "10px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                View All Courses →
                            </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                            {COURSES.map(course => <CourseCard key={course.id} course={course} />)}
                        </div>
                    </div>
                </section>

                {/* ══════════ WHY US ══════════ */}
                <section style={{ padding: "90px 5%", background: "#FAFAFA", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "56px" }}>
                            <p style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Why LearnX</p>
                            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, letterSpacing: "-0.8px" }}>
                                Everything You Need to{" "}
                                <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Succeed</span>
                            </h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                            {WHY_US.map((f, i) => (
                                <div key={i} className="feat-card">
                                    <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "20px" }}>
                                        {f.icon}
                                    </div>
                                    <h3 style={{ color: "#111827", fontWeight: 800, fontSize: "16px", marginBottom: "10px" }}>{f.title}</h3>
                                    <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.8 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════ TESTIMONIALS ══════════ */}
                <section style={{ padding: "90px 5%", background: "#fff", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "56px" }}>
                            <p style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Student Stories</p>
                            <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 900, letterSpacing: "-0.8px" }}>
                                Real Results from{" "}
                                <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Real People</span>
                            </h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className="testi-card" style={{ background: t.bg, border: `1.5px solid ${t.border}` }}>
                                    <div style={{ display: "flex", marginBottom: "16px" }}>
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: "#F59E0B", fontSize: "18px" }}>★</span>)}
                                    </div>
                                    <p style={{ color: "#374151", fontSize: "15px", lineHeight: 1.85, marginBottom: "26px", fontStyle: "italic" }}>
                                        "{t.text}"
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: `${t.color}18`, border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, fontWeight: 900, fontSize: "14px" }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p style={{ color: "#111827", fontWeight: 800, fontSize: "14px" }}>{t.name}</p>
                                            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "2px" }}>{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════ CTA ══════════ */}
                <section style={{ padding: "100px 5%", background: "linear-gradient(155deg, #F5F3FF 0%, #EDE9FE 40%, #ECFEFF 100%)", borderTop: "1px solid #EDE9FE" }}>
                    <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#fff", border: "1.5px solid #EDE9FE", borderRadius: "24px", padding: "7px 18px", marginBottom: "30px", boxShadow: "0 4px 20px rgba(124,58,237,0.1)" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7C3AED", animation: "pulseDot 2s infinite" }} />
                            <span style={{ color: "#7C3AED", fontSize: "13px", fontWeight: 700 }}>Join 50,000+ learners today</span>
                        </div>

                        <h2 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "20px", color: "#0F172A" }}>
                            Your Dream Career is{" "}
                            <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                One Course Away
                            </span>
                        </h2>

                        <p style={{ color: "#64748B", fontSize: "18px", lineHeight: 1.8, marginBottom: "44px" }}>
                            First 7 days free — no credit card required. Cancel anytime.
                        </p>

                        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
                            <button className="cta-btn" style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", border: "none", color: "#fff", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(124,58,237,0.28)" }}>
                                🚀 Start Learning Free
                            </button>
                            <button className="cta-ghost" style={{ background: "#fff", border: "1.5px solid #E2E8F0", color: "#374151", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
                                Browse Courses
                            </button>
                        </div>
                    </div>
                </section>

                {/* ══════════ FOOTER ══════════ */}
                <footer style={{ background: "#fff", borderTop: "1px solid #F1F5F9", padding: "64px 5% 32px" }}>
                    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 900, color: "#fff" }}>L</div>
                                    <span style={{ fontSize: "22px", fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnX</span>
                                </div>
                                <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.8, maxWidth: "260px", marginBottom: "24px" }}>
                                    Empowering learners across India and beyond with world-class online education.
                                </p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {["𝕏", "in", "f", "▶"].map((icon, i) => (
                                        <div key={i} style={{ width: "38px", height: "38px", borderRadius: "9px", background: "#F8FAFC", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "14px", cursor: "pointer" }}>
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
                                    <p style={{ color: "#111827", fontWeight: 800, fontSize: "15px", marginBottom: "20px" }}>{col.title}</p>
                                    {col.links.map((link, j) => (
                                        <p key={j} className="foot-link" style={{ color: "#64748B", fontSize: "14px", marginBottom: "13px" }}>{link}</p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid #F1F5F9" }}>
                            <p style={{ color: "#94A3B8", fontSize: "13px" }}>© 2025 LearnX. All rights reserved. Made with ❤️ in India.</p>
                            <p style={{ color: "#94A3B8", fontSize: "13px" }}>🔒 Secure Payments &nbsp;•&nbsp; 📜 ISO Certified &nbsp;•&nbsp; ⭐ 4.9/5 Rated</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}