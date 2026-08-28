"use client";

import { useMemo, useState } from "react";
import { inr } from "@/lib/site";
import type { Order, OrderStatus } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

const statuses: OrderStatus[] = ["pending", "paid", "processing", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const { data, save } = useAdminData();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "orders" | "bookings">("all");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const orders = data?.orders ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((order) => {
      if (tab === "orders" && order.payment !== "razorpay") return false;
      if (tab === "bookings" && order.payment !== "whatsapp") return false;
      if (status !== "all" && order.status !== status) return false;
      if (!needle) return true;
      const hay = [order.id, order.customer.name, order.customer.phone, order.customer.email, ...order.items.map((item) => `${item.digits} ${item.pattern}`)]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle) || order.customer.phone.includes(q.replace(/\D/g, ""));
    });
  }, [orders, q, tab, status]);

  async function patchOrder(id: string, update: Partial<Order>) {
    if (!data) return;
    const current = data.orders.find((item) => item.id === id);
    if (!current) return;
    const nextOrder = { ...current, ...update };
    const sold = nextOrder.status === "paid" || nextOrder.status === "completed";
    const cancelled = nextOrder.status === "cancelled";
    const ids = new Set(nextOrder.items.map((item) => item.id));
    await save({
      orders: data.orders.map((item) => (item.id === id ? nextOrder : item)),
      numbers: data.numbers.map((item) => {
        if (!ids.has(item.id)) return item;
        if (sold) return { ...item, status: "sold" };
        if (cancelled && item.status === "sold") return { ...item, status: "live" };
        return item;
      }),
    });
  }

  if (!data) return <p className="text-muted">Loading orders…</p>;

  const bookingCount = orders.filter((item) => item.payment === "whatsapp").length;
  const pendingCount = orders.filter((item) => item.status === "pending" || item.status === "processing").length;

  return (
    <div>
      <h1 className="font-display text-3xl">Orders & bookings</h1>
      <p className="text-muted text-sm mt-1">
        {orders.length} total · {bookingCount} WhatsApp bookings · {pendingCount} need action
      </p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(
          [
            ["all", "All"],
            ["orders", "Paid / Razorpay"],
            ["bookings", "WhatsApp bookings"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`whitespace-nowrap h-9 px-3 rounded-full text-sm font-semibold ${tab === id ? "bg-azure text-white" : "bg-white border border-line"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...statuses] as const).map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`whitespace-nowrap h-8 px-3 rounded-full text-xs font-semibold capitalize ${status === item ? "bg-navy text-white" : "bg-slate-100"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, phone, order ID, number"
        className="mt-4 w-full h-11 rounded-xl border border-line px-3"
      />

      <div className="mt-5 space-y-3">
        {filtered.length === 0 && <p className="text-sm text-muted py-10 text-center">No orders in this view.</p>}
        {filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            open={openId === order.id}
            onToggle={() => setOpenId(openId === order.id ? null : order.id)}
            onPatch={(update) => patchOrder(order.id, update)}
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  open,
  onToggle,
  onPatch,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
  onPatch: (update: Partial<Order>) => void;
}) {
  const [upc, setUpc] = useState(order.upc ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const phone = order.customer.phone.replace(/\D/g, "");
  const wa = phone ? `https://wa.me/91${phone.replace(/^91/, "")}` : "";

  return (
    <article className="card-surface p-4">
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">{order.id}</p>
            <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-2 font-display text-lg number-digits">{order.items.map((item) => item.pattern).join(" · ")}</p>
        <p className="mt-1 text-sm">
          {order.customer.name} · {inr(order.total)}
        </p>
        <p className="text-xs text-muted capitalize mt-1">
          {order.payment === "whatsapp" ? "WhatsApp booking" : order.payment} {order.customer.phone ? `· ${order.customer.phone}` : ""}
        </p>
      </button>

      {open && (
        <div className="mt-4 border-t border-line pt-4 space-y-3">
          <p className="text-sm">
            {order.customer.email && <span className="block text-muted">{order.customer.email}</span>}
            {order.customer.city && <span className="block text-muted">{order.customer.city}</span>}
            {order.paymentId && <span className="block text-xs text-muted mt-1">Pay ID {order.paymentId}</span>}
          </p>
          <div className="flex gap-2">
            {phone && (
              <a href={`tel:${phone}`} className="flex-1 h-10 rounded-xl border border-line text-sm font-semibold grid place-items-center">
                Call
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="flex-1 h-10 rounded-xl bg-[#16a34a] text-white text-sm font-semibold grid place-items-center">
                WhatsApp
              </a>
            )}
          </div>
          <label className="text-sm block">
            Status
            <select
              value={order.status}
              onChange={(e) => onPatch({ status: e.target.value as OrderStatus })}
              className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm block">
            UPC
            <input value={upc} onChange={(e) => setUpc(e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-line px-3" placeholder="Unique porting code" />
          </label>
          <label className="text-sm block">
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-line px-3 py-2" placeholder="Desk notes, promised date, follow-up…" />
          </label>
          <button onClick={() => onPatch({ upc, notes })} className="btn-primary w-full">
            Save UPC & notes
          </button>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const tone: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-sky-100 text-sky-800",
    processing: "bg-indigo-100 text-indigo-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-slate-200 text-slate-600",
  };
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tone[status]}`}>{status}</span>;
}
