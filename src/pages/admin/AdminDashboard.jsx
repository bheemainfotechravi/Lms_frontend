import { useMemo } from "react";
import { useSelector } from "react-redux"; // Updated
import TopNavbar from "../../components/Admin-components/TopNavbar";
import WelcomeBanner from "../../components/Admin-components/WelcomeBenner";
import StatsGrid from "../../components/Admin-components/StateGrids";

export default function AdminDashboard() {
  // 1. Get user and loading state from Redux
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);

  // 2. Memoize the date so it doesn't re-calculate on every small re-render
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar user={user} today={today} />

      <main className="p-8">
        {authLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <WelcomeBanner user={user} />
            <StatsGrid />
          </div>
        )}
      </main>
    </div>
  );
}