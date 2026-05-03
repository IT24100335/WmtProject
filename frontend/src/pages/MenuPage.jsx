import { useEffect, useState } from "react";
import { api } from "../api/http";

export function MenuPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/menu")
      .then(setItems)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Menu</p>
          <h2>Live menu items from MongoDB</h2>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="card-grid">
        {items.map((item) => (
          <article key={item._id} className="panel">
            <div className="panel-top">
              <h3>{item.name}</h3>
              <span className={item.available ? "pill success" : "pill muted"}>
                {item.available ? "Available" : "Hidden"}
              </span>
            </div>
            <p>{item.description || "No description provided yet."}</p>
            <div className="meta-row">
              <span>${item.price?.toFixed?.(2) ?? item.price}</span>
              <span>Stock: {item.stock}</span>
              <span>Rating: {item.rating || 0}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

