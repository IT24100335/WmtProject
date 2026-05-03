const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")) ||
  "http://localhost:5001";

export function resolveMediaUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return `${BACKEND_BASE_URL}${url}`;
  }

  return url;
}
