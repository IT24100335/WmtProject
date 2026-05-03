import { ADMIN_ROLES } from "../constants/roles";

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isCustomerRole(role) {
  return role === "CUSTOMER";
}
