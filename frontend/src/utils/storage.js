import { storageKeys } from "../app/store";

export function saveAuth(auth) {
  localStorage.setItem(storageKeys.auth, JSON.stringify(auth));
}

export function loadAuth() {
  const raw = localStorage.getItem(storageKeys.auth);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(storageKeys.auth);
}

