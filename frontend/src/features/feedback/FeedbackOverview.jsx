import { Panel } from "../../components/common/Panel";

export function FeedbackOverview({ feedback = [] }) {
  return (
    <Panel eyebrow="Feedback" title="Recent reviews">
      <div className="stack compact">
        {feedback.map((item) => (
          <article key={item._id} className="mini-card">
            <div className="panel-top">
              <strong>Rating: {item.rating}/5</strong>
              <span className="pill muted">{item.menuItemId}</span>
            </div>
            <p>{item.comment || "No comment provided."}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

