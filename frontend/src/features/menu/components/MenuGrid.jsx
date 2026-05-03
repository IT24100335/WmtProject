import { formatCurrency } from "../../../utils/formatters";
import { resolveMediaUrl } from "../../../utils/media";

export function MenuGrid({ cart, items, onUpdateQuantity }) {
  return (
    <section className="menu-grid">
      {items.map((item) => (
        <article className="food-card" key={item._id}>
          <div className="food-thumb">
            <img alt={item.name} src={resolveMediaUrl(item.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Item"} />
            <span className={item.stock === 0 ? "stock-badge empty" : item.stock <= 5 ? "stock-badge low" : "stock-badge"}>
              {item.stock === 0 ? "Sold out" : item.stock <= 5 ? `Low stock ${item.stock}` : `In stock ${item.stock}`}
            </span>
          </div>
          <div className="food-body">
            <div className="food-meta">
              <span>{item.category}</span>
              <span>{item.rating ? `${item.rating.toFixed(1)} / 5` : "New item"}</span>
            </div>
            <h3>{item.name}</h3>
            <p>{item.description || "Freshly prepared and ready for quick delivery."}</p>
            <div className="food-footer">
              <strong>{formatCurrency(item.price)}</strong>
              <div className="stepper">
                <button onClick={() => onUpdateQuantity(item, -1)} type="button">-</button>
                <span>{cart.find((cartItem) => cartItem._id === item._id)?.quantity || 0}</span>
                <button disabled={item.stock === 0} onClick={() => onUpdateQuantity(item, 1)} type="button">+</button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
