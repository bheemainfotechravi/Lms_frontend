import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Hand, Search, PlayCircle, BarChart3, Award, User } from "lucide-react";

// ── Components ──
import DashboardNavbar from "../../components/User-components/DashboardNavbar";
import ContinueLearning from "../../components/User-components/ContinueLearning";
import MyCourses from "../../components/User-components/MyCourses";
import RecommendedCourses from "../../components/User-components/RecommendedCourses";
import Certificates from "../../components/User-components/Certificates";

// ── Data ──
import {
  ENROLLED_COURSES,
  LEADERBOARD,
  PROGRESS_STATS,
  RECOMMENDED_COURSES,
  CERTIFICATES,
} from "../../components/User-components/dashboardData.js";
import Footer from "../../components/Footer.jsx";

function PageTitle({ children, icon: Icon }) {
  return (
    <h1
      className="text-3xl font-black text-[#0F172A] flex items-center gap-2"
      style={{ letterSpacing: "-0.5px" }}
    >
      {children} <Icon className="w-6 h-6 text-[#E3A83C]" />
    </h1>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12
      ? "Good Morning"
      : hour < 17
        ? "Good Afternoon"
        : "Good Evening";
  }, []);

  const continueWith = useMemo(() => {
    return ENROLLED_COURSES.find((c) => c.progress > 0 && c.progress < 100);
  }, []);

  const inProgressCourses = useMemo(() => {
    return ENROLLED_COURSES.filter((c) => c.progress < 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#fceed4]">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1
                className="text-3xl font-black text-[#0F172A] flex items-center gap-2"
                style={{ letterSpacing: "-0.5px" }}
              >
                {greeting}, {user?.first_name}
                <Hand className="w-6 h-6 text-[#E3A83C]" />
              </h1>

              <p className="text-[#6B7280] text-sm mt-1">
                Here's an overview of your learning journey.
              </p>
            </div>

            {continueWith && <ContinueLearning course={continueWith} />}

            <RecommendedCourses
              courses={RECOMMENDED_COURSES}
              limit={4}
              onViewAll={() => setActiveTab("recommended")}
            />

            <div className="w-full h-full">

              <MyCourses
                courses={ENROLLED_COURSES}
                limit={4}
                onViewAll={() => setActiveTab("my-courses")}
              />

            </div>
          </div>
        )}

        {/* ── RECOMMENDED ── */}
        {activeTab === "recommended" && (
          <div className="space-y-8">
            <PageTitle icon={Search}>Explore Courses</PageTitle>

            <RecommendedCourses courses={RECOMMENDED_COURSES} />
          </div>
        )}

        {/* ── MY COURSES ── */}
        {activeTab === "my-courses" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              <div className="xl:col-span-3 w-full">
                <MyCourses
                  courses={ENROLLED_COURSES}
                  limit={4}
                  onViewAll={() => setActiveTab("my-courses")}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── CONTINUE LEARNING ── */}
        {activeTab === "learn" && (
          <div className="space-y-8">
            <PageTitle icon={PlayCircle}>Continue Learning</PageTitle>

            {continueWith ? (
              <ContinueLearning course={continueWith} expanded />
            ) : (
              <div className="bg-white rounded-2xl border border-[#EAD7B1] p-12 text-center shadow-sm">
                <p className="text-[#0F172A] font-black text-lg mb-1">
                  All caught up!
                </p>

                <p className="text-[#6B7280] text-sm">
                  You've completed all in-progress courses. Enroll in something
                  new!
                </p>

                <button
                  onClick={() => setActiveTab("recommended")}
                  className="mt-6 bg-[#E3A83C] hover:bg-[#cf962c] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  Explore Courses
                  <Search className="w-4 h-4" />
                </button>
              </div>
            )}

            <MyCourses courses={inProgressCourses} title="All In-Progress Courses" />
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {activeTab === "certificates" && (
          <div className="space-y-8">
            <PageTitle icon={Award}>My Certificates</PageTitle>

            <Certificates certificates={CERTIFICATES} />
          </div>
        )}


      </main>
      <Footer />
    </div>
  );
}