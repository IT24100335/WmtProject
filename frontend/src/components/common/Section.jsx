export function Section({ action, children, title }) {
  return (
    <section className="panel-card">
      <div className="panel-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
