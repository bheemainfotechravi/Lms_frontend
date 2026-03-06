import React, { useState, useEffect } from "react";
import { 
  FiBookOpen, 
  FiUsers, 
  FiLayers, 
  FiFilter, 
  FiEye, 
  FiSearch 
} from "react-icons/fi";
import TopNavbar from "../../components/Admin-components/TopNavbar";
import axiosInstance from "../../utils/axiosinstance";

const ReviewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both courses and categories simultaneously
        const [courseRes, catRes] = await Promise.all([
          axiosInstance.get("/admin/course/active-courses"),
          axiosInstance.get("/category/get")
        ]);

        if (courseRes.data?.activeCourses) {
          setCourses(courseRes.data.activeCourses);
        }

        // Assuming category API returns { success: true, categories: [...] } 
        // or a direct array. Adjust based on your actual response.
        const catData = catRes.data?.categories || catRes.data;
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error("Data Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to get Category Name by ID
  const getCategoryName = (id) => {
    const category = categories.find(cat => String(cat.id) === String(id));
    return category ? category.name : "Unknown Category";
  };

  // Logic: Filter by Dropdown AND Search Bar (matching against Category Name)
  const filteredCourses = courses.filter((course) => {
    const categoryName = getCategoryName(course.category_id).toLowerCase();
    const matchesSearch = categoryName.includes(searchQuery.toLowerCase());
    const matchesDropdown = selectedCategory === "all" || String(course.category_id) === String(selectedCategory);
    
    return matchesSearch && matchesDropdown;
  });

  // Stats Calculations
  const totalCourses = courses.length;
  const activeCategories = categories.length;
  const totalLectures = courses.reduce((acc, curr) => acc + (Number(curr.total_lectures) || 0), 0);

  return (
    <>
      <TopNavbar />
      <div className="min-h-screen p-6 text-slate-300">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Review Courses</h1>
          <p className="text-sm text-slate-500">Manage curriculum by category names.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                <FiBookOpen size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium">Total Courses</p>
                <h3 className="text-2xl font-bold text-white">{totalCourses}</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <FiLayers size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium">Categories</p>
                <h3 className="text-2xl font-bold text-white">{activeCategories}</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium">Total Lectures</p>
                <h3 className="text-2xl font-bold text-white">{totalLectures}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS & SEARCH SECTION */}
        <div className="border border-[#334155]/30 rounded-2xl overflow-hidden bg-white/5">
          <div className="p-4 border-b border-[#334155]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* SEARCH BAR */}
              {/* <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <FiSearch size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search by category..."
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}

              {/* DROPDOWN */}
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <FiFilter size={16} />
                </span>
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 appearance-none cursor-pointer text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-black text-xs uppercase tracking-wider border-b border-[#334155]/30">
                  <th className="px-6 py-4 font-semibold">Course Details</th>
                  <th className="px-6 py-4 font-semibold">Category Name</th>
                  <th className="px-6 py-4 font-semibold">Lectures</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/20">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-black">{course.title}</div>
                      <div className="text-xs text-slate-500">{course.level} • {course.duration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                        {getCategoryName(course.category_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-black font-medium">{course.total_lectures} Lessons</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-black hover:bg-violet-500/20 hover:text-violet-400 rounded-lg transition-all">
                        <FiEye size={18} title="View Details" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCourses.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No courses found matching that category name.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCourses;