import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AppLayout() {
  const { user, logout } = useAuth();

  const links = [
    { to: "/", label: "Overview" },
    { to: "/customer", label: "Customer" },
    { to: "/admin", label: "Admin" }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">Fast Food System</p>
        <h1>MERN Starter</h1>
        <p className="sidebar-copy">
          Feature-based starter for menu, orders, promotions, inventory, users, and feedback.
        </p>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-box">
          <span>{user?.username}</span>
          <small>{user?.role}</small>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

