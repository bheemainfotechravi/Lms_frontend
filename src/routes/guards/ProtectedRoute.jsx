import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const isAuthenticated = !!token; 
  const location = useLocation();

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0D5A1]">
        <div className="w-10 h-10 border-4 border-white/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  
  if (!isAuthenticated) {
    const path = location.pathname;
    let fallbackPath = "/login";

    
    if (path.startsWith("/admin")) fallbackPath = "/login"; 
    else if (path.startsWith("/company")) fallbackPath = "/login";
    else if (path.startsWith("/teacher")) fallbackPath = "/login";

    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    
    const currentUserRole = (user?.role || "").toLowerCase().replace(/\s+/g, "").trim();

    const hasAccess = rolesArray.some((role) => {
      const normalizedAllowedRole = role.toLowerCase().replace(/\s+/g, "").trim();
      
      
      if (normalizedAllowedRole === currentUserRole) return true;
      
      
      if (
        (normalizedAllowedRole === "student" || normalizedAllowedRole === "user") &&
        (currentUserRole === "student" || currentUserRole === "user")
      ) {
        return true;
      }

      return false;
    });

    if (!hasAccess) {
      console.warn(`Access Denied. User Role: [${currentUserRole}], Required: [${rolesArray}]`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}