import { ACTIVITY } from "./dashboardData";

export default function ActivityFeed() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>

      <div className="space-y-6">
        {ACTIVITY.map((activity, i) => {
          const Icon = activity.icon;

          return (
            <div key={`${activity.text}-${i}`} className="flex gap-4 relative">
              {i !== ACTIVITY.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-slate-50" />
              )}

              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg bg-slate-50 border border-slate-100">
                {Icon ? <Icon /> : null}
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-700 truncate">
                  {activity.text}
                </p>
                <p className="text-[11px] text-slate-400 truncate mb-1">
                  {activity.sub}
                </p>
                <span className="text-[10px] font-bold text-slate-300 uppercase">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
