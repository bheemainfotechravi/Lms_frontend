import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyStudents from "../pages/teacher/MyStudents";

export default function TeacherRoutes() {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="students" element={<MyStudents />} />
      </Routes>
    </ProtectedRoute>
  );
}