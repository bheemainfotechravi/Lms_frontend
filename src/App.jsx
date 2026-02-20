import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";

import Login from "./pages/auth/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import Unauthorized from "./pages/admin/Unauthorized";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
     <AuthProvider>
       <Router>
         <Routes>
            {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role Based Route Groups */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          <Route path="/company/*" element={<CompanyRoutes />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

         </Routes>
       </Router>
     </AuthProvider>
    </>
  );
}
