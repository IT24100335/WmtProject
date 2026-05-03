import { request } from "./index";

export const adminApi = {
  users: (token) => request("/users", { token }),
  promotions: (token) => request("/promotions", { token }),
  inventory: (token) => request("/inventory/pantry", { token }),
  feedbackByMenu: (token, menuItemId) => request(`/feedback/${menuItemId}`, { token })
};

