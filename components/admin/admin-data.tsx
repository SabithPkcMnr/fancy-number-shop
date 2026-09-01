"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadAdminData, saveAdminData } from "@/lib/admin-client";
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
    try {
      setData(await loadAdminData());
      setError("");
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") return;
      setError("Could not load admin data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload().catch(() => setError("Could not load admin data."));
  }, [reload]);

  const save = useCallback(async (patch: Partial<AppData>) => {
    try {
      setData(await saveAdminData(patch));
      setError("");
      return true;
    } catch {
      setError("Save failed.");
      return false;
    }
  }, []);

  const value = useMemo(() => ({ data, loading, error, reload, save }), [data, loading, error, reload, save]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminData must be used in admin");
  return ctx;
}
