import { formatCurrency } from "../../../utils/formatters";
import { PromoCodeField } from "../../promotions/components/PromoCodeField";

export function CartDrawer({
  address,
  cart,
  discount,
  errors = {},
  onApplyPromo,
  onClose,
  onOpenCheckout,
  onUpdateQuantity,
  promoCode,
  promoMessage,
  setAddress,
  setPromoCode,
  subtotal,
  total,
  user
}) {
  return (
    <div className="overlay-shell" onClick={onClose} role="presentation">
      <aside className="side-panel" onClick={(event) => event.stopPropagation()}>
        <div className="panel-head">
          <h2>Your cart</h2>
          <button className="icon-btn" onClick={onClose} type="button">
            x
          </button>
        </div>
        <div className="stack-md">
          {cart.length === 0 ? <p className="muted-text">Your cart is empty.</p> : null}
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
              <div className="stepper">
                <button onClick={() => onUpdateQuantity(item, -1)} type="button">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item, 1)} type="button">+</button>
              </div>
            </div>
          ))}
          <PromoCodeField
            message={promoMessage}
            onApply={onApplyPromo}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            error={errors.promo || ""}
          />
          <label>
            Delivery address
            <textarea
              rows="4"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter your full delivery address"
            />
            {errors.address ? <span className="field-error">{errors.address}</span> : null}
          </label>
          <div className="summary-card">
            <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div><span>Discount</span><strong>{formatCurrency(discount)}</strong></div>
            <div><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          </div>
          <button
            className="primary-btn wide-btn"
            disabled={!user || cart.length === 0 || !address.trim()}
            onClick={onOpenCheckout}
            type="button"
          >
            Proceed to payment
          </button>
          {errors.form ? <p className="error-banner">{errors.form}</p> : null}
          {!user ? <p className="muted-text">Please log in before placing an order.</p> : null}
        </div>
      </aside>
    </div>
  );
}
