import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { menuApi } from "../api/menuApi";
import { orderApi } from "../api/orderApi";
import { FeedbackOverview } from "../features/feedback/FeedbackOverview";
import { MenuOverview } from "../features/menu/MenuOverview";
import { OrdersOverview } from "../features/orders/OrdersOverview";
import { useAuth } from "../hooks/useAuth";

export function CustomerDashboard() {
  const { token } = useAuth();
  const [state, setState] = useState({
    menu: [],
    orders: [],
    feedback: [],
    error: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const menu = await menuApi.recommended(token);
        const orders = await orderApi.list(token);
        const feedback = menu[0]?._id ? await adminApi.feedbackByMenu(token, menu[0]._id) : [];
        setState({ menu, orders, feedback, error: "" });
      } catch (error) {
        setState((prev) => ({ ...prev, error: error.message }));
      }
    };

    load();
  }, [token]);

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Customer dashboard</p>
          <h2>Ordering and review modules</h2>
        </div>
      </div>
      {state.error ? <p className="error-text">{state.error}</p> : null}
      <MenuOverview items={state.menu} />
      <OrdersOverview orders={state.orders} />
      <FeedbackOverview feedback={state.feedback} />
    </section>
  );
}

