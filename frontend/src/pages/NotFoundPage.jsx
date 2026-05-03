import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="screen-center">
      <div className="panel">
        <p className="eyebrow">404</p>
        <h2>Page not found</h2>
        <Link className="primary-button inline-button" to="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

