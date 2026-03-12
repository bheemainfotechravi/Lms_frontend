import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F1E7]">
        <div className="w-10 h-10 border-4 border-[#EAD7B1] border-t-[#E3A83C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const fallbackPath = isAdminRoute ? "/admin/login" : "/login";

    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check if the user's role is allowed
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    // If an admin tries to go to a user page or vice versa
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}