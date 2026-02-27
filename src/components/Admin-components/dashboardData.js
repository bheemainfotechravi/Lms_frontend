import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFolder,
  FiUserPlus,
  FiUsers,
  FiUserX,
} from "react-icons/fi";
export const NAV_ITEMS = [
  { icon: FiFolder, label: "Add Category", path: "/admin/category" },
  { icon: FiFolder, label: "Add Courses", path: "/admin/courses" },
];

export const STATS = [
  { label: "Total Users", value: "50,284", change: "+12%", up: true, icon: FiUsers, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", shadow: "hover:shadow-violet-200" },
  { label: "Active Courses", value: "1,247", change: "+8%", up: true, icon: FiBookOpen, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", shadow: "hover:shadow-cyan-200" },
  { label: "Pending Approvals", value: "23", change: "Urgent", up: false, icon: FiClock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", shadow: "hover:shadow-amber-200" },
  { label: "Monthly Revenue", value: "₹4.2L", change: "+22%", up: true, icon: FiDollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", shadow: "hover:shadow-emerald-200" },
];

export const RECENT_USERS = [
  { name: "Ankit Verma", email: "ankit@gmail.com", role: "student", status: "active", joined: "2h ago", avatar: "AV", color: "bg-violet-600" },
  { name: "Priya Sharma", email: "priya@gmail.com", role: "teacher", status: "active", joined: "5h ago", avatar: "PS", color: "bg-cyan-600" },
  { name: "Raj Malhotra", email: "raj@corp.com", role: "company", status: "pending", joined: "1d ago", avatar: "RM", color: "bg-amber-600" },
  { name: "Sara Khan", email: "sara@gmail.com", role: "student", status: "active", joined: "1d ago", avatar: "SK", color: "bg-emerald-600" },
  { name: "Dev Patel", email: "dev@gmail.com", role: "teacher", status: "blocked", joined: "2d ago", avatar: "DP", color: "bg-red-500" },
];

export const PENDING_COURSES = [
  { title: "Advanced Python for ML", instructor: "Dr. James", category: "AI & ML", submitted: "2h ago" },
  { title: "Full Stack React + Node", instructor: "Sarah M.", category: "Development", submitted: "5h ago" },
  { title: "AWS DevOps Masterclass", instructor: "Mark R.", category: "Cloud", submitted: "1d ago" },
  { title: "UI/UX with Figma 2025", instructor: "Priya S.", category: "Design", submitted: "2d ago" },
];

export const ACTIVITY = [
  { icon: FiUserPlus, text: "New user registered", sub: "ankit@gmail.com", time: "2 min ago" },
  { icon: FiBookOpen, text: "Course submitted for review", sub: "Advanced Python for ML", time: "15 min ago" },
  { icon: FiCheckCircle, text: "Course approved", sub: "React Bootcamp 2025", time: "1h ago" },
  { icon: FiUserX, text: "User account blocked", sub: "dev@gmail.com", time: "2h ago" },
];

export const REVENUE_DATA = [
  { month: "Sep", value: 280000 },
  { month: "Oct", value: 320000 },
  { month: "Nov", value: 290000 },
  { month: "Dec", value: 410000 },
  { month: "Jan", value: 380000 },
  { month: "Feb", value: 420000 },
];
