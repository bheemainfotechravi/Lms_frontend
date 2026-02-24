// StatsRow.jsx
// Props:
//   stats — array from STUDENT_STATS in dashboardData.js

export default function StatsRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm
            hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default`}
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center text-xl mb-4`}>
            {s.icon}
          </div>

          {/* Value */}
          <p className={`text-2xl font-black ${s.color} leading-none mb-1`}>
            {s.value}
          </p>

          {/* Label */}
          <p className="text-gray-400 text-xs font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}