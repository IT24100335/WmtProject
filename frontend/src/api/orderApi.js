import { request } from "./index";

export const orderApi = {
  list: (token) => request("/orders", { token }),
  create: (token, payload) => request("/orders", { method: "POST", token, body: payload })
};

