import React, { useState, useEffect } from "react";
import { FiUsers, FiBookOpen } from "react-icons/fi";
import axiosInstance from "../../utils/axiosinstance";
import StatCard from "./StatCard";
import { useNavigate } from "react-router-dom"; 

function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        const [userRes, courseRes] = await Promise.all([
          axiosInstance.get("/admin/user/all-users"),
          axiosInstance.get("/admin/course/active-courses")
        ]);

        const userCount = userRes.data?.users?.length || 0;
        const courseCount = courseRes.data?.activeCourses?.length || 0;

        const dynamicStats = [
          {
            label: "Total Users",
            value: userCount, 
            change: "Live",
            up: true,
            icon: FiUsers,
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
            shadow: "hover:shadow-violet-200",
            path: "/admin/get-users" 
          },
          {
            label: "Active Courses",
            value: courseCount, 
            change: "Active",
            up: true,
            icon: FiBookOpen,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            border: "border-cyan-100",
            shadow: "hover:shadow-cyan-200",
            path: "/admin/reviewcourses"
          },
        ];

        setStats(dynamicStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard 
          key={i} 
          stat={stat} 
          onClick={() => navigate(stat.path)} 
        />
      ))}
    </section>
  );
}

export default StatsGrid;