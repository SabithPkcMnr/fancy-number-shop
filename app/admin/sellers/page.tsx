"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdminData } from "@/components/admin/admin-data";
import { nextId } from "@/lib/ids";
import { OWN_SELLER_ID, sellerStats } from "@/lib/sellers";
import type { Seller } from "@/lib/types";

const empty: Omit<Seller, "id" | "createdAt" | "isOwn"> = {
  name: "",
  phone: "",
  email: "",
  city: "",
  notes: "",
  active: true,
};

export default function AdminSellersPage() {
  const { data, save } = useAdminData();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [note, setNote] = useState("");

  const sellers = data?.sellers ?? [];
  const numbers = data?.numbers ?? [];
  const rows = useMemo(
    () =>
      sellers.map((seller) => ({
        seller,
        stats: sellerStats(numbers, seller.id),
      })),
    [sellers, numbers],
  );

  if (!data) return <p className="text-muted">Loading sellers…</p>;

  async function persist(next: Seller[]) {
    const ok = await save({ sellers: next });
    setNote(ok ? "Saved." : "Save failed.");
    if (ok) setEditing(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Sellers</h1>
          <p className="text-muted text-sm mt-1">In-house stock and partner inventory. Shoppers never see this split.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setForm(empty);
            setEditing("new");
          }}
        >
          Add seller
        </button>
      </div>
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}

      {editing && (
        <div className="card-surface p-4 sm:p-5 mt-5 grid sm:grid-cols-2 gap-3">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <label className="sm:col-span-2 text-sm">
            Notes
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full h-24 rounded-xl border border-line p-3" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              className="btn-primary"
              onClick={() => {
                if (!form.name.trim()) {
                  setNote("Seller name is required.");
                  return;
                }
                if (editing === "new") {
                  persist([
                    {
                      ...form,
                      id: nextId("seller"),
                      isOwn: false,
                      createdAt: new Date().toISOString(),
                    },
                    ...sellers,
                  ]);
                  return;
                }
                persist(sellers.map((item) => (item.id === editing ? { ...item, ...form, isOwn: item.isOwn } : item)));
              }}
            >
              Save seller
            </button>
            <button className="h-11 px-4 rounded-xl border border-line" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {rows.map(({ seller, stats }) => (
          <article key={seller.id} className="card-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {seller.name} {seller.isOwn ? <span className="text-xs text-azure font-bold uppercase tracking-wide">In-house</span> : null}
                </p>
                <p className="text-sm text-muted mt-1">
                  {seller.city || "No city"} · {seller.phone || "No phone"} · {seller.active ? "Active" : "Inactive"}
                </p>
                {seller.notes ? <p className="text-sm mt-2">{seller.notes}</p> : null}
              </div>
              <div className="flex gap-2">
                <button
                  className="h-10 px-3 rounded-xl border border-line text-sm font-semibold"
                  onClick={() => {
                    setForm({
                      name: seller.name,
                      phone: seller.phone,
                      email: seller.email,
                      city: seller.city,
                      notes: seller.notes,
                      active: seller.active,
                    });
                    setEditing(seller.id);
                  }}
                >
                  Edit
                </button>
                {!seller.isOwn && seller.id !== OWN_SELLER_ID && (
                  <button className="h-10 px-3 rounded-xl border border-line text-sm font-semibold text-danger" onClick={() => persist(sellers.filter((item) => item.id !== seller.id))}>
                    Delete
                  </button>
                )}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Stat label="Total" value={stats.total} />
              <Stat label="Live" value={stats.live} />
              <Stat label="Sold" value={stats.sold} />
              <Stat label="Private" value={stats.private} />
            </dl>
            <Link href={`/admin/numbers?seller=${seller.id}`} className="inline-block mt-4 text-sm font-semibold text-azure">
              View this seller’s numbers
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <dt className="text-muted text-xs">{label}</dt>
      <dd className="font-display text-2xl mt-1">{value}</dd>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-11 rounded-xl border border-line px-3" />
    </label>
  );
}
