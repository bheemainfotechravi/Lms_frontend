import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import UserDashboard from "../pages/user/UserDashboard";
import MyCourses from "../pages/user/MyCourses";

export default function UserRoutes() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="courses" element={<MyCourses />} />
      </Routes>
    </ProtectedRoute>
  );
}
