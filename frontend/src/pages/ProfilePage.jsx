import { useEffect, useMemo, useState } from "react";
import { systemApi } from "../api/systemApi";
import { Modal } from "../components/common/Modal";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate } from "../utils/formatters";

function initialsFromName(value) {
  return (value || "C").trim().charAt(0).toUpperCase();
}

function validateProfile(form) {
  const errors = {};
  if (!form.username.trim() || form.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (form.password && form.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export function ProfilePage() {
  const { updateAuthUser, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [saveState, setSaveState] = useState({ saving: false, error: "", success: "" });
  const [editForm, setEditForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const result = await systemApi.profile(user._id);
        setProfile(result);
        setEditForm({
          username: result.user.username || "",
          email: result.user.email || "",
          password: ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!saveState.success) {
      return undefined;
    }

    const timer = setTimeout(() => setSaveState((prev) => ({ ...prev, success: "" })), 3000);
    return () => clearTimeout(timer);
  }, [saveState.success]);

  const stats = useMemo(
    () => ({
      orders: profile?.orders?.length || 0,
      itemsPurchased: profile?.totalItemsPurchased || 0,
      ratings: profile?.feedbacks?.length || 0
    }),
    [profile]
  );

  const saveProfile = async () => {
    const nextErrors = validateProfile(editForm);
    if (Object.keys(nextErrors).length > 0) {
      setSaveState({ saving: false, error: Object.values(nextErrors)[0], success: "" });
      return;
    }

    setSaveState({ saving: true, error: "", success: "" });
    try {
      const updated = await systemApi.updateUser(user._id, {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        ...(editForm.password ? { password: editForm.password } : {})
      });
      updateAuthUser(updated);
      setProfile((prev) => (prev ? { ...prev, user: updated } : prev));
      setSaveState({ saving: false, error: "", success: "Profile updated successfully." });
      setEditOpen(false);
    } catch (err) {
      setSaveState({ saving: false, error: err.message, success: "" });
    }
  };

  return (
    <AppShell>
      <section className="activity-shell">
        <div className="activity-hero">
          <p className="eyebrow">Customer dashboard</p>
          <h1 className="activity-title">
            My <span>Activity</span>
          </h1>
          <p className="muted-text">
            Review your orders, ratings, and account details in one clean space.
          </p>
        </div>

        {loading ? <div className="page-state">Loading your profile...</div> : null}
        {error ? <p className="error-banner">{error}</p> : null}
        {saveState.success ? <p className="success-banner">{saveState.success}</p> : null}

        <div className="activity-grid">
          <aside className="profile-summary-card">
            <div className="profile-avatar">{initialsFromName(user.username)}</div>
            <h2>{user.username}</h2>
            <p className="muted-text">{profile?.user?.email || user.email || "No email available"}</p>
            <button className="primary-btn wide-btn" type="button" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
            <div className="profile-stats-list">
              <div className="profile-stat-row">
                <span>Items Purchased</span>
                <strong>{stats.itemsPurchased}</strong>
              </div>
              <div className="profile-stat-row">
                <span>Total Orders</span>
                <strong>{stats.orders}</strong>
              </div>
              <div className="profile-stat-row">
                <span>Your Ratings</span>
                <strong>{stats.ratings}</strong>
              </div>
              <div className="profile-stat-row">
                <span>Last Login</span>
                <strong>{formatDate(profile?.user?.lastLogin || user.lastLogin)}</strong>
              </div>
            </div>
          </aside>

          <div className="activity-panels">
            <section className="panel-card">
              <h2>Order History</h2>
              <div className="stack-md">
                {(profile?.orders || []).map((order) => (
                  <article className="activity-card" key={order._id}>
                    <div className="activity-card-top">
                      <div>
                        <strong>Order #{order.orderNumber}</strong>
                        <p>{formatCurrency(order.totalAmount)}</p>
                        <p>{order.deliveryAddress || "No address added"}</p>
                        <p>{formatDate(order.orderTime || order.createdAt)}</p>
                      </div>
                      <span className={order.status === "Delivered" ? "status-pill success" : "status-pill"}>
                        {order.status}
                      </span>
                    </div>
                    <p className="muted-text">
                      {order.items.map((item) => `${item.quantity}x ${item.menuItemName}`).join(", ")}
                    </p>
                  </article>
                ))}
                {profile && profile.orders.length === 0 ? <p className="muted-text">No orders yet.</p> : null}
              </div>
            </section>

            <section className="panel-card">
              <h2>Your Ratings</h2>
              <div className="stack-md">
                {(profile?.feedbacks || []).map((item) => (
                  <article className="activity-card feedback-card" key={item._id}>
                    <div className="rating-stars" aria-label={`${item.rating} star rating`}>
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </div>
                    <p>{item.comment || "No comment provided."}</p>
                    <span className="muted-text">{formatDate(item.createdAt)}</span>
                  </article>
                ))}
                {profile && profile.feedbacks.length === 0 ? <p className="muted-text">No ratings yet.</p> : null}
              </div>
            </section>
          </div>
        </div>
      </section>

      {editOpen ? (
        <Modal
          title="Edit profile"
          onClose={() => {
            setEditOpen(false);
            setSaveState({ saving: false, error: "", success: "" });
          }}
        >
          <div className="stack-md">
            <label>
              Username
              <input
                value={editForm.username}
                onChange={(event) => setEditForm((prev) => ({ ...prev, username: event.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={editForm.password}
                onChange={(event) => setEditForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Leave blank to keep current password"
              />
            </label>
            {saveState.error ? <p className="error-banner">{saveState.error}</p> : null}
            <button className="primary-btn wide-btn" disabled={saveState.saving} onClick={saveProfile} type="button">
              {saveState.saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </Modal>
      ) : null}
    </AppShell>
  );
}
