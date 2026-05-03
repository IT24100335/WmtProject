export const ADMIN_TAB_ACCESS = {
  ADMIN: ["overview", "orders", "menu", "inventory", "promotions", "feedback", "users"],
  MENU_MANAGER: ["menu"],
  ORDER_MANAGER: ["orders"],
  INVENTORY_MANAGER: ["inventory"],
  PROMOTION_MANAGER: ["promotions"],
  FEEDBACK_MANAGER: ["feedback"]
};

export const ADMIN_TAB_LABELS = {
  overview: "Overview",
  users: "Users",
  menu: "Menu",
  orders: "Orders",
  inventory: "Inventory",
  promotions: "Promotions",
  feedback: "Feedback"
};

export function getAllowedAdminTabs(role) {
  return ADMIN_TAB_ACCESS[role] || [];
}

export function getDefaultAdminTab(role) {
  const allowedTabs = getAllowedAdminTabs(role);
  return allowedTabs[0] || "overview";
}
