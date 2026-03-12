import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles, loginPath = "/admin/login" }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}