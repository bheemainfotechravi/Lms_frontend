import { STATS } from "./dashboardData";
import StatCard from "./Statcard";

 function StatsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat, i) => (
        <StatCard key={i} stat={stat} />
      ))}
    </section>
  );
}

export default StatsGrid;