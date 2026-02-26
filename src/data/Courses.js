
import AI from '../assets/Courses-images/AI.webp'
import Cloud from '../assets/Courses-images/Cloud.webp'
import UI from '../assets/Courses-images/UI-UX.webp'
import Webdevelopment from '../assets/Courses-images/web-developement.jpg'


const COURSES = [
  {
    id: 1,
    title: "Complete React & Node.js Bootcamp",
    instructor: "Sarah Mitchell",
    rating: 4.9, students: "12.4k", price: 1299, originalPrice: 3999,
    tag: "Bestseller", tagClass: "bg-amber-100 text-amber-700",
    level: "Intermediate", hours: 48, category: "Development",
    image: Webdevelopment,
    thumbClass: "from-violet-50 to-violet-100",
    accentClass: "text-violet-600", borderHover: "hover:border-violet-400",
    btnClass: "border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white",
  },
  {
    id: 2,
    title: "Machine Learning A-Z with Python",
    instructor: "Dr. James Patel",
    rating: 4.8, students: "9.1k", price: 1499, originalPrice: 4499,
    tag: "Hot", tagClass: "bg-red-100 text-red-600",
    level: "Advanced", hours: 62, category: "AI & ML",
    image: AI,
    thumbClass: "from-cyan-50 to-cyan-100",
    accentClass: "text-cyan-600", borderHover: "hover:border-cyan-400",
    btnClass: "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass 2025",
    instructor: "Priya Sharma",
    rating: 4.9, students: "7.8k", price: 999, originalPrice: 2999,
    tag: "New", tagClass: "bg-emerald-100 text-emerald-700",
    level: "Beginner", hours: 35, category: "Design",
    image: UI,
    thumbClass: "from-pink-50 to-pink-100",
    accentClass: "text-pink-500", borderHover: "hover:border-pink-400",
    btnClass: "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white",
  },
  {
    id: 4,
    title: "AWS Solutions Architect Certification",
    instructor: "Mark Reynolds",
    rating: 4.7, students: "15.2k", price: 1799, originalPrice: 5499,
    tag: "Bestseller", tagClass: "bg-amber-100 text-amber-700",
    level: "Intermediate", hours: 54, category: "Cloud",
    image: Cloud,
    thumbClass: "from-amber-50 to-amber-100",
    accentClass: "text-amber-500", borderHover: "hover:border-amber-400",
    btnClass: "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white",
  },
];

export default COURSES