// LeaderboardProgress.jsx
// Props:
//   leaderboard — array from LEADERBOARD in dashboardData.js
//   stats       — array from PROGRESS_STATS in dashboardData.js
//   compact     — boolean, shows condensed version on dashboard tab

export default function LeaderboardProgress({
  leaderboard = [],
  stats       = [],
  compact     = false,
}) {
  return (
    <div className={`flex flex-col gap-5 ${compact ? "" : "xl:flex-row"}`}>

      {/* ── Progress Stats ── */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${compact ? "w-full" : "flex-1"}`}>
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-gray-900 font-black text-sm">Overall Progress</h3>
          <p className="text-gray-400 text-xs mt-0.5">Your learning stats this month</p>
        </div>

        <div className="p-6 space-y-5">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-xs font-semibold">{s.label}</span>
                <span className="text-gray-900 text-xs font-black">{s.value}</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`${s.color} rounded-full h-2 transition-all duration-700`}
                  style={{ width: `${s.percent}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1 text-right">{s.percent}%</p>
            </div>
          ))}
        </div>

        {/* Weekly activity heatmap (compact placeholder) */}
        {!compact && (
          <div className="px-6 pb-6">
            <p className="text-gray-700 text-xs font-semibold mb-3">Weekly Activity</p>
            <div className="flex items-end gap-1.5">
              {[3, 5, 2, 8, 6, 4, 7].map((h, i) => {
                const days = ["M", "T", "W", "T", "F", "S", "S"];
                const today = new Date().getDay();
                const isToday = i === (today === 0 ? 6 : today - 1);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-md transition-all ${isToday ? "bg-primary" : "bg-violet-100"}`}
                      style={{ height: `${h * 6}px` }}
                      title={`${h}h`}
                    />
                    <span className={`text-xs font-semibold ${isToday ? "text-primary" : "text-gray-300"}`}>
                      {days[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Leaderboard ── */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${compact ? "w-full" : "flex-1"}`}>
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-black text-sm">Leaderboard</h3>
            <p className="text-gray-400 text-xs mt-0.5">Top learners this week</p>
          </div>
          <span className="bg-violet-50 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-violet-100">
            🏆 Top 5
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-6 py-3.5 transition-colors
                ${entry.highlight
                  ? "bg-violet-50 border-l-4 border-primary"
                  : "hover:bg-gray-50"
                }`}
            >
              {/* Rank */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0
                ${entry.rank === 1 ? "bg-amber-100 text-amber-600"   :
                  entry.rank === 2 ? "bg-gray-100 text-gray-500"     :
                  entry.rank === 3 ? "bg-orange-100 text-orange-500" :
                  "bg-gray-50 text-gray-400"}`}>
                {entry.badge || entry.rank}
              </div>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0
                ${entry.highlight
                  ? "bg-gradient-to-br from-primary to-secondary text-white"
                  : "bg-gray-100 text-gray-600"
                }`}>
                {entry.avatar}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${entry.highlight ? "text-primary" : "text-gray-800"}`}>
                  {entry.name}
                  {entry.highlight && (
                    <span className="ml-1.5 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full font-semibold">
                      You
                    </span>
                  )}
                </p>
                {/* Mini points bar */}
                <div className="bg-gray-100 rounded-full h-1 mt-1 max-w-[120px]">
                  <div
                    className={`rounded-full h-1 ${entry.highlight ? "bg-primary" : "bg-gray-300"}`}
                    style={{ width: `${(entry.points / leaderboard[0].points) * 100}%` }}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="text-right shrink-0">
                <p className={`text-sm font-black ${entry.highlight ? "text-primary" : "text-gray-700"}`}>
                  {entry.points.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-400 text-xs text-center">
            Keep learning to climb the leaderboard! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}