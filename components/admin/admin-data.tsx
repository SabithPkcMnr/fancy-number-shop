"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppData } from "@/lib/types";

type AdminCtx = {
  data: AppData | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  save: (patch: Partial<AppData>) => Promise<boolean>;
};

const Ctx = createContext<AdminCtx | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    if (!res.ok) {
      setError("Could not load admin data.");
      setLoading(false);
      return;
    }
    setData(await res.json());
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    reload().catch(() => setError("Could not load admin data."));
  }, [reload]);

  const save = useCallback(async (patch: Partial<AppData>) => {
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setError("Save failed.");
      return false;
    }
    setData(await res.json());
    setError("");
    return true;
  }, []);

  const value = useMemo(() => ({ data, loading, error, reload, save }), [data, loading, error, reload, save]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminData must be used in admin");
  return ctx;
}
