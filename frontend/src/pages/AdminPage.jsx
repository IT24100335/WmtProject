import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { systemApi } from "../api/systemApi";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { Section } from "../components/common/Section";
import { StatCard } from "../components/common/StatCard";
import { AppShell } from "../components/layout/AppShell";
import { ORDER_STEPS } from "../constants/orderSteps";
import { AdminPantryForm } from "../features/inventory/components/AdminPantryForm";
import { AdminMenuForm } from "../features/menu/components/AdminMenuForm";
import { AdminPromoForm } from "../features/promotions/components/AdminPromoForm";
import { AdminUserForm } from "../features/users/components/AdminUserForm";
import { useAuth } from "../hooks/useAuth";
import {
  ADMIN_TAB_LABELS,
  getAllowedAdminTabs,
  getDefaultAdminTab
} from "../utils/adminAccess";
import {
  emptyMenuForm,
  emptyPantryForm,
  emptyPromoForm,
  emptyUserForm
} from "../utils/adminForms";
import { formatCurrency, formatDate, formatRole } from "../utils/formatters";
import { resolveMediaUrl } from "../utils/media";
import { USER_ROLES } from "../constants/roles";

const VALID_ROLES = new Set(USER_ROLES);

function validateUserForm(form) {
  const errors = {};
  if (!form.username?.trim() || form.username.trim().length < 3) errors.username = "Username must be at least 3 characters.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form._id && (!form.password?.trim() || form.password.trim().length < 6)) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (form._id && form.password && form.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!VALID_ROLES.has(form.role)) errors.role = "Choose a valid role.";
  return errors;
}

function validateMenuForm(form) {
  const errors = {};
  if (!form.name?.trim() || form.name.trim().length < 2) errors.name = "Item name is required.";
  if (Number(form.price) < 0 || form.price === "") errors.price = "Price must be zero or more.";
  if (Number(form.stock) < 0 || form.stock === "") errors.stock = "Stock must be zero or more.";
  if (!form.category?.trim()) errors.category = "Category is required.";
  if (form.description && form.description.length > 500) errors.description = "Description is too long.";
  if (form.imageFile && !String(form.imageFile.type || "").startsWith("image/")) {
    errors.imageFile = "Please select a valid image file.";
  }
  return errors;
}

function validatePromoForm(form) {
  const errors = {};
  if (!form.name?.trim() || form.name.trim().length < 2) errors.name = "Promotion name is required.";
  if (!form.promoCode?.trim() || form.promoCode.trim().length < 2) errors.promoCode = "Promo code is required.";
  const discount = Number(form.discountPercentage);
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    errors.discountPercentage = "Discount must be between 0 and 100.";
  }
  if (!form.expiryDate) errors.expiryDate = "Expiry date is required.";
  return errors;
}

function validatePantryForm(form) {
  const errors = {};
  if (!form.name?.trim() || form.name.trim().length < 2) errors.name = "Name is required.";
  const quantity = Number(form.quantity);
  if (!Number.isFinite(quantity) || quantity < 0) errors.quantity = "Quantity must be zero or more.";
  if (!form.unit?.trim()) errors.unit = "Unit is required.";
  const threshold = Number(form.threshold);
  if (!Number.isFinite(threshold) || threshold < 0) errors.threshold = "Threshold must be zero or more.";
  return errors;
}

export function AdminPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({
    users: [],
    menu: [],
    orders: [],
    promotions: [],
    pantry: [],
    feedback: []
  });
  const [forms, setForms] = useState({
    user: emptyUserForm(),
    menu: emptyMenuForm(),
    promo: emptyPromoForm(),
    pantry: emptyPantryForm()
  });
  const [modals, setModals] = useState({ user: false, menu: false, promo: false, pantry: false });
  const [state, setState] = useState({ loading: true, error: "", saving: false });
  const [notice, setNotice] = useState("");
  const [formErrors, setFormErrors] = useState({
    user: {},
    menu: {},
    promo: {},
    pantry: {}
  });
  const allowedTabs = useMemo(() => getAllowedAdminTabs(user?.role), [user?.role]);
  const activeTab = searchParams.get("tab");
  const tab = allowedTabs.includes(activeTab) ? activeTab : getDefaultAdminTab(user?.role);

  const loadAdmin = async () => {
    setState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const needs = new Set();
      allowedTabs.forEach((entry) => {
        if (entry === "overview" || entry === "users") {
          needs.add("users");
          needs.add("orders");
          needs.add("menu");
          return;
        }
        if (entry === "inventory") {
          needs.add("menu");
          needs.add("pantry");
          return;
        }
        needs.add(entry);
      });

      const fetchers = {
        users: () => systemApi.users(),
        menu: () => systemApi.menu(),
        orders: () => systemApi.orders(),
        promotions: () => systemApi.promotions(),
        pantry: () => systemApi.pantry(),
        feedback: () => systemApi.feedback()
      };

      const entries = Array.from(needs).filter((key) => fetchers[key]);
      const results = await Promise.all(
        entries.map((key) => fetchers[key]().then((value) => [key, value]))
      );

      const next = {
        users: [],
        menu: [],
        orders: [],
        promotions: [],
        pantry: [],
        feedback: []
      };
      results.forEach(([key, value]) => {
        next[key] = value;
      });

      setData(next);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (!user?.role) return;
    loadAdmin();
  }, [user?.role]);

  useEffect(() => {
    if (!allowedTabs.length) {
      return;
    }

    if (!allowedTabs.includes(activeTab)) {
      setSearchParams({ tab: getDefaultAdminTab(user?.role) }, { replace: true });
    }
  }, [activeTab, allowedTabs, setSearchParams, user?.role]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysOrders = data.orders.filter((order) => String(order.orderTime || "").slice(0, 10) === todayKey);
  const lowStockCount = data.menu.filter((item) => item.stock <= 5).length;
  const revenue = todaysOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const saveUser = async () => {
    const nextErrors = validateUserForm(forms.user);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, user: nextErrors }));
      setState((prev) => ({ ...prev, error: "Please fix the highlighted user fields." }));
      return;
    }

    setState((prev) => ({ ...prev, saving: true, error: "" }));
    try {
      if (forms.user._id) {
        await systemApi.updateUser(forms.user._id, {
          username: forms.user.username,
          email: forms.user.email,
          password: forms.user.password,
          role: forms.user.role
        });
      } else {
        await systemApi.createUser(forms.user);
      }
      setFormErrors((prev) => ({ ...prev, user: {} }));
      setNotice(forms.user._id ? "User updated successfully." : "User created successfully.");
      setModals((prev) => ({ ...prev, user: false }));
      setForms((prev) => ({ ...prev, user: emptyUserForm() }));
      await loadAdmin();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  const saveMenu = async () => {
    const nextErrors = validateMenuForm(forms.menu);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, menu: nextErrors }));
      setState((prev) => ({ ...prev, error: "Please fix the highlighted menu fields." }));
      return;
    }

    setState((prev) => ({ ...prev, saving: true, error: "" }));
    try {
      await systemApi.saveMenu(forms.menu);
      setFormErrors((prev) => ({ ...prev, menu: {} }));
      setNotice(forms.menu.id ? "Menu item updated successfully." : "Menu item created successfully.");
      setModals((prev) => ({ ...prev, menu: false }));
      setForms((prev) => ({ ...prev, menu: emptyMenuForm() }));
      await loadAdmin();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  const savePromo = async () => {
    const nextErrors = validatePromoForm(forms.promo);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, promo: nextErrors }));
      setState((prev) => ({ ...prev, error: "Please fix the highlighted promotion fields." }));
      return;
    }

    setState((prev) => ({ ...prev, saving: true, error: "" }));
    try {
      const payload = {
        name: forms.promo.name,
        promoCode: forms.promo.promoCode.toUpperCase(),
        discountPercentage: Number(forms.promo.discountPercentage),
        expiryDate: forms.promo.expiryDate,
        active: forms.promo.active
      };
      if (forms.promo._id) {
        await systemApi.updatePromotion(forms.promo._id, payload);
      } else {
        await systemApi.createPromotion(payload);
      }
      setFormErrors((prev) => ({ ...prev, promo: {} }));
      setNotice(forms.promo._id ? "Promotion updated successfully." : "Promotion created successfully.");
      setModals((prev) => ({ ...prev, promo: false }));
      setForms((prev) => ({ ...prev, promo: emptyPromoForm() }));
      await loadAdmin();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  const savePantry = async () => {
    const nextErrors = validatePantryForm(forms.pantry);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, pantry: nextErrors }));
      setState((prev) => ({ ...prev, error: "Please fix the highlighted inventory fields." }));
      return;
    }

    setState((prev) => ({ ...prev, saving: true, error: "" }));
    try {
      await systemApi.savePantry(forms.pantry._id, {
        name: forms.pantry.name,
        quantity: Number(forms.pantry.quantity),
        unit: forms.pantry.unit,
        threshold: Number(forms.pantry.threshold)
      });
      setFormErrors((prev) => ({ ...prev, pantry: {} }));
      setNotice(forms.pantry._id ? "Pantry item updated successfully." : "Pantry item created successfully.");
      setModals((prev) => ({ ...prev, pantry: false }));
      setForms((prev) => ({ ...prev, pantry: emptyPantryForm() }));
      await loadAdmin();
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, saving: false }));
    }
  };

  return (
    <AppShell>
      <section className="admin-layout">
        <aside className="admin-sidebar">
          <p className="eyebrow">Admin workspace</p>
          <h1>Crave Admin</h1>
          {allowedTabs.map((entry) => (
            <button
              key={entry}
              className={tab === entry ? "side-link active" : "side-link"}
              onClick={() => setSearchParams({ tab: entry })}
              type="button"
            >
              {ADMIN_TAB_LABELS[entry] || entry}
            </button>
          ))}
        </aside>
        <main className="admin-content">
          {state.error ? <p className="error-banner">{state.error}</p> : null}
          {notice ? <p className="success-banner">{notice}</p> : null}
          {state.loading ? <div className="page-state">Loading admin data...</div> : null}

          {tab === "overview" ? (
            <div className="stack-lg">
              <div className="stats-row">
                <StatCard label="Today's orders" value={todaysOrders.length} />
                <StatCard label="Pending orders" value={data.orders.filter((order) => order.status !== "Delivered").length} />
                <StatCard label="Revenue" value={formatCurrency(revenue)} />
                <StatCard label="Low stock" value={lowStockCount} />
              </div>
              <Section title="Latest orders">
                {data.orders.slice(0, 5).map((order) => (
                  <div className="list-row" key={order._id}>
                    <div>
                      <strong>{order.orderNumber}</strong>
                      <p>{order.items.map((item) => `${item.quantity}x ${item.menuItemName}`).join(", ")}</p>
                    </div>
                    <div className="align-right">
                      <strong>{formatCurrency(order.totalAmount)}</strong>
                      <span>{order.status}</span>
                    </div>
                  </div>
                ))}
              </Section>
            </div>
          ) : null}

          {tab === "users" ? (
            <Section
              action={
                <button
                  className="primary-btn"
                  onClick={() => {
                    setFormErrors((prev) => ({ ...prev, user: {} }));
                    setModals((prev) => ({ ...prev, user: true }));
                  }}
                  type="button"
                >
                  Add user
                </button>
              }
              title="System users"
            >
              <DataTable
                columns={["Username", "Email", "Role", "Actions"]}
                rows={data.users.map((item) => [
                  item.username,
                  item.email || "-",
                  formatRole(item.role),
                  <div className="action-group" key={item._id}>
                    <button
                      className="ghost-btn action-btn"
                      onClick={() => {
                        setFormErrors((prev) => ({ ...prev, user: {} }));
                        setForms((prev) => ({ ...prev, user: { ...emptyUserForm(), ...item, password: "" } }));
                        setModals((prev) => ({ ...prev, user: true }));
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="danger-btn action-btn"
                      onClick={() =>
                        systemApi
                          .deleteUser(item._id)
                          .then(async () => {
                            setNotice("User deleted successfully.");
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ])}
              />
            </Section>
          ) : null}

          {tab === "menu" ? (
            <Section
              action={
                <button
                  className="primary-btn"
                  onClick={() => {
                    setFormErrors((prev) => ({ ...prev, menu: {} }));
                    setModals((prev) => ({ ...prev, menu: true }));
                  }}
                  type="button"
                >
                  Add item
                </button>
              }
              title="Menu management"
            >
              <DataTable
                columns={["Item", "Category", "Price", "Stock", "Visible", "Actions"]}
                rows={data.menu.map((item) => [
                  <div key={item._id} className="table-media">
                    <img alt={item.name} src={resolveMediaUrl(item.imageUrl) || "https://via.placeholder.com/64"} />
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>,
                  item.category,
                  formatCurrency(item.price),
                  item.stock,
                  item.available ? "Active" : "Hidden",
                  <div className="action-group" key={item._id}>
                    <button
                      className="ghost-btn action-btn"
                      onClick={() => {
                        setFormErrors((prev) => ({ ...prev, menu: {} }));
                        setForms((prev) => ({ ...prev, menu: { ...emptyMenuForm(), ...item, id: item._id, imageFile: null } }));
                        setModals((prev) => ({ ...prev, menu: true }));
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="ghost-btn action-btn"
                      onClick={() =>
                        systemApi
                          .toggleMenuAvailability(item._id)
                          .then(async () => {
                            setNotice("Menu availability updated.");
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      type="button"
                    >
                      Toggle
                    </button>
                    <button
                      className="danger-btn action-btn"
                      onClick={() =>
                        systemApi
                          .deleteMenu(item._id)
                          .then(async () => {
                            setNotice("Menu item deleted successfully.");
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ])}
              />
            </Section>
          ) : null}

          {tab === "orders" ? (
            <Section title="Order management">
              <DataTable
                columns={["Order", "Items", "Total", "Status", "Actions"]}
                rows={data.orders.map((order) => [
                  order.orderNumber,
                  order.items.map((item) => `${item.quantity}x ${item.menuItemName}`).join(", "),
                  formatCurrency(order.totalAmount),
                  order.status,
                  <div className="action-group" key={order._id}>
                    <select
                      onChange={(event) =>
                        systemApi
                          .updateOrderStatus(order._id, event.target.value)
                          .then(async () => {
                            setNotice(`Order ${order.orderNumber} status updated.`);
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      value={order.status}
                    >
                      {ORDER_STEPS.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                    <button
                      className="danger-btn action-btn"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
                          systemApi
                            .deleteOrder(order._id)
                            .then(async () => {
                              setNotice("Order deleted successfully.");
                              await loadAdmin();
                            })
                            .catch((err) => setState((prev) => ({ ...prev, error: err.message })));
                        }
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ])}
              />
            </Section>
          ) : null}

          {tab === "inventory" ? (
            <div className="stack-lg">
              <Section title="Menu stock">
                <DataTable
                  columns={["Item", "Stock", "Update"]}
                  rows={data.menu.map((item) => [
                    item.name,
                    item.stock,
                    <input
                      key={item._id}
                      defaultValue={item.stock}
                      min="0"
                      onBlur={(event) => systemApi.updateMenuStock(item._id, event.target.value).then(loadAdmin)}
                      type="number"
                    />
                  ])}
                />
              </Section>
              <Section
                action={
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setFormErrors((prev) => ({ ...prev, pantry: {} }));
                      setModals((prev) => ({ ...prev, pantry: true }));
                    }}
                    type="button"
                  >
                    Add pantry item
                  </button>
                }
                title="Pantry inventory"
              >
                <DataTable
                  columns={["Name", "Quantity", "Unit", "Threshold", "Actions"]}
                  rows={data.pantry.map((item) => [
                    item.name,
                    item.quantity,
                    item.unit,
                    item.threshold,
                    <div className="action-group" key={item._id}>
                      <button
                      className="ghost-btn action-btn"
                      onClick={() => {
                        setFormErrors((prev) => ({ ...prev, pantry: {} }));
                        setForms((prev) => ({ ...prev, pantry: item }));
                        setModals((prev) => ({ ...prev, pantry: true }));
                      }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="danger-btn action-btn"
                        onClick={() =>
                          systemApi
                            .deletePantry(item._id)
                            .then(async () => {
                              setNotice("Pantry item deleted successfully.");
                              await loadAdmin();
                            })
                            .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                        }
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ])}
                />
              </Section>
            </div>
          ) : null}

          {tab === "promotions" ? (
            <Section
              action={
                <button
                  className="primary-btn"
                  onClick={() => {
                    setFormErrors((prev) => ({ ...prev, promo: {} }));
                    setModals((prev) => ({ ...prev, promo: true }));
                  }}
                  type="button"
                >
                  Add promo
                </button>
              }
              title="Promotion management"
            >
              <DataTable
                columns={["Name", "Code", "Discount", "Expiry", "Status", "Actions"]}
                rows={data.promotions.map((promo) => [
                  promo.name,
                  promo.promoCode,
                  `${promo.discountPercentage}%`,
                  promo.expiryDate || "-",
                  promo.active ? "Active" : "Inactive",
                  <div className="action-group" key={promo._id}>
                    <button
                      className="ghost-btn action-btn"
                      onClick={() => {
                        setFormErrors((prev) => ({ ...prev, promo: {} }));
                        setForms((prev) => ({ ...prev, promo }));
                        setModals((prev) => ({ ...prev, promo: true }));
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="ghost-btn action-btn"
                      onClick={() =>
                        systemApi
                          .updatePromotion(promo._id, { ...promo, active: !promo.active })
                          .then(async () => {
                            setNotice(`Promotion ${promo.active ? "disabled" : "enabled"} successfully.`);
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      type="button"
                    >
                      Toggle
                    </button>
                    <button
                      className="danger-btn action-btn"
                      onClick={() =>
                        systemApi
                          .deletePromotion(promo._id)
                          .then(async () => {
                            setNotice("Promotion deleted successfully.");
                            await loadAdmin();
                          })
                          .catch((err) => setState((prev) => ({ ...prev, error: err.message })))
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ])}
              />
            </Section>
          ) : null}

          {tab === "feedback" ? (
            <Section title="Feedback management">
              <DataTable
                columns={["Rating", "Comment", "Date", "Actions"]}
                rows={data.feedback.map((item) => [
                  `${item.rating} / 5`,
                  item.comment || "-",
                  formatDate(item.createdAt),
                  <button className="danger-btn action-btn" key={item._id} onClick={() => systemApi.deleteFeedback(item._id).then(loadAdmin)} type="button">
                    Delete
                  </button>
                ])}
              />
            </Section>
          ) : null}
        </main>
      </section>

      {modals.user ? (
        <Modal
          title={forms.user._id ? "Edit user" : "Add user"}
          onClose={() => {
            setModals((prev) => ({ ...prev, user: false }));
            setFormErrors((prev) => ({ ...prev, user: {} }));
          }}
        >
          <AdminUserForm form={forms.user} onChange={(user) => setForms((prev) => ({ ...prev, user }))} errors={formErrors.user} />
          <button className="primary-btn wide-btn" disabled={state.saving} onClick={saveUser} type="button">
            Save user
          </button>
        </Modal>
      ) : null}
      {modals.menu ? (
        <Modal
          title={forms.menu.id ? "Edit menu item" : "Add menu item"}
          onClose={() => {
            setModals((prev) => ({ ...prev, menu: false }));
            setFormErrors((prev) => ({ ...prev, menu: {} }));
          }}
        >
          <AdminMenuForm form={forms.menu} onChange={(menu) => setForms((prev) => ({ ...prev, menu }))} errors={formErrors.menu} />
          <button className="primary-btn wide-btn" disabled={state.saving} onClick={saveMenu} type="button">
            Save item
          </button>
        </Modal>
      ) : null}
      {modals.promo ? (
        <Modal
          title={forms.promo._id ? "Edit promotion" : "Add promotion"}
          onClose={() => {
            setModals((prev) => ({ ...prev, promo: false }));
            setFormErrors((prev) => ({ ...prev, promo: {} }));
          }}
        >
          <AdminPromoForm form={forms.promo} onChange={(promo) => setForms((prev) => ({ ...prev, promo }))} errors={formErrors.promo} />
          <button className="primary-btn wide-btn" disabled={state.saving} onClick={savePromo} type="button">
            Save promotion
          </button>
        </Modal>
      ) : null}
      {modals.pantry ? (
        <Modal
          title={forms.pantry._id ? "Edit pantry item" : "Add pantry item"}
          onClose={() => {
            setModals((prev) => ({ ...prev, pantry: false }));
            setFormErrors((prev) => ({ ...prev, pantry: {} }));
          }}
        >
          <AdminPantryForm form={forms.pantry} onChange={(pantry) => setForms((prev) => ({ ...prev, pantry }))} errors={formErrors.pantry} />
          <button className="primary-btn wide-btn" disabled={state.saving} onClick={savePantry} type="button">
            Save pantry item
          </button>
        </Modal>
      ) : null}
    </AppShell>
  );
}

