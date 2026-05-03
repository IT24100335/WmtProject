export function PromoCodeField({ message, onApply, promoCode, setPromoCode, error = "" }) {
  return (
    <>
      <label>
        Promo code
        <div className="inline-row">
          <input
            aria-label="Promo code"
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            placeholder="SAVE10"
          />
          <button className="ghost-btn" onClick={onApply} type="button">
            Apply
          </button>
        </div>
      </label>
      {error ? <span className="field-error">{error}</span> : null}
      {message ? <p className="muted-text">{message}</p> : null}
    </>
  );
}
