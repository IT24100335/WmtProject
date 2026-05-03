import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.details = details;
    this.status = details.status || 500;
  }
}

async function getToken() {
  return AsyncStorage.getItem("crave_token");
}

export async function request(path, options = {}) {
  const token = options.token || (await getToken());
  const isFormData = options.body && typeof options.body.append === "function";

  const headers = {
    ...(isFormData ? { "Accept": "application/json" } : options.body ? { "Content-Type": "application/json", "Accept": "application/json" } : { "Accept": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(payload.message || "Request failed", { status: response.status, payload });
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (body) => request("/auth/login", { method: "POST", body }),
  register: (body) => request("/auth/register", { method: "POST", body }),
  me: () => request("/users/me"),
  menu: () => request("/menu"),
  recommended: () => request("/menu/recommended"),
  saveMenu: (formData) => request("/menu", { method: "POST", body: formData }),
  createOrder: (body) => request("/orders", { method: "POST", body }),
  orders: () => request("/orders"),
  orderById: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: "PUT" }),
  updateOrderAddress: (id, deliveryAddress) =>
    request(`/orders/${id}/address`, { method: "PUT", body: { deliveryAddress } }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
  feedback: () => request("/feedback"),
  myFeedback: () => request("/feedback/me"),
  submitFeedback: (body) => request("/feedback", { method: "POST", body }),
  deleteFeedback: (id) => request(`/feedback/${id}`, { method: "DELETE" }),
  promotions: () => request("/promotions"),
  validatePromo: (code) => request(`/promotions/validate/${code}`),
  pantry: () => request("/inventory/pantry"),
  users: () => request("/users"),
  createUser: (body) => request("/users", { method: "POST", body }),
  updateUser: (id, body) => request(`/users/${id}`, { method: "PUT", body }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  updateMenu: (body) => request("/menu", { method: "POST", body }),
  updateMenuAvailability: (id) => request(`/menu/${id}/toggle-availability`, { method: "PUT" }),
  deleteMenu: (id) => request(`/menu/${id}`, { method: "DELETE" }),
  updatePromotion: (id, body) => request(`/promotions/${id}`, { method: "PUT", body }),
  createPromotion: (body) => request("/promotions", { method: "POST", body }),
  deletePromotion: (id) => request(`/promotions/${id}`, { method: "DELETE" }),
  savePantry: (id, body) =>
    request(id ? `/inventory/pantry/${id}` : "/inventory/pantry", {
      method: id ? "PUT" : "POST",
      body
    }),
  deletePantry: (id) => request(`/inventory/pantry/${id}`, { method: "DELETE" }),
  updateMenuStock: (id, stock) => request(`/inventory/${id}/stock?newStock=${encodeURIComponent(stock)}`, { method: "PUT" })
};

export { ApiError };
