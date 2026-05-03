export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function isMoney(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}

export function isDateIso(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

export function requiredText(value, min = 1) {
  return String(value || "").trim().length >= min;
}
