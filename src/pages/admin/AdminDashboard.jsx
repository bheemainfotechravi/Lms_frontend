import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TopNavbar from "../../components/Admin-components/TopNavbar";
import WelcomeBanner from "../../components/Admin-components/WelcomeBenner";
import RevenueChart from "../../components/Admin-components/Revenuechart";
import ActivityFeed from "../../components/Admin-components/ActivityFeed";
import RecentUsers from "../../components/Admin-components/RecentUsers";
import PendingCourses from "../../components/Admin-components/PendingCourses";
import StatsGrid from "../../components/Admin-components/StateGrids";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar user={user} today={today} />

      <main className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <WelcomeBanner user={user} />
            <StatsGrid />
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RevenueChart />
              <ActivityFeed />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentUsers />
              <PendingCourses />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
