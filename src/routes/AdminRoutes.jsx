import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AdminRoutes() {
  return (
    // <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    // </ProtectedRoute>
  );
}