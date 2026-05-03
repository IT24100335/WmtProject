export function AdminPromoForm({ form, onChange, errors = {} }) {
  return (
    <>
      <label>
        Name
        <input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
        {errors.name ? <span className="field-error">{errors.name}</span> : null}
      </label>
      <div className="split-row">
        <label>
          Promo code
          <input value={form.promoCode} onChange={(event) => onChange({ ...form, promoCode: event.target.value })} />
          {errors.promoCode ? <span className="field-error">{errors.promoCode}</span> : null}
        </label>
        <label>
          Discount %
          <input type="number" value={form.discountPercentage} onChange={(event) => onChange({ ...form, discountPercentage: event.target.value })} />
          {errors.discountPercentage ? <span className="field-error">{errors.discountPercentage}</span> : null}
        </label>
      </div>
      <label>
        Expiry date
        <input type="date" value={form.expiryDate} onChange={(event) => onChange({ ...form, expiryDate: event.target.value })} />
        {errors.expiryDate ? <span className="field-error">{errors.expiryDate}</span> : null}
      </label>
      <label className="check-row">
        <input checked={form.active} onChange={(event) => onChange({ ...form, active: event.target.checked })} type="checkbox" />
        Active
      </label>
    </>
  );
}
