"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminDataProvider } from "@/components/admin/admin-data";
import { AdminShell } from "@/components/admin/shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(path === "/admin/login");

  useEffect(() => {
    if (path === "/admin/login") {
      setReady(true);
      return;
    }
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) router.replace("/admin/login");
        else setReady(true);
      })
      .catch(() => router.replace("/admin/login"));
  }, [path, router]);

  if (path === "/admin/login") return <>{children}</>;
  if (!ready) return <div className="min-h-screen grid place-items-center text-muted">Loading admin…</div>;

  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
