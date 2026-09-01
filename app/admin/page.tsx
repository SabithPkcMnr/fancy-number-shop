"use client";

import Link from "next/link";
import { inr } from "@/lib/site";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminHomePage() {
  const { data, loading } = useAdminData();
  if (loading || !data) return <p className="text-muted">Loading dashboard…</p>;

  const live = data.numbers.filter((item) => item.status === "live").length;
  const sold = data.numbers.filter((item) => item.status === "sold").length;
  const revenue = data.orders.filter((order) => order.status === "paid" || order.status === "completed").reduce((sum, order) => sum + order.total, 0);
  const pending = data.orders.filter((order) => order.status === "pending" || order.status === "processing").length;

  const own = data.numbers.filter((item) => (item.sellerId || "own") === "own").length;
  const partner = data.numbers.length - own;
  const cards = [
    { label: "Live numbers", value: live, href: "/admin/numbers" },
    { label: "Sold numbers", value: sold, href: "/admin/numbers" },
    { label: "In-house numbers", value: own, href: "/admin/numbers?seller=own" },
    { label: "Partner numbers", value: partner, href: "/admin/sellers" },
    { label: "Orders & bookings", value: data.orders.length, href: "/admin/orders" },
    { label: "Revenue", value: inr(revenue), href: "/admin/orders" },
    { label: "Registered users", value: data.users.length, href: "/admin/users" },
    { label: "Open inquiries", value: data.inquiries.filter((item) => item.status !== "closed").length, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-muted mt-1">
        {pending} orders need action. Website: fancynumbershop.com
        {data.settings.maintenanceMode ? " · Shop is in maintenance" : ""}
      </p>
      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card-surface p-5 hover:border-azure">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="card-surface p-5">
          <h2 className="font-semibold">Recent orders</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.orders.slice(0, 6).map((order) => (
              <li key={order.id} className="flex justify-between gap-3">
                <span>
                  {order.id} · {order.items[0]?.pattern}
                </span>
                <span className="text-muted">
                  {inr(order.total)} · {order.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card-surface p-5">
          <h2 className="font-semibold">Latest users</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.users.slice(0, 6).map((user) => (
              <li key={user.id} className="flex justify-between gap-3">
                <span>{user.name}</span>
                <span className="text-muted">{user.phone}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
