import { ORDER_STEPS } from "../constants/orderSteps";

const CART_KEY = "fastfood-cart";
const ORDER_KEY = "fastfood-active-order";

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function readActiveOrderId() {
  return localStorage.getItem(ORDER_KEY);
}

export function saveActiveOrderId(id) {
  if (!id) {
    localStorage.removeItem(ORDER_KEY);
    return;
  }

  localStorage.setItem(ORDER_KEY, id);
}

export function getStepIndex(status) {
  return Math.max(0, ORDER_STEPS.indexOf(status));
}
