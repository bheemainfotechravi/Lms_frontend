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
  const path = location.pathname;
  let fallbackPath = "/login";

  if (path.startsWith("/superadmin")) fallbackPath = "/superadmin/login";
  else if (path.startsWith("/admin")) fallbackPath = "/admin/login";
  else if (path.startsWith("/company")) fallbackPath = "/company/login"; // Ye missing tha

  return <Navigate to={fallbackPath} state={{ from: location }} replace />;
}

  // 2. Authorization (Role) Check
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
   const currentUserRole = (user?.role || user?.user_type || "").toLowerCase().trim();
    
    
    const hasAccess = rolesArray.some(role => {
      const normalizedRole = role.toLowerCase().trim();
      
      // Direct Match
      if (normalizedRole === currentUserRole) return true;
      
      
      if (normalizedRole.replace(/\s/g, "") === currentUserRole?.replace(/\s/g, "")) return true;
 
      if ((normalizedRole === "student" || normalizedRole === "user") && 
          (currentUserRole === "student" || currentUserRole === "user")) return true;

      return false;
    });

    if (!hasAccess) {
      console.warn(`Access Denied for ${currentUserRole}. Allowed:`, rolesArray);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}