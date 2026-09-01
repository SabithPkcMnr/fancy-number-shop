"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAdmin } from "@/lib/admin-client";
import { isStaticHost } from "@/lib/paths";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <form
        className="w-full max-w-md card-surface p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          try {
            const ok = await loginAdmin(String(form.get("username") ?? ""), String(form.get("password") ?? ""));
            if (!ok) {
              setError("Invalid username or password.");
              return;
            }
            router.push("/admin");
          } catch {
            setError("Could not reach the server. Check that it is running, then try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-azure">Fancy Number Shop</p>
        <h1 className="font-display text-3xl mt-2">Admin login</h1>
        <p className="text-sm text-muted mt-2">Manage numbers, slides, menus, users, and orders.</p>
        <input name="username" required placeholder="Username" className="mt-6 w-full h-12 rounded-xl border border-line px-3" defaultValue="admin" />
        <input name="password" required type="password" placeholder="Password" className="mt-3 w-full h-12 rounded-xl border border-line px-3" />
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button disabled={busy} className="btn-primary w-full mt-5">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-xs text-muted">Default first login: admin / FancyShop@2026 — change it in Settings after you sign in.</p>
        {isStaticHost() && (
          <p className="mt-2 text-xs text-muted">On this static site, admin data is stored in this browser only.</p>
        )}
      </form>
    </div>
  );
}
