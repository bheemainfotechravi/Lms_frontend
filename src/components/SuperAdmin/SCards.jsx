import React, { useState, useEffect } from "react";
import { FiUsers, FiBookOpen, FiShield, FiBriefcase } from "react-icons/fi";
import axiosInstance from "../../utils/axiosinstance";
import StatCard from "../Admin-components/StatCard";

function SCards({ onTabChange }) { 
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuperAdminStats = async () => {
      try {
        setLoading(true);
        const [userRes, courseRes, adminRes, companyRes] = await Promise.all([
          axiosInstance.get("/admin/user/all_users").catch(() => ({ data: { users: [] } })),
          axiosInstance.get("/admin/course/active_courses").catch(() => ({ data: { activeCourses: [] } })),
          axiosInstance.get("/admin/get_all_admins").catch(() => ({ data: { admins: [] } })),
          axiosInstance.get("/superadmin/get-all-companies").catch(() => ({ data: { companies: [] } }))
        ]);

        const userCount = userRes.data?.message.users?.length || 0;
        const courseCount = courseRes.data?.activeCourses?.length || 0;
        const adminCount = adminRes.data?.admins?.length || 0;
        const companyCount = companyRes.data?.companies?.length || 0;

        const superStats = [
          {
            label: "Total Admin",
            value: userCount,
            change: "System Level",
            up: true,
            icon: FiShield,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            shadow: "hover:shadow-indigo-200",
            tabName: "admin" 
          },
          {
            label: "Total Students",
            value: adminCount,
            change:"Across Platform",
            up: true,
            icon: FiUsers,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
            shadow: "hover:shadow-rose-200",
            tabName: "overview" 
          },
          {
            label: "Registered Companies",
            value: companyCount,
            change: "Corporate",
            up: true,
            icon: FiBriefcase,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
            shadow: "hover:shadow-amber-200",
            tabName: "company" 
          },
          {
            label: "Live Courses",
            value: courseCount,
            change: "Global List",
            up: true,
            icon: FiBookOpen,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            shadow: "hover:shadow-emerald-200",
            tabName: "overview" 
          }
        ];

        setStats(superStats);
      } catch (error) {
        console.error("Error fetching SuperAdmin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-[30px] border border-slate-200" />
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
          
          onClick={() => onTabChange(stat.tabName)} 
        />
      ))}
    </section>
  );
}

export default SCards;