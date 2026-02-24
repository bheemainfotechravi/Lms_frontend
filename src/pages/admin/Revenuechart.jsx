import { REVENUE_DATA } from "../data/dashboardData";

export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Revenue Overview
          </h3>
          <p className="text-slate-400 text-xs">
            Monthly earnings data
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-800">₹4.2L</p>
          <p className="text-emerald-500 text-[11px] font-bold">
            ↑ 22% vs last month
          </p>
        </div>
      </div>

      {/* CSS Bar Chart */}
      <div className="flex items-end justify-between h-48 px-2 gap-4">
        {REVENUE_DATA.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-3 group"
          >
            <div
              className="w-full bg-slate-100 rounded-t-lg transition-all duration-300 group-hover:bg-violet-500 relative"
              style={{ height: `${(d.value / 420000) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ₹{(d.value / 100000).toFixed(1)}L
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {d.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}