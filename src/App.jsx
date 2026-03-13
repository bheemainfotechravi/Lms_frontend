import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/admin/Unauthorized";
// import NotFound from "./components/NotFound";
import Home from "./components/LandingPage/Home";
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
import CoursePlayer from "./components/User-components/CoursePlayer";
import CategoryCourses from "./components/User-components/CategoryCourses"
import AllCourses from "./components/User-components/AllCourses";
import NotFound from "./components/LandingPage/NotFound";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:id" element={<CategoryCourses />} />

            {/* Roles */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={"user"}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/mycourses" element={<ProtectedRoute allowedRoles={"user"}><MyCourses /></ProtectedRoute>} />
            <Route path="/user/allcourse" element={<ProtectedRoute allowedRoles={"user"}><AllCourses /></ProtectedRoute>} />
            <Route path="/learning/:id" element={<ProtectedRoute allowedRoles={"user"}><CoursePlayer /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><Admindashboard /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/category" element={<CategoryPage />} />
            <Route path="/admin/courses" element={<Coursepage />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/reviewcourses" element={<ReviewCourses />} />
            <Route path="/admin/get-users" element={<GetUser />} />
            <Route path="/courses/all" element={<AllCourses />} />
            

            {/* Role Based Route Groups */}
            {/* <Route path="/admin" element={<AdminRoutes />} />
          <Route path="/user" element={<UserRoutes />} />
          <Route path="/teacher" element={<TeacherRoutes />} />
          <Route path="/company" element={<CompanyRoutes />} /> */}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
            {/* user */}


          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}


