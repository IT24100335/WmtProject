export function Panel({ title, eyebrow, children }) {
  return (
    <section className="panel">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

