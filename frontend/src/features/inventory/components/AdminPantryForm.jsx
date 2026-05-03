export function AdminPantryForm({ form, onChange, errors = {} }) {
  return (
    <>
      <label>
        Name
        <input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
        {errors.name ? <span className="field-error">{errors.name}</span> : null}
      </label>
      <div className="split-row">
        <label>
          Quantity
          <input type="number" value={form.quantity} onChange={(event) => onChange({ ...form, quantity: event.target.value })} />
          {errors.quantity ? <span className="field-error">{errors.quantity}</span> : null}
        </label>
        <label>
          Unit
          <input value={form.unit} onChange={(event) => onChange({ ...form, unit: event.target.value })} />
          {errors.unit ? <span className="field-error">{errors.unit}</span> : null}
        </label>
      </div>
      <label>
        Threshold
        <input type="number" value={form.threshold} onChange={(event) => onChange({ ...form, threshold: event.target.value })} />
        {errors.threshold ? <span className="field-error">{errors.threshold}</span> : null}
      </label>
    </>
  );
}
