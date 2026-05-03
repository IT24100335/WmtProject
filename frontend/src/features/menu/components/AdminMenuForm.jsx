import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../../utils/media";

export function AdminMenuForm({ form, onChange, errors = {} }) {
  const [previewSrc, setPreviewSrc] = useState(
    resolveMediaUrl(form.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Preview"
  );

  useEffect(() => {
    if (form.imageFile) {
      const nextUrl = URL.createObjectURL(form.imageFile);
      setPreviewSrc(nextUrl);
      return () => URL.revokeObjectURL(nextUrl);
    }

    setPreviewSrc(resolveMediaUrl(form.imageUrl) || "https://via.placeholder.com/640x420?text=Menu+Preview");
    return undefined;
  }, [form.imageFile, form.imageUrl]);

  return (
    <div className="menu-form-shell">
      <div className="menu-preview-card">
        <img alt={form.name || "Menu preview"} src={previewSrc} />
        <div className="menu-preview-copy">
          <strong>{form.name || "Menu item preview"}</strong>
          <span>{form.category || "Category"}</span>
        </div>
      </div>
      <label>
        Item name
        <input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
        {errors.name ? <span className="field-error">{errors.name}</span> : null}
      </label>
      <div className="split-row">
        <label>
          Price
          <input type="number" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} />
          {errors.price ? <span className="field-error">{errors.price}</span> : null}
        </label>
        <label>
          Stock
          <input type="number" value={form.stock} onChange={(event) => onChange({ ...form, stock: event.target.value })} />
          {errors.stock ? <span className="field-error">{errors.stock}</span> : null}
        </label>
      </div>
      <label>
        Category
        <input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} />
        {errors.category ? <span className="field-error">{errors.category}</span> : null}
      </label>
      <label>
        Description
        <textarea rows="4" value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} />
        {errors.description ? <span className="field-error">{errors.description}</span> : null}
      </label>
      <label>
        Image URL
        <input value={form.imageUrl} onChange={(event) => onChange({ ...form, imageUrl: event.target.value })} />
        {errors.imageUrl ? <span className="field-error">{errors.imageUrl}</span> : null}
      </label>
      <label>
        Image file
        <input
          accept="image/*"
          type="file"
          onChange={(event) => onChange({ ...form, imageFile: event.target.files?.[0] || null })}
        />
        {errors.imageFile ? <span className="field-error">{errors.imageFile}</span> : null}
        {form.imageFile ? <span className="field-error">Selected: {form.imageFile.name}</span> : null}
        {!form.imageFile && form.imageUrl ? <span className="field-error">Using image URL only.</span> : null}
        <span className="muted-text">Pick a JPG, PNG, or WEBP file to upload a menu photo.</span>
      </label>
      <label className="check-row">
        <input checked={form.available} onChange={(event) => onChange({ ...form, available: event.target.checked })} type="checkbox" />
        Available
      </label>
    </div>
  );
}
