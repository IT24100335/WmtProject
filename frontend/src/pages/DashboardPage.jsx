export function DashboardPage() {
  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Migration complete</p>
        <h2>Spring Boot fast food system, reshaped for MongoDB, Express, React, and Node.</h2>
        <p>
          This frontend now expects a modular REST API and a MongoDB backend instead of Java
          controllers and SQL Server tables.
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <strong>6</strong>
          <span>Business modules migrated</span>
        </article>
        <article className="stat-card">
          <strong>MERN</strong>
          <span>React client plus Express API</span>
        </article>
        <article className="stat-card">
          <strong>MongoDB</strong>
          <span>Document models replacing JPA entities</span>
        </article>
      </div>
    </section>
  );
}

