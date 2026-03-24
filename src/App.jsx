import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react"; 
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/admin/Unauthorized";
import NotFound from "./components/LandingPage/NotFound";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./routes/guards/ProtectedRoute";
import Admindashboard from "./pages/admin/AdminDashboard";
import CourseDetails from "./components/User-components/CourseDetails";
import CategoryPage from "./pages/admin/Categorypage";
import Coursepage from "./pages/admin/Coursepage";
import ReviewCourses from "./pages/admin/ReviewCourses";
import GetUser from "./components/Admin-components/getUsers";
import AdminLogin from "./pages/admin/AdminLogin";
import MyCourses from "./components/User-components/MyCourses";
import AllCourses from "./components/User-components/Allcourses";
import Home from './components/LandingPage/Home';
import UserProfile from './components/User-components/UserProfile';
import QuizSystem from './components/User-components/AssessmentQuiz';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop /> 
          
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/qs" element={<QuizSystem />} />

            {/* Roles */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={"user"}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/mycourses" element={<ProtectedRoute allowedRoles={"user"}><MyCourses /></ProtectedRoute>} /> 
            <Route path="/user/allcourse" element={<ProtectedRoute allowedRoles={"user"}><AllCourses /></ProtectedRoute>} /> 
            <Route path="/user/user-profile/:id" element={<ProtectedRoute allowedRoles={"user"}><UserProfile /></ProtectedRoute>} /> 
            
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><Admindashboard /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/category" element={<CategoryPage />} />
            <Route path="/admin/courses" element={<Coursepage />} />
            <Route path="/course/:id" element={<CourseDetails/>} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/reviewcourses" element={<ReviewCourses />} />
            <Route path="/admin/get-users" element={<GetUser />} />
            <Route path="/courses/all" element={<AllCourses />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}