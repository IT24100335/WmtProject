import { Modal } from "../../../components/common/Modal";
import { formatCurrency } from "../../../utils/formatters";

export function CheckoutModal({ busy, errors = {}, onCheckout, onClose, payment, setPayment, total }) {
  return (
    <Modal title="Secure payment" onClose={onClose}>
      <div className="stack-md">
        <p className="muted-text">Payment is simulated and validated locally. No real gateway is connected yet.</p>
        <label>
          Card holder
          <input
            value={payment.name}
            onChange={(event) => setPayment((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Name on card"
          />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </label>
        <label>
          Card number
          <input
            value={payment.number}
            inputMode="numeric"
            maxLength={16}
            onChange={(event) =>
              setPayment((prev) => ({
                ...prev,
                number: event.target.value.replace(/\D/g, "").slice(0, 16)
              }))
            }
            placeholder="1234567812345678"
          />
          {errors.number ? <span className="field-error">{errors.number}</span> : null}
        </label>
        <div className="split-row">
          <label>
            Expiry
            <input
              value={payment.expiry}
              inputMode="numeric"
              maxLength={5}
              onChange={(event) =>
                setPayment((prev) => ({
                  ...prev,
                  expiry: event.target.value.replace(/[^\d/]/g, "").slice(0, 5)
                }))
              }
              placeholder="MM/YY"
            />
            {errors.expiry ? <span className="field-error">{errors.expiry}</span> : null}
          </label>
          <label>
            CVV
            <input
              value={payment.cvv}
              inputMode="numeric"
              maxLength={4}
              onChange={(event) =>
                setPayment((prev) => ({
                  ...prev,
                  cvv: event.target.value.replace(/\D/g, "").slice(0, 4)
                }))
              }
              placeholder="123"
            />
            {errors.cvv ? <span className="field-error">{errors.cvv}</span> : null}
          </label>
        </div>
        {errors.form ? <p className="error-banner">{errors.form}</p> : null}
        <button
          className="primary-btn wide-btn"
          disabled={busy}
          onClick={onCheckout}
          type="button"
        >
          {busy ? "Processing..." : `Pay ${formatCurrency(total)}`}
        </button>
      </div>
    </Modal>
  );
}
