import { Panel } from "../../components/common/Panel";

export function InventoryOverview({ items = [] }) {
  return (
    <Panel eyebrow="Inventory" title="Pantry">
      <div className="stack compact">
        {items.map((item) => (
          <article key={item._id} className="mini-card">
            <div className="panel-top">
              <strong>{item.name}</strong>
              <span className={item.quantity <= item.threshold ? "pill warning" : "pill success"}>
                {item.quantity <= item.threshold ? "Low stock" : "Healthy"}
              </span>
            </div>
            <div className="meta-row">
              <span>{item.quantity} {item.unit}</span>
              <span>Threshold: {item.threshold}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

