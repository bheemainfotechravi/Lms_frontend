import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Hand, Search, PlayCircle, BarChart3, Award, User } from "lucide-react";

// ── Components ──
import DashboardNavbar from "../../components/User-components/DashboardNavbar";
import ContinueLearning from "../../components/User-components/ContinueLearning";
import MyCourses from "../../components/User-components/MyCourses";
import LeaderboardProgress from "../../components/User-components/LeaderboardProgress";
import RecommendedCourses from "../../components/User-components/RecommendedCourses";
import Certificates from "../../components/User-components/Certificates";
import ProfileSettings from "../../components/User-components/ProfileSettings";

// ── Data ──
import {
  ENROLLED_COURSES,
  LEADERBOARD,
  PROGRESS_STATS,
  RECOMMENDED_COURSES,
  CERTIFICATES,
  MOCK_PROFILE,
} from "../../components/User-components/dashboardData.js";

function PageTitle({ children, icon: Icon }) {
  return (
    <h1
      className="text-2xl font-black text-gray-900 flex items-center gap-2"
      style={{ letterSpacing: "-0.5px" }}
    >
      {children} <Icon className="w-6 h-6" />
    </h1>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  }, []);

  // ✅ compute from ENROLLED_COURSES (no stale memo)
  const continueWith = useMemo(() => {
    return ENROLLED_COURSES.find((c) => c.progress > 0 && c.progress < 100);
  }, [ENROLLED_COURSES]);

  const inProgressCourses = useMemo(() => {
    return ENROLLED_COURSES.filter((c) => c.progress < 100);
  }, [ENROLLED_COURSES]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1
                className="text-2xl font-black text-gray-900 flex items-center gap-2"
                style={{ letterSpacing: "-0.5px" }}
              >
                {greeting}, {user?.first_name} <Hand className="w-6 h-6" />
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Here's an overview of your learning journey.
              </p>
            </div>
            
            {continueWith && <ContinueLearning course={continueWith} />}

            <RecommendedCourses
              courses={RECOMMENDED_COURSES}
              limit={4}
              onViewAll={() => setActiveTab("recommended")}
            />


            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <MyCourses
                  courses={ENROLLED_COURSES}
                  limit={4}
                  onViewAll={() => setActiveTab("my-courses")}
                />
              </div>

              <div className="xl:col-span-1">
                <LeaderboardProgress leaderboard={LEADERBOARD} stats={PROGRESS_STATS} compact />
              </div>
            </div>
          </div>
        )}

        {/* ── RECOMMENDED ── */}
        {activeTab === "recommended" && (
          <div className="space-y-6">
            <PageTitle icon={Search}>Explore Courses</PageTitle>
            <RecommendedCourses courses={RECOMMENDED_COURSES} />
          </div>
        )}

        {/* ── MY COURSES ── */}
        {activeTab === "my-courses" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <MyCourses courses={ENROLLED_COURSES} />
              </div>

              <div className="xl:col-span-1">
                <LeaderboardProgress leaderboard={LEADERBOARD} stats={PROGRESS_STATS} compact />
              </div>
            </div>
          </div>
        )}

        {/* ── CONTINUE LEARNING ── */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            <PageTitle icon={PlayCircle}>Continue Learning</PageTitle>

            {continueWith ? (
              <ContinueLearning course={continueWith} expanded />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-gray-900 font-black text-lg mb-1">All caught up!</p>
                <p className="text-gray-400 text-sm">
                  You've completed all in-progress courses. Enroll in something new!
                </p>
                <button
                  onClick={() => setActiveTab("recommended")}
                  className="mt-5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  Explore Courses <Search className="w-4 h-4" />
                </button>
              </div>
            )}

            <MyCourses courses={inProgressCourses} title="All In-Progress Courses" />
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <PageTitle icon={BarChart3}>Progress & Leaderboard</PageTitle>
            <LeaderboardProgress leaderboard={LEADERBOARD} stats={PROGRESS_STATS} />
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <PageTitle icon={Award}>My Certificates</PageTitle>
            <Certificates certificates={CERTIFICATES} />
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <PageTitle icon={User}>Profile & Settings</PageTitle>
            <ProfileSettings profile={MOCK_PROFILE} />
          </div>
        )}
      </main>
    </div>
  );
}