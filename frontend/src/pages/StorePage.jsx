import { useEffect, useMemo, useState } from "react";
import { systemApi } from "../api/systemApi";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../hooks/useAuth";
import { MenuGrid } from "../features/menu/components/MenuGrid";
import { CartDrawer } from "../features/orders/components/CartDrawer";
import { CheckoutModal } from "../features/orders/components/CheckoutModal";
import { OrderTrackingModal } from "../features/orders/components/OrderTrackingModal";
import {
  getStepIndex,
  readActiveOrderId,
  readCart,
  saveActiveOrderId,
  saveCart
} from "../utils/storefront";

export function StorePage() {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [cart, setCart] = useState(() => readCart());
  const [promoCode, setPromoCode] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeOrdersList, setActiveOrdersList] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState("");
  const [cartErrors, setCartErrors] = useState({ address: "", form: "", promo: "" });
  const [checkoutErrors, setCheckoutErrors] = useState({ name: "", number: "", expiry: "", cvv: "", form: "" });
  const [ui, setUi] = useState({
    loading: true,
    cartOpen: false,
    checkoutOpen: false,
    trackingOpen: false,
    busy: false,
    error: "",
    notice: ""
  });

  const refreshStore = async () => {
    setUi((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const menuData = await systemApi.menu();
      setMenu(menuData);
      
      if (user) {
        try {
          const orders = await systemApi.orders();
          const active = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");
          setActiveOrdersList(active);
          
          if (activeOrder) {
            const updatedActive = orders.find(o => o._id === activeOrder._id);
            if (updatedActive) setActiveOrder(updatedActive);
          }
        } catch {
          // ignore
        }
      } else {
        setActiveOrdersList([]);
        setActiveOrder(null);
      }
    } catch (err) {
      setUi((prev) => ({ ...prev, error: err.message }));
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    refreshStore();
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    if (!ui.notice) {
      return undefined;
    }

    const timer = setTimeout(() => setUi((prev) => ({ ...prev, notice: "" })), 3000);
    return () => clearTimeout(timer);
  }, [ui.notice]);

  useEffect(() => {
    if (activeOrdersList.length === 0) {
      return undefined;
    }

    const timer = setInterval(async () => {
      try {
        const orders = await systemApi.orders();
        const active = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");
        setActiveOrdersList(active);
        
        if (activeOrder) {
          const updatedActive = orders.find(o => o._id === activeOrder._id);
          if (updatedActive) setActiveOrder(updatedActive);
        }
      } catch {
        clearInterval(timer);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [activeOrdersList.length, activeOrder?._id]);

  const visibleMenu = useMemo(() => menu.filter((item) => item.available), [menu]);
  const categories = useMemo(
    () => ["all", ...new Set(visibleMenu.map((item) => item.category || "other"))],
    [visibleMenu]
  );
  const filteredMenu = useMemo(() => {
    if (activeFilter === "all") {
      return visibleMenu;
    }
    return visibleMenu.filter((item) => item.category === activeFilter);
  }, [visibleMenu, activeFilter]);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promo ? (subtotal * promo.discountPercentage) / 100 : 0;
  const total = subtotal - discount;
  const activeStep = getStepIndex(activeOrder?.status || "Pending");

  const updateQuantity = (menuItem, delta) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === menuItem._id);
      const nextQuantity = (existing?.quantity || 0) + delta;
      if (nextQuantity <= 0) {
        return prev.filter((item) => item._id !== menuItem._id);
      }
      if (nextQuantity > menuItem.stock) {
        return prev;
      }
      if (!existing) {
        return [...prev, { ...menuItem, quantity: 1 }];
      }
      return prev.map((item) =>
        item._id === menuItem._id ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const applyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage("Enter a promo code first.");
      setCartErrors((prev) => ({ ...prev, promo: "Enter a promo code first." }));
      return;
    }

    try {
      const result = await systemApi.validatePromotion(promoCode.trim().toUpperCase());
      setPromo(result);
      setPromoMessage(`Promo ${result.promoCode} applied`);
      setCartErrors((prev) => ({ ...prev, promo: "" }));
    } catch (err) {
      setPromo(null);
      setPromoMessage(err.message);
      setCartErrors((prev) => ({ ...prev, promo: err.message }));
    }
  };

  const checkout = async () => {
    if (!user) {
      return;
    }

    const nextErrors = {};
    if (!address.trim() || address.trim().length < 6) {
      nextErrors.address = "Delivery address must be at least 6 characters.";
    }
    const cardNumber = payment.number.replace(/\s+/g, "");
    if (!payment.name.trim() || payment.name.trim().length < 3) {
      nextErrors.name = "Card holder name is required.";
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      nextErrors.number = "Card number must be exactly 16 digits.";
    }
    const expiryMatch = payment.expiry.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      nextErrors.expiry = "Use valid MM/YY format.";
    } else {
      const month = parseInt(expiryMatch[1], 10);
      const year = parseInt(expiryMatch[2], 10) + 2000;
      const now = new Date();
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        nextErrors.expiry = "Card has expired.";
      }
    }
    if (!/^\d{3,4}$/.test(payment.cvv.trim())) {
      nextErrors.cvv = "CVV must be 3 or 4 digits.";
    }
    if (cart.length === 0) {
      nextErrors.form = "Add at least one item before checkout.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setCartErrors({
        address: nextErrors.address || "",
        form: nextErrors.form || "",
        promo: ""
      });
      setCheckoutErrors(nextErrors);
      setUi((prev) => ({
        ...prev,
        error: "Please fix the payment form errors before continuing."
      }));
      return;
    }

    setCartErrors({ address: "", form: "", promo: "" });
    setCheckoutErrors({ name: "", number: "", expiry: "", cvv: "", form: "" });
    setUi((prev) => ({ ...prev, busy: true, error: "" }));
    try {
      const createdOrder = await systemApi.createOrder({
        promoCode: promo?.promoCode,
        deliveryAddress: address,
        items: cart.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity
        }))
      });
      setActiveOrder(createdOrder);
      saveActiveOrderId(createdOrder._id);
      setCart([]);
      setPromo(null);
      setPromoCode("");
      setPromoMessage("");
      setFeedbackError("");
      setFeedbackNotice("Payment approved and order placed successfully.");
      setUi({
        loading: false,
        cartOpen: false,
        checkoutOpen: false,
        trackingOpen: true,
        busy: false,
        error: "",
        notice: "Payment approved and order placed successfully."
      });
      await refreshStore();
    } catch (err) {
      setUi((prev) => ({ ...prev, busy: false, error: `Payment failed: ${err.message}` }));
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await systemApi.cancelOrder(orderId);
        setUi(prev => ({ ...prev, notice: "Order cancelled successfully." }));
        refreshStore();
      } catch (err) {
        setUi(prev => ({ ...prev, error: `Failed to cancel: ${err.message}` }));
      }
    }
  };

  const handleUpdateAddress = async (orderId, newAddress) => {
    if (!orderId) return;
    try {
      await systemApi.updateOrderAddress(orderId, newAddress);
      setUi(prev => ({ ...prev, notice: "Delivery address updated." }));
      refreshStore();
    } catch (err) {
      setUi(prev => ({ ...prev, error: `Failed to update address: ${err.message}` }));
    }
  };

  const submitReview = async (orderId, localReview) => {
    if (!user) return;
    const orderToReview = activeOrdersList.find(o => o._id === orderId);
    if (!orderToReview) return;

    if (!localReview.rating || localReview.rating < 1 || localReview.rating > 5) {
      setFeedbackError("Please select a star rating.");
      return;
    }
    if (!localReview.comment.trim() || localReview.comment.trim().length < 3) {
      setFeedbackError("Please add a short review comment.");
      return;
    }

    try {
      const results = await Promise.allSettled(
        orderToReview.items.map((item) =>
          systemApi.submitFeedback({
            menuItemId: item.menuItemId,
            rating: localReview.rating,
            comment: localReview.comment
          })
        )
      );
      const rejected = results.find((result) => result.status === "rejected");
      if (rejected) {
        throw rejected.reason;
      }
      setFeedbackError("");
      setFeedbackNotice("Review submitted successfully.");
      setUi((prev) => ({ ...prev, notice: "Review submitted successfully." }));
      refreshStore();
    } catch (err) {
      setFeedbackError(`Feedback could not be saved: ${err.message}`);
    }
  };

  return (
    <AppShell>
      <section className="hero-banner">
        <div>
          <p className="eyebrow">Colombo's finest</p>
          <h1>Fast Food, Delivered.</h1>
          <p>
            Experience premium fast food from Colombo with a simple, smooth ordering flow. Browse
            the menu, add items to cart, apply promos, and track your order in minutes.
          </p>
        </div>
        <div className="hero-highlight">
          <span>{user ? "Menu items" : "Customer app"}</span>
          <strong>{menu.length}</strong>
          <small>
            {user
              ? "Customer and admin functions connected to MongoDB and Express APIs."
              : "Sign in as a customer to checkout, track orders, and manage your profile."}
          </small>
        </div>
      </section>

      <section className="toolbar">
        <div className="filter-row">
          {categories.map((category) => (
            <button
              key={category}
              className={activeFilter === category ? "chip-btn active" : "chip-btn"}
              onClick={() => setActiveFilter(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <div className="toolbar-actions">
          {activeOrdersList.length > 0 ? (
            <button
              className="ghost-btn"
              onClick={() => setUi((prev) => ({ ...prev, trackingOpen: true }))}
              type="button"
            >
              Track Orders ({activeOrdersList.length})
            </button>
          ) : null}
          <button
            className="primary-btn"
            onClick={() => setUi((prev) => ({ ...prev, cartOpen: true }))}
            type="button"
          >
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </section>

      {ui.error ? <p className="error-banner">{ui.error}</p> : null}
      {ui.notice ? <p className="success-banner">{ui.notice}</p> : null}
      {ui.loading ? <div className="page-state">Loading menu...</div> : null}

      <MenuGrid cart={cart} items={filteredMenu} onUpdateQuantity={updateQuantity} />

      {ui.cartOpen ? (
        <CartDrawer
          address={address}
          cart={cart}
          discount={discount}
          errors={cartErrors}
          onApplyPromo={applyPromo}
          onClose={() => setUi((prev) => ({ ...prev, cartOpen: false }))}
          onOpenCheckout={() => setUi((prev) => ({ ...prev, checkoutOpen: true }))}
          onUpdateQuantity={updateQuantity}
          promoCode={promoCode}
          promoMessage={promoMessage}
          setAddress={setAddress}
          setPromoCode={setPromoCode}
          subtotal={subtotal}
          total={total}
          user={user}
        />
      ) : null}

      {ui.checkoutOpen ? (
          <CheckoutModal
            busy={ui.busy}
            errors={checkoutErrors}
            onCheckout={checkout}
          onClose={() => setUi((prev) => ({ ...prev, checkoutOpen: false }))}
          payment={payment}
          setPayment={setPayment}
          total={total}
        />
      ) : null}

      {ui.trackingOpen && activeOrdersList.length > 0 ? (
          <OrderTrackingModal
            activeOrdersList={activeOrdersList}
            feedbackError={feedbackError}
            feedbackNotice={feedbackNotice}
            onClose={() => setUi((prev) => ({ ...prev, trackingOpen: false }))}
            onSubmitReview={submitReview}
            onCancelOrder={handleCancelOrder}
            onUpdateAddress={handleUpdateAddress}
        />
      ) : null}
    </AppShell>
  );
}
