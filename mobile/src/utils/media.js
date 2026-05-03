import { API_BASE_URL } from "../config";

const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export function resolveMediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("file:")) return url;
  if (url.startsWith("/uploads/")) return `${BACKEND_BASE_URL}${url}`;
  return url;
}
