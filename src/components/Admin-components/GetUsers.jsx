import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiCalendar,
  FiSearch
} from "react-icons/fi";
import TopNavbar from "./TopNavbar";
import axiosInstance from "../../utils/axiosinstance";

const GetUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users Data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/user/all-users");
        
        // Mounting data from response.data.users
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. Search Filter Logic (Filter by Name or Email)
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  // 3. Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <TopNavbar />
      <div className="min-h-screen p-6 text-slate-300">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">User Management</h1>
          <p className="text-sm text-slate-500">View and manage all registered platform users.</p>
        </div>

        {/* STATS SUMMARY (Optional but looks good) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E293B] border border-[#334155] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium">Total Registered</p>
                <h3 className="text-2xl font-bold text-white">{users.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & TABLE SECTION */}
        <div className="border border-[#334155]/30 rounded-2xl overflow-hidden bg-white/5">
          <div className="p-4 border-b border-[#334155]/30">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-black text-xs uppercase tracking-wider border-b border-[#334155]/30">
                  <th className="px-6 py-4 font-semibold">User Details</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/20">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-slate-500">Loading users...</td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold border border-violet-500/30">
                          {user.first_name[0]}{user.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-black">{user.first_name} {user.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-black font-medium">
                          <FiMail size={14} className="text-slate-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FiPhone size={12} className="text-slate-400" />
                          {user.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.role === 'admin' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        <FiShield size={12} />
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiCalendar size={14} className="text-slate-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {!loading && filteredUsers.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GetUser;