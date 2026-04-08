import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Auth & Common
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/admin/Unauthorized";
import NotFound from "../components/LandingPage/NotFound";
import Home from "../components/LandingPage/Home";
import ProtectedRoute from "./guards/ProtectedRoute";

// Student
import UserDashboard from "../pages/user/UserDashboard";
import CourseDetails from "../components/User-components/CourseDetails";
import MyCourses from "../components/User-components/MyCourses";
import AllCourses from "../components/User-components/Allcourses";
import UserProfile from "../components/User-components/UserProfile";
import QuizSystem from "../components/User-components/AssessmentQuiz";
import CoursePlayer from "../components/User-components/CoursePlayer";
import CertificateView from "../components/User-components/CertificateView";
import MyCertificates from "../components/User-components/MyCertifications";
import CoursesbyCat from "../components/LandingPage/CoursesbyCat";

// Admin
import AdminLogin from "../pages/admin/AdminLogin";
import Admindashboard from "../pages/admin/AdminDashboard";
import Coursepage from "../pages/admin/Coursepage";
import ReviewCourses from "../pages/admin/ReviewCourses";
import GetUser from "../components/Admin-components/getUsers";

// SuperAdmin & Company
import SuperAdminLogin from "../components/SuperAdmin/SuperAdminLogin";
import SuperAdminDashboard from "../components/SuperAdmin/SuperAdminDashboard";
import CompanyLogin from "../components/Company/CompanyLogin";
import CompanyDashboard from "../components/Company/CompanyDashboard";
import CareerDevelopment from "../components/User-components/CareerDevelopment";
import JobApply from "../components/User-components/ApplyForJob";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}



export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/category/:id" element={<CoursesbyCat />} />
        <Route path="/courses/all" element={<AllCourses />} />

        {/* Student Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["student", "user"]}>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="mycourses" element={<MyCourses />} />
                <Route path="allcourse" element={<AllCourses />} />
                <Route path="user-profile/:slug" element={<UserProfile />} />
                <Route path="certificates" element={<MyCertificates />} />
                <Route path="career" element={<CareerDevelopment />} />
                <Route path="apply/:slug" element={<JobApply />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        {/* Learning & Quiz (Student) */}
        <Route path="/learning/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CoursePlayer /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><QuizSystem /></ProtectedRoute>} />
        <Route path="/certificate/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CertificateView /></ProtectedRoute>} />

        {/* Teacher / Admin Routes (Backend Role: "teacher") */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <Admindashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <Coursepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviewcourses"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <ReviewCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/get-users"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <GetUser />
            </ProtectedRoute>
          }
        />

        {/* Company Routes (Backend Role: "company") */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route 
          path="/company/dashboard" 
          element={ 
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </ProtectedRoute> 
          } 
        />

        {/* Super Admin Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin", "super admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}