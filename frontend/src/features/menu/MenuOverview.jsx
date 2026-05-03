import { Panel } from "../../components/common/Panel";

export function MenuOverview({ items = [] }) {
  return (
    <Panel eyebrow="Menu" title="Catalog">
      <div className="card-grid">
        {items.map((item) => (
          <article key={item._id} className="mini-card">
            <div className="panel-top">
              <strong>{item.name}</strong>
              <span className={item.available ? "pill success" : "pill muted"}>
                {item.available ? "Available" : "Hidden"}
              </span>
            </div>
            <p>{item.category}</p>
            <div className="meta-row">
              <span>${item.price?.toFixed?.(2) ?? item.price}</span>
              <span>Stock: {item.stock}</span>
              <span>Rating: {item.rating || 0}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

