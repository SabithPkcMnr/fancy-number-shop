"use client";

import { useMemo, useState } from "react";
import { categories } from "@/lib/catalog";
import { formatPattern, inr } from "@/lib/site";
import type { CategorySlug, CheckoutMode, NumberStatus, VipNumber } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

const emptyForm = {
  digits: "",
  pattern: "",
  originalPrice: "5000",
  discount: "10",
  category: "unique" as CategorySlug,
  checkout: "whatsapp" as CheckoutMode,
  status: "live" as NumberStatus,
  featured: false,
  offer: false,
  prebook: false,
  prebookDate: "",
};

export default function AdminNumbersPage() {
  const { data, save } = useAdminData();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [note, setNote] = useState("");

  const numbers = data?.numbers ?? [];
  const filtered = useMemo(() => {
    const needle = q.replace(/\D/g, "");
    return numbers.filter((item) => !needle || item.digits.includes(needle) || item.pattern.includes(q));
  }, [numbers, q]);

  function openNew() {
    setForm(emptyForm);
    setEditing("new");
  }

  function openEdit(item: VipNumber) {
    setForm({
      digits: item.digits,
      pattern: item.pattern,
      originalPrice: String(item.originalPrice),
      discount: String(item.discount),
      category: item.category,
      checkout: item.checkout,
      status: item.status,
      featured: Boolean(item.featured),
      offer: Boolean(item.offer),
      prebook: Boolean(item.prebook),
      prebookDate: item.prebookDate ?? "",
    });
    setEditing(item.id);
  }

  async function persist(next: VipNumber[]) {
    const ok = await save({ numbers: next });
    setNote(ok ? "Saved." : "Save failed.");
    if (ok) setEditing(null);
  }

  async function submit() {
    const digits = form.digits.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setNote("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    const originalPrice = Number(form.originalPrice) || 0;
    const discount = Number(form.discount) || 0;
    const item: VipNumber = {
      id: digits,
      digits,
      pattern: form.pattern.trim() || formatPattern(digits),
      originalPrice,
      discount,
      price: Math.round(originalPrice * (1 - discount / 100)),
      category: form.category,
      categories: [form.category],
      checkout: form.checkout,
      status: form.status,
      featured: form.featured,
      offer: form.offer,
      prebook: form.prebook,
      prebookDate: form.prebookDate || undefined,
    };
    const next =
      editing === "new" || !numbers.some((n) => n.id === item.id)
        ? [item, ...numbers.filter((n) => n.id !== item.id)]
        : numbers.map((n) => (n.id === editing ? { ...n, ...item, categories: Array.from(new Set([item.category, ...n.categories])) } : n));
    await persist(next);
  }

  if (!data) return <p className="text-muted">Loading numbers…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Numbers</h1>
          <p className="text-muted text-sm mt-1">{numbers.length} in catalogue. Set each one to Razorpay or WhatsApp.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          Add number
        </button>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search digits" className="mt-5 w-full max-w-sm h-11 rounded-xl border border-line px-3" />
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}

      {editing && (
        <div className="card-surface p-5 mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Field label="Digits" value={form.digits} onChange={(v) => setForm({ ...form, digits: v })} />
          <Field label="Display pattern" value={form.pattern} onChange={(v) => setForm({ ...form, pattern: v })} />
          <Field label="Original price" value={form.originalPrice} onChange={(v) => setForm({ ...form, originalPrice: v })} />
          <Field label="Discount %" value={form.discount} onChange={(v) => setForm({ ...form, discount: v })} />
          <label className="text-sm">
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as CategorySlug })} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Buy button
            <select value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value as CheckoutMode })} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
              <option value="whatsapp">WhatsApp chat</option>
              <option value="razorpay">Razorpay checkout</option>
            </select>
          </label>
          <label className="text-sm">
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as NumberStatus })} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
              <option value="live">Live</option>
              <option value="sold">Sold</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <Field label="Prebook date" value={form.prebookDate} onChange={(v) => setForm({ ...form, prebookDate: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.offer} onChange={(e) => setForm({ ...form, offer: e.target.checked })} /> Offer
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.prebook} onChange={(e) => setForm({ ...form, prebook: e.target.checked })} /> Prebook
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button onClick={submit} className="btn-primary">
              Save number
            </button>
            <button onClick={() => setEditing(null)} className="h-11 px-4 rounded-xl border border-line">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-auto card-surface">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Number</th>
              <th className="p-3">Price</th>
              <th className="p-3">Buy via</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 80).map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="p-3">
                  <p className="font-semibold number-digits">{item.pattern}</p>
                  <p className="text-xs text-muted">{item.category}</p>
                </td>
                <td className="p-3">{inr(item.price)}</td>
                <td className="p-3">
                  <select
                    value={item.checkout}
                    onChange={(e) => save({ numbers: numbers.map((n) => (n.id === item.id ? { ...n, checkout: e.target.value as CheckoutMode } : n)) })}
                    className="h-9 rounded-lg border border-line px-2 bg-white"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </td>
                <td className="p-3 capitalize">{item.status}</td>
                <td className="p-3 text-right space-x-3">
                  <button onClick={() => openEdit(item)} className="text-azure font-semibold">
                    Edit
                  </button>
                  <button onClick={() => persist(numbers.filter((n) => n.id !== item.id))} className="text-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
