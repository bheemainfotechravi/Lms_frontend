import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/admin/Unauthorized";
import Home from "../components/LandingPage/Home";
import ProtectedRoute from "./guards/ProtectedRoute";
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
import AdminLogin from "../pages/admin/AdminLogin";
import Admindashboard from "../pages/admin/AdminDashboard";
import Coursepage from "../pages/admin/Coursepage";
import ReviewCourses from "../pages/admin/ReviewCourses";
import GetUser from "../components/Admin-components/getUsers";
import SuperAdminDashboard from "../components/SuperAdmin/SuperAdminDashboard";
import CompanyDashboard from "../components/Company/CompanyDashboard";
import CareerDevelopment from "../components/User-components/CareerDevelopment";
import JobApply from "../components/User-components/ApplyForJob";
import RoleSelection from "../components/LandingPage/RoleSelection";
import AdminRegister from "../pages/auth/AdminRegistraion";
import ForgotPassword from "../pages/auth/Forgotpassword";
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
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/course/:slug" element={<CourseDetails />} />
        <Route path="/category/:slug" element={<CoursesbyCat />} />
        <Route path="/courses/all" element={<AllCourses />} />
        <Route path="/selectrole" element={<RoleSelection />} />
        <Route path="/admin/registration" element={<AdminRegister />} />
        <Route path="/recoverpassword" element={<ForgotPassword />} />
        <Route path="/user/*"element={<ProtectedRoute allowedRoles={["student", "user"]}>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="mycourses" element={<MyCourses />} />
                <Route path="allcourse" element={<AllCourses />} />
                <Route path="user-profile/:slug" element={<UserProfile />} />
                <Route path="certificates" element={<MyCertificates />} />
                <Route path="career" element={<CareerDevelopment />} />
                <Route path="apply/:slug" element={<JobApply />} />
              </Routes>
            </ProtectedRoute>}/>
        <Route path="/learning/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CoursePlayer /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><QuizSystem /></ProtectedRoute>} />
        <Route path="/certificate/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CertificateView /></ProtectedRoute>} />
        <Route path="/admin/dashboard"element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><Admindashboard /></ProtectedRoute>}/>
        <Route path="/admin/courses"element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><Coursepage /></ProtectedRoute>}/>
        <Route path="/admin/reviewcourses"element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><ReviewCourses /> </ProtectedRoute>}/>
        <Route path="/admin/get-users"element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><GetUser /></ProtectedRoute>}/>
        <Route path="/company/dashboard" element={ <ProtectedRoute allowedRoles={["company"]}><CompanyDashboard /></ProtectedRoute>}/>
        <Route path="/superadmin/dashboard"element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminDashboard /></ProtectedRoute>}/>
      </Routes>
    </>
  );
}