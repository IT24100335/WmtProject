import { Panel } from "../../components/common/Panel";

export function OrdersOverview({ orders = [] }) {
  return (
    <Panel eyebrow="Orders" title="Recent orders">
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
    </Panel>
  );
}

