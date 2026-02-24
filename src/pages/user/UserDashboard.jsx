import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

// ── Components ──
import DashboardNavbar from "../../components/User-components/DashboardNavbar";
import StatsRow from "../../components/User-components/StatsRow";
import ContinueLearning from "../../components/User-components/ContinueLearning";
import MyCourses from "../../components/User-components/MyCourses";
import LeaderboardProgress from "../../components/User-components/LeaderboardProgress";
import RecommendedCourses from "../../components/User-components/RecommendedCourses";
import Certificates from "../../components/User-components/Certificates";
import ProfileSettings from "../../components/User-components/ProfileSettings";

// ── Data ──
import {
  STUDENT_STATS,
  ENROLLED_COURSES,
  CERTIFICATES,
  LEADERBOARD,
  PROGRESS_STATS,
  RECOMMENDED_COURSES,
  MOCK_PROFILE,
} from "../../components/User-components/dashboardData.js";

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // The course to resume (first in-progress course)
  const continueWith = ENROLLED_COURSES.find(
    (c) => c.progress > 0 && c.progress < 100
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky Top Navbar with Tab Bar ── */}
      <DashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ── Page Body ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome heading */}
            <div>
              <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
                {greeting}, {user?.name?.split(" ")[0] || "Student"} 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Here's an overview of your learning journey.
              </p>
            </div>

            {/* Stats */}
            <StatsRow stats={STUDENT_STATS} />

            {/* ── RECOMMENDED TAB ── */}
            {activeTab === "recommended" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
                  Explore Courses 🔍
                </h1>
                <RecommendedCourses courses={RECOMMENDED_COURSES} />
              </div>
            )}
            {/* Recommended */}
            <RecommendedCourses
              courses={RECOMMENDED_COURSES}
              limit={4}
              onViewAll={() => setActiveTab("recommended")}
            />

            {/* Continue Learning banner */}
            {continueWith && <ContinueLearning course={continueWith} />}

            {/* Two column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* My Courses — takes 2/3 */}
              {/* <div className="xl:col-span-2">
                <MyCourses
                  courses={ENROLLED_COURSES}
                  limit={4}
                  onViewAll={() => setActiveTab("my-courses")}
                />
              </div> */}
              {/* Leaderboard — takes 1/3 */}
              {/* <div className="xl:col-span-1">
                <LeaderboardProgress
                  leaderboard={LEADERBOARD}
                  stats={PROGRESS_STATS}
                  compact
                />
              </div> */}
            </div>

          </div>
        )}

        {/* ── MY COURSES TAB ── */}
        {activeTab === "my-courses" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              My Courses 📚
            </h1>
            <StatsRow stats={STUDENT_STATS} />
            <MyCourses courses={ENROLLED_COURSES} />
          </div>
        )}

        {/* ── CONTINUE LEARNING TAB ── */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              Continue Learning 🎥
            </h1>
            {continueWith
              ? <ContinueLearning course={continueWith} expanded />
              : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="text-gray-900 font-black text-lg mb-1">All caught up!</p>
                  <p className="text-gray-400 text-sm">You've completed all in-progress courses. Enroll in something new!</p>
                  <button
                    onClick={() => setActiveTab("recommended")}
                    className="mt-5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-all"
                  >
                    Explore Courses →
                  </button>
                </div>
              )
            }
            {/* Show all in-progress courses */}
            <MyCourses
              courses={ENROLLED_COURSES.filter((c) => c.progress < 100)}
              title="All In-Progress Courses"
            />
          </div>
        )}

        {/* ── LEADERBOARD / PROGRESS TAB ── */}
        {/* {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              Progress & Leaderboard 📈
            </h1>
            <StatsRow stats={STUDENT_STATS} />
            <LeaderboardProgress
              leaderboard={LEADERBOARD}
              stats={PROGRESS_STATS}
            />
          </div>
        )} */}

        {/* ── CERTIFICATES TAB ── */}
        {/* {activeTab === "certificates" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              My Certificates 🏆
            </h1>
            <Certificates certificates={CERTIFICATES} />
          </div>
        )} */}

        {/* ── PROFILE & SETTINGS TAB ── */}
        {/* {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              Profile & Settings 👤
            </h1>
            <ProfileSettings profile={MOCK_PROFILE} />
          </div>
        )} */}
      </main>
    </div>
  );
}