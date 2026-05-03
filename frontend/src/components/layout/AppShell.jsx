import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatRole } from "../../utils/formatters";
import { isAdminRole } from "../../utils/roles";

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = isAdminRole(user?.role);
  const isCustomerArea = location.pathname.startsWith("/customer");
  const isAdminArea = location.pathname.startsWith("/admin");
  const isPortalHome = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/admin/login" ||
    location.pathname === "/customer/login" ||
    location.pathname === "/customer/register";

  return (
    <div className="site-shell">
      <header className={isAuthPage ? "top-nav top-nav-compact" : "top-nav"}>
        <Link className="brand" to={isAdmin ? "/admin" : isCustomerArea ? "/customer" : "/"}>
          Crave<span>Bites</span>
        </Link>
        <nav className="top-links">
          {isPortalHome ? (
            <>
              <NavLink to="/customer">Customer App</NavLink>
              <NavLink to="/admin/login">Admin</NavLink>
            </>
          ) : null}
          {isCustomerArea && !isAuthPage ? (
            <>
              <NavLink to="/customer" end>
                Menu
              </NavLink>
              {user && !isAdmin ? <NavLink to="/customer/profile">My Activity</NavLink> : null}
            </>
          ) : null}
          {isAdmin && !isAuthPage ? <NavLink to="/admin">Dashboard</NavLink> : null}
        </nav>
        <div className="top-actions">
          {user && !isAuthPage ? (
            <>
              <div className="user-chip">
                <strong>{user.username}</strong>
                <span>{formatRole(user.role)}</span>
              </div>
              {!isAdmin && location.pathname !== "/customer/profile" ? <Link className="ghost-btn" to="/customer/profile">Profile</Link> : null}
              <button className="ghost-btn" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : !isAuthPage ? (
            <>
              {!isAdminArea ? <Link className="ghost-btn" to="/customer/login">Login</Link> : null}
              {!isCustomerArea ? <Link className="primary-btn" to="/customer/register">Sign Up</Link> : null}
              {!isPortalHome && !isCustomerArea ? <Link className="ghost-btn" to="/admin/login">Admin Login</Link> : null}
            </>
          ) : (
            <div className="auth-top-note">
              {isAdminArea ? <Link className="ghost-btn" to="/">Home</Link> : null}
              {isCustomerArea ? <Link className="ghost-btn" to="/">Home</Link> : null}
            </div>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
