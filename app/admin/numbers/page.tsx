"use client";

import { useMemo, useState } from "react";
import { categories } from "@/lib/catalog";
import { formatPattern, inr } from "@/lib/site";
import type { CategorySlug, CheckoutMode, DigitHighlight, NumberStatus, VipNumber } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";
import { HighlightEditor } from "@/components/admin/highlight-editor";
import { PatternHighlight } from "@/components/pattern-highlight";

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
  highlights: [] as DigitHighlight[],
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
    setNote("");
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
      highlights: item.highlights ?? [],
    });
    setEditing(item.id);
    setNote("");
  }

  async function persist(next: VipNumber[], close = true) {
    const ok = await save({ numbers: next });
    setNote(ok ? "Saved." : "Save failed.");
    if (ok && close) setEditing(null);
  }

  async function submit() {
    const digits = form.digits.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setNote("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    const originalPrice = Number(form.originalPrice) || 0;
    const discount = Number(form.discount) || 0;
    const existing = numbers.find((item) => item.id === (editing === "new" ? digits : editing));
    const item: VipNumber = {
      id: digits,
      digits,
      pattern: form.pattern.trim() || formatPattern(digits),
      originalPrice,
      discount,
      price: Math.round(originalPrice * (1 - discount / 100)),
      category: form.category,
      categories: Array.from(new Set([form.category, ...(existing?.categories ?? [])])),
      checkout: form.checkout,
      status: form.status,
      featured: form.featured,
      offer: form.offer,
      prebook: form.prebook,
      prebookDate: form.prebookDate || undefined,
      familyGroup: existing?.familyGroup,
      highlights: form.highlights,
    };
    const next =
      editing === "new" || !numbers.some((n) => n.id === item.id)
        ? [item, ...numbers.filter((n) => n.id !== item.id)]
        : numbers.map((n) => (n.id === editing ? { ...n, ...item } : n));
    await persist(next);
  }

  if (!data) return <p className="text-muted">Loading numbers…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Numbers</h1>
          <p className="text-muted text-sm mt-1">{numbers.length} in catalogue. Tap digits to highlight the special part.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          Add number
        </button>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search digits"
        className="mt-5 w-full h-11 rounded-xl border border-line px-3"
        inputMode="numeric"
      />
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}

      {editing && (
        <div className="card-surface p-4 sm:p-5 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Digits"
            value={form.digits}
            onChange={(v) => setForm({ ...form, digits: v, highlights: v.replace(/\D/g, "").length === 10 ? form.highlights : [] })}
          />
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
          <HighlightEditor
            digits={form.digits}
            pattern={form.pattern}
            highlights={form.highlights}
            onChange={(highlights) => setForm({ ...form, highlights })}
          />
          <label className="flex items-center gap-2 text-sm min-h-11">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm min-h-11">
            <input type="checkbox" checked={form.offer} onChange={(e) => setForm({ ...form, offer: e.target.checked })} /> Offer
          </label>
          <label className="flex items-center gap-2 text-sm min-h-11">
            <input type="checkbox" checked={form.prebook} onChange={(e) => setForm({ ...form, prebook: e.target.checked })} /> Prebook
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2">
            <button onClick={submit} className="btn-primary w-full sm:w-auto">
              Save number
            </button>
            <button onClick={() => setEditing(null)} className="h-11 px-4 rounded-xl border border-line w-full sm:w-auto">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {filtered.slice(0, 80).map((item) => (
          <article key={item.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-xl number-digits leading-tight">
                  <PatternHighlight pattern={item.pattern} digits={item.digits} highlights={item.highlights} />
                </p>
                <p className="text-xs text-muted mt-1">
                  {item.category} · {item.status}
                </p>
              </div>
              <p className="text-sm font-semibold text-azure shrink-0">{inr(item.price)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={item.checkout}
                onChange={(e) => save({ numbers: numbers.map((n) => (n.id === item.id ? { ...n, checkout: e.target.value as CheckoutMode } : n)) })}
                className="h-10 rounded-lg border border-line px-2 bg-white text-sm"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="razorpay">Razorpay</option>
              </select>
              <select
                value={item.status}
                onChange={(e) => save({ numbers: numbers.map((n) => (n.id === item.id ? { ...n, status: e.target.value as NumberStatus } : n)) })}
                className="h-10 rounded-lg border border-line px-2 bg-white text-sm capitalize"
              >
                <option value="live">Live</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openEdit(item)} className="flex-1 h-10 rounded-xl border border-line text-sm font-semibold text-azure">
                Edit
              </button>
              <button onClick={() => persist(numbers.filter((n) => n.id !== item.id))} className="flex-1 h-10 rounded-xl border border-line text-sm font-semibold text-danger">
                Delete
              </button>
            </div>
          </article>
        ))}
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
