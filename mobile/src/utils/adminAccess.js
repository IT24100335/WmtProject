export const ADMIN_TAB_ACCESS = {
  ADMIN: ["Overview", "Menu", "Orders", "Promos", "Inventory", "Feedback", "Users"],
  MENU_MANAGER: ["Menu"],
  ORDER_MANAGER: ["Orders"],
  INVENTORY_MANAGER: ["Inventory"],
  PROMOTION_MANAGER: ["Promos"],
  FEEDBACK_MANAGER: ["Feedback"]
};

export function getAllowedAdminTabs(role) {
  return ADMIN_TAB_ACCESS[role] || [];
}
