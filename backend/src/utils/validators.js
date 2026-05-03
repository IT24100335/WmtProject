export function assertRequiredFields(fields, payload) {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === "");

  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}

function fail(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

export function assertString(value, field, { min = 1, max = 200 } = {}) {
  if (typeof value !== "string") {
    fail(`${field} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min) {
    fail(`${field} must be at least ${min} characters`);
  }
  if (trimmed.length > max) {
    fail(`${field} must be at most ${max} characters`);
  }
  return trimmed;
}

export function assertOptionalString(value, field, { max = 500 } = {}) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return assertString(String(value), field, { min: 0, max });
}

export function assertEmail(value, field = "email") {
  const text = assertString(value, field, { min: 5, max: 120 }).toLowerCase();
  // Simple practical email check (good enough for student projects).
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  if (!ok) {
    fail(`${field} must be a valid email address`);
  }
  return text;
}

export function assertNumber(value, field, { min = undefined, max = undefined } = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    fail(`${field} must be a number`);
  }
  if (min !== undefined && num < min) {
    fail(`${field} must be at least ${min}`);
  }
  if (max !== undefined && num > max) {
    fail(`${field} must be at most ${max}`);
  }
  return num;
}

export function assertInt(value, field, { min = undefined, max = undefined } = {}) {
  const num = assertNumber(value, field, { min, max });
  if (!Number.isInteger(num)) {
    fail(`${field} must be an integer`);
  }
  return num;
}

export function assertEnum(value, field, allowed) {
  if (!allowed.includes(value)) {
    fail(`${field} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

export function assertValidDateString(value, field) {
  const text = assertString(value, field, { min: 4, max: 40 });
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    fail(`${field} must be a valid date`);
  }
  return text;
}

export function assertArray(value, field, { minLength = 0 } = {}) {
  if (!Array.isArray(value)) {
    fail(`${field} must be an array`);
  }
  if (value.length < minLength) {
    fail(`${field} must have at least ${minLength} items`);
  }
  return value;
}
