import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/admin/Unauthorized";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import UserDashboard from "./pages/user/UserDashboard";
import ProtectedRoute from "./routes/guards/ProtectedRoute";
import Admindashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/Adminlogin";
import CategoryPage from "./pages/admin/Categorypage";

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

          {/* Roles */}
          <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<Admindashboard />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role Based Route Groups */}
          <Route path="/admin" element={<AdminRoutes />} />
          <Route path="/user" element={<UserRoutes />} />
          <Route path="/teacher" element={<TeacherRoutes />} />
          <Route path="/company" element={<CompanyRoutes />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

         </Routes>
       </Router>
     </AuthProvider>
    </>
  );
}
