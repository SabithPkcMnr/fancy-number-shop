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
  ExternalLink,
  LogOut,
} from "lucide-react";
import { AdminPush } from "./push";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/numbers", label: "Numbers", icon: Hash },
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 bg-navy text-white p-5 hidden md:flex flex-col">
        <p className="font-extrabold text-lg">FNS Admin</p>
        <p className="text-xs text-white/50 mt-1">Fancy Number Shop</p>
        <nav className="mt-8 space-y-1 flex-1">
          {links.map((item) => {
            const active = path === item.href;
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
            await fetch("/api/admin/logout", { method: "POST" });
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
                path === item.href ? "bg-azure text-white" : "bg-slate-100"
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
