import { Modal } from "../../../components/common/Modal";
import { ORDER_STEPS } from "../../../constants/orderSteps";
import { FeedbackForm } from "../../feedback/components/FeedbackForm";
import { useState } from "react";
import { getStepIndex } from "../../../utils/storefront";

function OrderTrackerCard({
  order,
  onCancelOrder,
  onUpdateAddress,
  onSubmitReview,
  feedbackError,
  feedbackNotice
}) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressValue, setEditAddressValue] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const activeStep = getStepIndex(order.status || "Pending");

  const handleEditAddressClick = () => {
    setEditAddressValue(order.deliveryAddress || "");
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    if (onUpdateAddress) {
      onUpdateAddress(order._id, editAddressValue);
    }
    setIsEditingAddress(false);
  };

  return (
    <div className="stack-md" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px", marginBottom: "24px" }}>
      <div className="tracker-grid">
        {ORDER_STEPS.map((step, index) => (
          <div className={index <= activeStep && order.status !== "Cancelled" ? "tracker-step active" : "tracker-step"} key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <div className="summary-card">
        <div><span>Order</span><strong>{order.orderNumber}</strong></div>
        <div>
          <span>Status</span>
          <strong style={{ color: order.status === "Cancelled" ? "#ff4c4c" : "inherit" }}>
            {order.status}
          </strong>
        </div>
        <div>
          <span>Deliver to</span>
          {isEditingAddress ? (
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <input 
                type="text" 
                value={editAddressValue} 
                onChange={(e) => setEditAddressValue(e.target.value)} 
                style={{ flex: 1, padding: "4px" }} 
              />
              <button type="button" onClick={handleSaveAddress} className="primary-btn" style={{ padding: "4px 8px" }}>Save</button>
              <button type="button" onClick={() => setIsEditingAddress(false)} className="ghost-btn" style={{ padding: "4px 8px" }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <strong>{order.deliveryAddress || "No address"}</strong>
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <button type="button" onClick={handleEditAddressClick} className="ghost-btn" style={{ padding: "2px 8px", fontSize: "0.8rem" }}>
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {order.status === "Pending" && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={() => onCancelOrder(order._id)} className="ghost-btn" style={{ color: "#ff4c4c", borderColor: "#ff4c4c" }}>
            Cancel Order
          </button>
        </div>
      )}

      <div className="map-card" style={{ opacity: order.status === "Cancelled" ? 0.5 : 1 }}>
        <div className="map-dot origin" />
        <div className="map-line" />
        <div className="map-dot rider" style={{ left: `${12 + activeStep * 28}%` }} />
        <div className="map-dot destination" />
      </div>
      
      {order.status === "Delivered" ? (
        <FeedbackForm
          error={feedbackError}
          notice={feedbackNotice}
          review={review}
          setReview={setReview}
          onSubmit={() => onSubmitReview(order._id, review)}
        />
      ) : null}
    </div>
  );
}

export function OrderTrackingModal({
  activeOrdersList,
  feedbackError,
  feedbackNotice,
  onClose,
  onSubmitReview,
  onCancelOrder,
  onUpdateAddress
}) {
  return (
    <Modal title="Active Orders Tracking" onClose={onClose}>
      <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}>
        {activeOrdersList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#d7b9aa", padding: "24px" }}>No active orders.</p>
        ) : (
          activeOrdersList.map(order => (
            <OrderTrackerCard
              key={order._id}
              order={order}
              onCancelOrder={onCancelOrder}
              onUpdateAddress={onUpdateAddress}
              onSubmitReview={onSubmitReview}
              feedbackError={feedbackError}
              feedbackNotice={feedbackNotice}
            />
          ))
        )}
      </div>
    </Modal>
  );
}
