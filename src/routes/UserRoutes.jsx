import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import UserDashboard from "../pages/user/UserDashboard";
import MyCourses from "../pages/user/MyCourses";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";

export default function UserRoutes() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/courses" element={<MyCourses />} />
      </Routes>
    </ProtectedRoute>
  );
}
