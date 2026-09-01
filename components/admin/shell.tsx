"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Hash,
  Images,
  Menu,
  Users,
  ShoppingBag,
  MessageSquare,
  Settings,
  Store,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "@/lib/admin-client";
import { samePath } from "@/lib/paths";
import { useAdminData } from "./admin-data";
import { AdminPush } from "./push";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/numbers", label: "Numbers", icon: Hash },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/slides", label: "Slides", icon: Images },
  { href: "/admin/menus", label: "Menus", icon: Menu },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { data, save } = useAdminData();
  const maintenance = Boolean(data?.settings.maintenanceMode);

  async function toggleSite() {
    if (!data) return;
    await save({ settings: { ...data.settings, maintenanceMode: !maintenance } });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 bg-navy text-white p-5 hidden md:flex flex-col">
        <p className="font-extrabold text-lg">FNS Admin</p>
        <p className="text-xs text-white/50 mt-1">Fancy Number Shop</p>
        <button
          type="button"
          onClick={toggleSite}
          className={`mt-5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
            maintenance ? "bg-amber-500 text-navy" : "bg-white/10 text-white"
          }`}
        >
          Shop {maintenance ? "is off" : "is live"}
          <span className="block text-xs font-medium opacity-80 mt-0.5">{maintenance ? "Tap to open for public" : "Tap to turn on maintenance"}</span>
        </button>
        <nav className="mt-6 space-y-1 flex-1">
          {links.map((item) => {
            const active = samePath(path, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ExternalLink size={15} /> View website
        </Link>
        <div className="mt-3">
          <AdminPush />
        </div>
        <button
          className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-white"
          onClick={async () => {
            await logoutAdmin();
            router.push("/admin/login");
          }}
        >
          <LogOut size={15} /> Sign out
        </button>
      </aside>
      <div className="md:pl-64">
        <header className="md:hidden sticky top-0 z-20 bg-navy text-white px-4 py-3 flex items-center justify-between gap-2">
          <p className="font-bold">FNS Admin</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleSite} className={`text-xs font-semibold rounded-full px-3 py-1.5 ${maintenance ? "bg-amber-500 text-navy" : "bg-white/10"}`}>
              {maintenance ? "Shop off" : "Shop live"}
            </button>
            <AdminPush />
            <Link href="/" className="text-xs">
              View site
            </Link>
          </div>
        </header>
        <div className="md:hidden overflow-x-auto bg-white border-b border-line px-3 py-2 flex gap-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                samePath(path, item.href) ? "bg-azure text-white" : "bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
