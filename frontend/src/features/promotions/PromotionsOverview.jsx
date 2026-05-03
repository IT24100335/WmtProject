import { Panel } from "../../components/common/Panel";

export function PromotionsOverview({ promotions = [] }) {
  return (
    <Panel eyebrow="Promotions" title="Offers">
      <div className="stack compact">
        {promotions.map((promotion) => (
          <article key={promotion._id} className="mini-card">
            <div className="panel-top">
              <strong>{promotion.name}</strong>
              <span className={promotion.active ? "pill success" : "pill muted"}>
                {promotion.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="meta-row">
              <span>{promotion.promoCode}</span>
              <span>{promotion.discountPercentage}% off</span>
              <span>{promotion.expiryDate}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

