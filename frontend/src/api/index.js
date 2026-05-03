import { loadAuth } from "../utils/storage";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://wmtproject.onrender.com/api";

class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function request(path, options = {}) {
  const token = options.token ?? loadAuth()?.token ?? null;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(payload.message || "Request failed", {
      status: response.status,
      details: payload
    });
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
