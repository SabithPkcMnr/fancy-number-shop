import { mergeStore, seedData } from "./app-data";
import type { AppData } from "./types";

const STORE_KEY = "fns-admin-store-v1";
const SESSION_KEY = "fns-admin-session";

export function readStaticStore(): AppData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return mergeStore(JSON.parse(raw) as Partial<AppData>);
  } catch {
    /* use seed */
  }
  return seedData();
}

export function writeStaticStore(next: AppData) {
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  return next;
}

export function patchStaticStore(patch: Partial<AppData>) {
  return writeStaticStore({ ...readStaticStore(), ...patch });
}

export function staticHasSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function staticLogin(username: string, password: string) {
  const { settings } = readStaticStore();
  if (username.trim() !== settings.adminUser || password !== settings.adminPassword) return false;
  sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function staticLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}
