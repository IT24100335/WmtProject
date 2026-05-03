import { request } from "./index";

export const authApi = {
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  me: (token) => request("/users/me", { token })
};

