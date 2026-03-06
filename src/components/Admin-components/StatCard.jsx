import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiTrendingUp } from "react-icons/fi";

const StatCard = ({ stat, onClick }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = stat.icon;

  // Logic for counting up animation
  useEffect(() => {
    let start = 0;
    const end = parseInt(stat.value);
    if (start === end) {
        setDisplayValue(end);
        return;
    }

    let totalMiliseconds = 1000;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [stat.value]);

  // Helper to add leading zero for numbers 0-9
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num.toLocaleString();
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl bg-white border ${stat.border} shadow-sm transition-all duration-300 hover:-translate-y-1 ${stat.shadow} group cursor-pointer active:scale-95`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}
        >
          {Icon ? <Icon /> : null}
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
        >
          {stat.change}
        </span>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
        {formatNumber(displayValue)}
      </h3>
    </div>
  );
};

export default StatCard;