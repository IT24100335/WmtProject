import { request } from "./index";

export const menuApi = {
  list: (token) => request("/menu", { token }),
  recommended: (token) => request("/menu/recommended", { token })
};

