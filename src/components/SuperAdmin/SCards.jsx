import React, { useState, useEffect } from "react";
import { FiUsers, FiBookOpen, FiShield, FiBriefcase } from "react-icons/fi";
import axiosInstance from "../../utils/axiosinstance";

import { useNavigate } from "react-router-dom";
import StatCard from "../Admin-components/StatCard";

function SCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuperAdminStats = async () => {
      try {
        setLoading(true);

        // API calls for all data points
        const [userRes, courseRes, adminRes, companyRes] = await Promise.all([
          axiosInstance.get("/admin/user/all-users").catch(() => ({ data: { users: [] } })),
          axiosInstance.get("/admin/course/active-courses").catch(() => ({ data: { activeCourses: [] } })),
          axiosInstance.get("/superadmin/get-all-admins").catch(() => ({ data: { admins: [] } })),
          axiosInstance.get("/superadmin/get-all-companies").catch(() => ({ data: { companies: [] } }))
        ]);

        const userCount = userRes.data?.users?.length || 0;
        const courseCount = courseRes.data?.activeCourses?.length || 0;
        const adminCount = adminRes.data?.admins?.length || 0;
        const companyCount = companyRes.data?.companies?.length || 0;

        const superStats = [
          {
            label: "Total Students",
            value: userCount,
            change: "Across Platform",
            up: true,
            icon: FiUsers,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            shadow: "hover:shadow-indigo-200",
            path: "/admin/get-users"
          },
          {
            label: "Total Admins",
            value: adminCount,
            change: "System Level",
            up: true,
            icon: FiShield,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
            shadow: "hover:shadow-rose-200",
            path: "/superadmin/manage-admins"
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
            path: "/superadmin/manage-companies"
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
            path: "/admin/reviewcourses"
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
          onClick={() => navigate(stat.path)} 
        />
      ))}
    </section>
  );
}

export default SCards;