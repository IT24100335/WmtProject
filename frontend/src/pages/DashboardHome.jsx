import { StatCard } from "../components/common/StatCard";
import { useAuth } from "../hooks/useAuth";

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Starter overview</p>
        <h2>Full MERN starter layout for your fast food system.</h2>
        <p>
          React handles the app shell and feature screens, Express exposes the API, and MongoDB
          stores menu items, users, orders, inventory, promotions, and feedback.
        </p>
      </div>
      <div className="stats-grid">
        <StatCard label="Current role" value={user?.role || "Guest"} />
        <StatCard label="Client architecture" value="Feature-based" accent="gold" />
        <StatCard label="Backend architecture" value="REST + services" accent="earth" />
      </div>
    </section>
  );
}

