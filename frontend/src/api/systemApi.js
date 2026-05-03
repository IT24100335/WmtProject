import { request } from "./index";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const systemApi = {
  menu: () => request("/menu"),
  recommendedMenu: () => request("/menu/recommended"),
  saveMenu: async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    return request("/menu", { method: "POST", body: formData });
  },
  toggleMenuAvailability: (id) => request(`/menu/${id}/toggle-availability`, { method: "PUT" }),
  deleteMenu: (id) => request(`/menu/${id}`, { method: "DELETE" }),
  orders: () => request("/orders"),
  orderById: (id) => request(`/orders/${id}`),
  createOrder: (payload) => request("/orders", { method: "POST", body: payload }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status?status=${encodeURIComponent(status)}`, { method: "PUT" }),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: "PUT" }),
  updateOrderAddress: (id, deliveryAddress) =>
    request(`/orders/${id}/address`, { method: "PUT", body: { deliveryAddress } }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
  promotions: () => request("/promotions"),
  createPromotion: (payload) => request("/promotions", { method: "POST", body: payload }),
  updatePromotion: (id, payload) => request(`/promotions/${id}`, { method: "PUT", body: payload }),
  deletePromotion: (id) => request(`/promotions/${id}`, { method: "DELETE" }),
  validatePromotion: (code) => request(`/promotions/validate/${code}`),
  pantry: () => request("/inventory/pantry"),
  savePantry: (id, payload) =>
    request(id ? `/inventory/pantry/${id}` : "/inventory/pantry", {
      method: id ? "PUT" : "POST",
      body: payload
    }),
  deletePantry: (id) => request(`/inventory/pantry/${id}`, { method: "DELETE" }),
  updateMenuStock: (id, stock) =>
    request(`/inventory/${id}/stock?newStock=${encodeURIComponent(stock)}`, { method: "PUT" }),
  feedback: () => request("/feedback"),
  submitFeedback: (payload) => request("/feedback", { method: "POST", body: payload }),
  deleteFeedback: (id) => request(`/feedback/${id}`, { method: "DELETE" }),
  users: () => request("/users"),
  createUser: (payload) => request("/users", { method: "POST", body: payload }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: "PUT", body: payload }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  profile: (id) => request(`/users/profile/${id}`)
};
