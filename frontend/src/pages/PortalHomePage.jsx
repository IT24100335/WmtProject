import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import heroFood from "../assets/hero-fastfood.svg";

export function PortalHomePage() {
  return (
    <AppShell>
      <section className="hero-banner home-hero">
        <div>
          <p className="eyebrow">Crave Bites</p>
          <h1>Fast food ordering with a bold Colombo theme and separate admin workspace.</h1>
          <p>
            Choose the customer app to browse food and place orders, or the admin portal to manage
            menu, orders, promotions, inventory, users, and feedback. The layout is kept simple,
            clean, and mobile-friendly.
          </p>
          <div className="inline-row">
            <Link className="primary-btn" to="/customer">
              Open Customer App
            </Link>
            <Link className="ghost-btn" to="/admin/login">
              Open Admin Login
            </Link>
          </div>
        </div>
        <div className="stack-md">
          <div className="panel-card">
            <p className="eyebrow">Customer</p>
            <h2>Fast ordering flow</h2>
            <p className="muted-text">Menu, cart, promo code, checkout, live order tracking, profile.</p>
            <Link className="primary-btn wide-btn" to="/customer/login">
              Customer Login
            </Link>
          </div>
          <div className="panel-card">
            <p className="eyebrow">Admin</p>
            <h2>Back office control</h2>
            <p className="muted-text">Dashboard, stock, menu visibility, promotions, feedback, user management.</p>
            <Link className="ghost-btn wide-btn" to="/admin/login">
              Admin Login
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <img alt="Fast food illustration" src={heroFood} />
        </div>
      </section>
    </AppShell>
  );
}
