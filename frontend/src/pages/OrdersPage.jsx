import { useEffect, useState } from "react";
import { api } from "../api/http";

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders")
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Orders</p>
          <h2>Track order flow across the kitchen</h2>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="table-card">
        <div className="table-row table-head">
          <span>Order</span>
          <span>Status</span>
          <span>Total</span>
          <span>Items</span>
        </div>
        {orders.map((order) => (
          <div key={order._id} className="table-row">
            <span>{order.orderNumber}</span>
            <span>{order.status}</span>
            <span>${order.totalAmount?.toFixed?.(2) ?? order.totalAmount}</span>
            <span>{order.items?.length ?? 0}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

