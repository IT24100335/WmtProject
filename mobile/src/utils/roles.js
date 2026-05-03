export const ADMIN_ROLES = [
  "ADMIN",
  "MENU_MANAGER",
  "ORDER_MANAGER",
  "INVENTORY_MANAGER",
  "PROMOTION_MANAGER",
  "FEEDBACK_MANAGER"
];

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function formatRole(role) {
  return String(role || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
