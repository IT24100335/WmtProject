import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { menuApi } from "../api/menuApi";
import { InventoryOverview } from "../features/inventory/InventoryOverview";
import { MenuOverview } from "../features/menu/MenuOverview";
import { PromotionsOverview } from "../features/promotions/PromotionsOverview";
import { UsersOverview } from "../features/users/UsersOverview";
import { useAuth } from "../hooks/useAuth";

export function AdminDashboard() {
  const { token } = useAuth();
  const [state, setState] = useState({
    users: [],
    promotions: [],
    inventory: [],
    menu: [],
    error: ""
  });

  useEffect(() => {
    Promise.all([
      adminApi.users(token),
      adminApi.promotions(token),
      adminApi.inventory(token),
      menuApi.list(token)
    ])
      .then(([users, promotions, inventory, menu]) => {
        setState({ users, promotions, inventory, menu, error: "" });
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, error: error.message }));
      });
  }, [token]);

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h2>Management modules</h2>
        </div>
      </div>
      {state.error ? <p className="error-text">{state.error}</p> : null}
      <UsersOverview users={state.users} />
      <PromotionsOverview promotions={state.promotions} />
      <InventoryOverview items={state.inventory} />
      <MenuOverview items={state.menu} />
    </section>
  );
}

