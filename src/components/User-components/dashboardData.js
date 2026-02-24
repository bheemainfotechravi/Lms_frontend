// ─────────────────────────────────────────────
//  dashboardData.js  —  All mock data for
//  the Student Dashboard. Replace each section
//  with your real API calls when ready.
// ─────────────────────────────────────────────

// 🔌 Replace with: GET /api/student/enrolled-courses
export const ENROLLED_COURSES = [
  {
    id: 1,
    title: "Complete React & Node.js Bootcamp",
    instructor: "Sarah Mitchell",
    category: "Development",
    progress: 68,
    totalHours: 48,
    doneHours: 32,
    totalLessons: 124,
    doneLessons: 84,
    emoji: "⚡",
    thumbBg: "from-violet-50 to-violet-100",
    progressBar: "bg-violet-500",
    tag: "In Progress",
    tagClass: "bg-violet-100 text-violet-600",
    lastLesson: "Hooks & State Management",
  },
  {
    id: 2,
    title: "Machine Learning A-Z with Python",
    instructor: "Dr. James Patel",
    category: "AI & ML",
    progress: 35,
    totalHours: 62,
    doneHours: 22,
    totalLessons: 180,
    doneLessons: 63,
    emoji: "🤖",
    thumbBg: "from-cyan-50 to-cyan-100",
    progressBar: "bg-cyan-500",
    tag: "In Progress",
    tagClass: "bg-cyan-100 text-cyan-600",
    lastLesson: "Linear Regression Deep Dive",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass 2025",
    instructor: "Priya Sharma",
    category: "Design",
    progress: 100,
    totalHours: 35,
    doneHours: 35,
    totalLessons: 96,
    doneLessons: 96,
    emoji: "🎨",
    thumbBg: "from-pink-50 to-pink-100",
    progressBar: "bg-pink-500",
    tag: "Completed",
    tagClass: "bg-emerald-100 text-emerald-600",
    lastLesson: "Final Project Review",
  },
  {
    id: 4,
    title: "AWS Solutions Architect Certification",
    instructor: "Mark Reynolds",
    category: "Cloud",
    progress: 12,
    totalHours: 54,
    doneHours: 6,
    totalLessons: 148,
    doneLessons: 18,
    emoji: "☁️",
    thumbBg: "from-amber-50 to-amber-100",
    progressBar: "bg-amber-500",
    tag: "Just Started",
    tagClass: "bg-amber-100 text-amber-600",
    lastLesson: "Introduction to Cloud Computing",
  },
];

// 🔌 Replace with: GET /api/student/certificates
export const CERTIFICATES = [
  {
    id: 1,
    title: "UI/UX Design Masterclass",
    issueDate: "January 2025",
    instructor: "Priya Sharma",
    emoji: "🎨",
    cardBg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    badgeClass: "bg-pink-100 text-pink-600",
    credentialId: "LX-2025-001-UIUX",
  },
  {
    id: 2,
    title: "JavaScript Advanced Concepts",
    issueDate: "November 2024",
    instructor: "Kyle Simpson",
    emoji: "⚡",
    cardBg: "from-violet-50 to-indigo-50",
    border: "border-violet-200",
    badgeClass: "bg-violet-100 text-violet-600",
    credentialId: "LX-2024-087-JSADV",
  },
];

// 🔌 Replace with: GET /api/student/leaderboard
export const LEADERBOARD = [
  { rank: 1, name: "Ritika Joshi",   avatar: "RJ", points: 4820, badge: "🥇", highlight: false },
  { rank: 2, name: "Sameer Khanna",  avatar: "SK", points: 4310, badge: "🥈", highlight: false },
  { rank: 3, name: "You",            avatar: "ME", points: 3975, badge: "🥉", highlight: true  },
  { rank: 4, name: "Anika Patel",    avatar: "AP", points: 3640, badge: "",   highlight: false },
  { rank: 5, name: "Rahul Mehta",    avatar: "RM", points: 3210, badge: "",   highlight: false },
];

// 🔌 Replace with: GET /api/student/progress-stats
export const PROGRESS_STATS = [
  { label: "Courses Completed",  value: "1 / 4",  percent: 25,  color: "bg-emerald-500" },
  { label: "Lessons Finished",   value: "261 / 548", percent: 48, color: "bg-violet-500"  },
  { label: "Hours Learned",      value: "95h / 199h",percent: 48, color: "bg-cyan-500"    },
  { label: "Weekly Goal",        value: "5h / 8h", percent: 63,  color: "bg-amber-500"   },
];

// 🔌 Replace with: GET /api/courses/recommended
export const RECOMMENDED_COURSES = [
  {
    id: 101,
    title: "Next.js 14 Full Course",
    instructor: "Traversy Media",
    price: 999,
    originalPrice: 2999,
    rating: 4.9,
    students: "8.2k",
    hours: 38,
    emoji: "🚀",
    thumbBg: "from-indigo-50 to-indigo-100",
    accentClass: "text-indigo-600",
    tag: "Trending",
    tagClass: "bg-indigo-100 text-indigo-600",
  },
  {
    id: 102,
    title: "Python for Data Science",
    instructor: "Dr. Angela Yu",
    price: 1299,
    originalPrice: 3999,
    rating: 4.8,
    students: "11.4k",
    hours: 55,
    emoji: "📊",
    thumbBg: "from-emerald-50 to-emerald-100",
    accentClass: "text-emerald-600",
    tag: "Bestseller",
    tagClass: "bg-amber-100 text-amber-600",
  },
  {
    id: 103,
    title: "Figma Pro Masterclass",
    instructor: "DesignCode",
    price: 799,
    originalPrice: 2499,
    rating: 4.7,
    students: "5.9k",
    hours: 28,
    emoji: "✏️",
    thumbBg: "from-rose-50 to-rose-100",
    accentClass: "text-rose-500",
    tag: "New",
    tagClass: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 104,
    title: "Docker & Kubernetes Mastery",
    instructor: "Bret Fisher",
    price: 1499,
    originalPrice: 4499,
    rating: 4.8,
    students: "9.7k",
    hours: 44,
    emoji: "🐳",
    thumbBg: "from-sky-50 to-sky-100",
    accentClass: "text-sky-600",
    tag: "Hot 🔥",
    tagClass: "bg-red-100 text-red-600",
  },
];

// 🔌 Replace with: GET /api/student/stats
export const STUDENT_STATS = [
  { label: "Enrolled Courses",   value: 4,      icon: "📚", color: "text-violet-600", iconBg: "bg-violet-50",  border: "border-violet-100" },
  { label: "Hours Learned",      value: "95h",  icon: "🕐", color: "text-cyan-600",   iconBg: "bg-cyan-50",    border: "border-cyan-100"   },
  { label: "Certificates",       value: 2,      icon: "🏆", color: "text-amber-600",  iconBg: "bg-amber-50",   border: "border-amber-100"  },
  { label: "Day Streak 🔥",      value: "12",   icon: "⚡", color: "text-emerald-600",iconBg: "bg-emerald-50", border: "border-emerald-100"},
];

// 🔌 Replace with: GET /api/student/profile
export const MOCK_PROFILE = {
  name:       "Ankit Verma",
  email:      "ankit.verma@gmail.com",
  phone:      "+91 98765 43210",
  location:   "Bhopal, Madhya Pradesh",
  bio:        "Passionate learner and frontend developer. Love building products and learning new technologies.",
  joinedDate: "March 2024",
  avatar:     "AV",
};