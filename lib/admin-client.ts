import { isStaticHost, withBase } from "./paths";
import { patchStaticStore, readStaticStore, staticHasSession, staticLogin, staticLogout } from "./static-admin";
import type { AppData } from "./types";

export async function checkAdminSession() {
  if (isStaticHost()) return staticHasSession();
  const res = await fetch(withBase("/api/admin/session"), { credentials: "same-origin" });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return Boolean(data.ok);
}

export async function loginAdmin(username: string, password: string) {
  if (isStaticHost()) return staticLogin(username, password);
  const res = await fetch(withBase("/api/admin/login"), {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
}

export async function logoutAdmin() {
  if (isStaticHost()) {
    staticLogout();
    return;
  }
  await fetch(withBase("/api/admin/logout"), { method: "POST", credentials: "same-origin" });
}

export async function loadAdminData(): Promise<AppData> {
  if (isStaticHost()) return readStaticStore();
  const res = await fetch(withBase("/api/admin/data"), { credentials: "same-origin" });
  if (res.status === 401) {
    window.location.href = withBase("/admin/login");
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Could not load admin data.");
  return res.json();
}

export async function saveAdminData(patch: Partial<AppData>): Promise<AppData> {
  if (isStaticHost()) return patchStaticStore(patch);
  const res = await fetch(withBase("/api/admin/data"), {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Save failed.");
  return res.json();
}
