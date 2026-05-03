export function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "N/A";
}

export function formatRole(role) {
  return role.toLowerCase().replaceAll("_", " ");
}
