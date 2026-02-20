import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCourses from "../pages/admin/AdminCourses";

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
      </Routes>
    </ProtectedRoute>
  );
}