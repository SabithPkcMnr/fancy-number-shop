"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminDataProvider } from "@/components/admin/admin-data";
import { AdminShell } from "@/components/admin/shell";
import { checkAdminSession } from "@/lib/admin-client";
import { isAdminLoginPath } from "@/lib/paths";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const login = isAdminLoginPath(path);
  const [ready, setReady] = useState(login);

  useEffect(() => {
    if (isAdminLoginPath(path)) {
      setReady(true);
      return;
    }
    checkAdminSession()
      .then((ok) => {
        if (!ok) router.replace("/admin/login");
        else setReady(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [path, router]);

  if (login) return <>{children}</>;
  if (!ready) return <div className="min-h-screen grid place-items-center text-muted">Loading admin…</div>;

  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
