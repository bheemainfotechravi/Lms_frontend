import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import Employees from "../pages/company/Employees";

export default function CompanyRoutes() {
  return (
    <ProtectedRoute allowedRoles={["company"]}>
      <Routes>
        <Route path="/" element={<CompanyDashboard />} />
        <Route path="employees" element={<Employees />} />
      </Routes>
    </ProtectedRoute>
  );
}
