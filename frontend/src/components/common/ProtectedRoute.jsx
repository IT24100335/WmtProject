import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isAdminRole } from "../../utils/roles";

export function ProtectedRoute({ children, adminOnly = false, customerOnly = false }) {
  const { isAuthenticated, bootstrapping, user } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <div className="page-state">Loading your session...</div>;
  }

  if (!isAuthenticated) {
    const loginPath = adminOnly ? "/admin/login" : "/customer/login";
    return <Navigate replace state={{ from: location }} to={loginPath} />;
  }

  if (adminOnly && !isAdminRole(user?.role)) {
    return <Navigate replace to="/customer" />;
  }

  if (customerOnly && isAdminRole(user?.role)) {
    return <Navigate replace to="/" />;
  }

  return children;
}
