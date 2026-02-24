import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1️⃣ Still checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const role = user?.role

  // 2️⃣ Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${role}/login`}
        state={{ from: location }}
        replace
      />
    );
  }

  // 3️⃣ Role restriction (if provided)
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ Allowed
  return children;
}