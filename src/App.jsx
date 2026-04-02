import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. Toast Import kiya
import { AuthProvider } from "./context/AuthContext";

// Auth & Commons
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/admin/Unauthorized";
import NotFound from "./components/LandingPage/NotFound";
import Home from './components/LandingPage/Home';
import ProtectedRoute from "./routes/guards/ProtectedRoute";

// Student Components
import UserDashboard from "./pages/user/UserDashboard";
import CourseDetails from "./components/User-components/CourseDetails";
import MyCourses from "./components/User-components/MyCourses";
import AllCourses from "./components/User-components/Allcourses";
import UserProfile from './components/User-components/UserProfile';
import QuizSystem from './components/User-components/AssessmentQuiz';
import CoursePlayer from './components/User-components/CoursePlayer';
import CertificateView from './components/User-components/CertificateView';
import MyCertificates from './components/User-components/MyCertifications';
import CoursesbyCat from './components/LandingPage/CoursesbyCat';

// Admin (Teacher/Staff)
import AdminLogin from "./pages/admin/AdminLogin";
import Admindashboard from "./pages/admin/AdminDashboard";
import Coursepage from "./pages/admin/Coursepage";
import ReviewCourses from "./pages/admin/ReviewCourses";
import GetUser from "./components/Admin-components/getUsers";

// SuperAdmin & Corporate
import SuperAdminLogin from './components/SuperAdmin/SuperAdminLogin';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import CompanyLogin from './components/Company/CompanyLogin';
import CompanyDashboard from './components/Company/CompanyDashboard';

 // Testing
// import TestPage from './components/Test';

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
<Toaster position="top-center" toastOptions={
  {style: 
  {fontFamily: 'Plus Jakarta Sans, sans-serif',
  borderRadius: '24px',
  padding: '16px 24px',
  fontWeight: '700',}}}/>
        
        <Router>
          <ScrollToTop /> 
          <Routes>
            {/* Testing Route
            <Route path="/test-toast" element={<TestPage />} /> */}

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/course/:id" element={<CourseDetails/>} />
            <Route path="/category/:id" element={<CoursesbyCat />} /> 
            <Route path="/courses/all" element={<AllCourses />} />

            {/* Student Protected Routes */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={["student", "user"]}><UserDashboard /></ProtectedRoute>}/>
            <Route path="/user/mycourses" element={<ProtectedRoute allowedRoles={["student", "user"]}><MyCourses /></ProtectedRoute>} /> 
            <Route path="/user/allcourse" element={<ProtectedRoute allowedRoles={["student", "user"]}><AllCourses /></ProtectedRoute>} /> 
            <Route path="/user/user-profile/:slug" element={<ProtectedRoute allowedRoles={["student", "user"]}><UserProfile /></ProtectedRoute>} /> 
            <Route path="/learning/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CoursePlayer /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><QuizSystem /></ProtectedRoute>} />
            <Route path="/certificate/:id" element={<ProtectedRoute allowedRoles={["student", "user"]}><CertificateView /></ProtectedRoute>} />
            <Route path="/user/certificates" element={<ProtectedRoute allowedRoles={["student", "user"]}><MyCertificates /></ProtectedRoute>} />

            {/* Teacher / Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><Admindashboard /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={["admin"]}><Coursepage /></ProtectedRoute>} />
            <Route path="/admin/reviewcourses" element={<ProtectedRoute allowedRoles={["admin"]}><ReviewCourses /></ProtectedRoute>} />
            <Route path="/admin/get-users" element={<ProtectedRoute allowedRoles={["admin"]}><GetUser /></ProtectedRoute>} />

            {/* Corporate / Company Routes */}
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
           

            {/* Super Admin Routes */}
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route path="/superadmin/dashboard" element={
              <ProtectedRoute allowedRoles={["super admin", "superadmin"]}><SuperAdminDashboard /></ProtectedRoute>
            }/>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}