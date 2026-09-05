"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/catalog";
import { formatPattern, inr } from "@/lib/site";
import type { CategorySlug, CheckoutMode, DigitHighlight, NumberStatus, NumberVisibility, VipNumber } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";
import { BulkNumberUpload } from "@/components/admin/bulk-upload";
import { HighlightEditor } from "@/components/admin/highlight-editor";
import { PatternHighlight } from "@/components/pattern-highlight";
import { discountFrom, marginFrom } from "@/lib/pricing";
import { OWN_SELLER_ID, sellerById } from "@/lib/sellers";

const emptyForm = {
  digits: "",
  pattern: "",
  dealerPrice: "",
  sellingPrice: "4500",
  originalPrice: "5000",
  discount: "10",
  category: "unique" as CategorySlug,
  checkout: "whatsapp" as CheckoutMode,
  status: "live" as NumberStatus,
  visibility: "public" as NumberVisibility,
  sellerId: OWN_SELLER_ID,
  featured: false,
  offer: false,
  prebook: false,
  prebookDate: "",
  highlights: [] as DigitHighlight[],
};

export default function AdminNumbersPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading numbers…</p>}>
      <AdminNumbersInner />
    </Suspense>
  );
}

function AdminNumbersInner() {
  const { data, save } = useAdminData();
  const search = useSearchParams();
  const [q, setQ] = useState("");
  const [sellerFilter, setSellerFilter] = useState(search.get("seller") || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [note, setNote] = useState("");

  const numbers = data?.numbers ?? [];
  const sellers = data?.sellers ?? [];
  const filtered = useMemo(() => {
    const needle = q.replace(/\D/g, "");
    return numbers.filter((item) => {
      if (needle && !item.digits.includes(needle) && !item.pattern.includes(q)) return false;
      if (sellerFilter !== "all" && (item.sellerId || OWN_SELLER_ID) !== sellerFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (visibilityFilter !== "all" && (item.visibility || "public") !== visibilityFilter) return false;
      return true;
    });
  }, [numbers, q, sellerFilter, statusFilter, visibilityFilter]);

  function openNew() {
    setForm({ ...emptyForm, sellerId: sellerFilter !== "all" ? sellerFilter : OWN_SELLER_ID });
    setEditing("new");
    setNote("");
  }

  function openEdit(item: VipNumber) {
    setForm({
      digits: item.digits,
      pattern: item.pattern,
      dealerPrice: item.dealerPrice ? String(item.dealerPrice) : "",
      sellingPrice: String(item.price),
      originalPrice: String(item.originalPrice),
      discount: String(item.discount),
      category: item.category,
      checkout: item.checkout,
      status: item.status,
      visibility: item.visibility === "private" ? "private" : "public",
      sellerId: item.sellerId || OWN_SELLER_ID,
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
    const sellingPrice = Number(form.sellingPrice) || 0;
    const dealerPrice = Number(form.dealerPrice) || 0;
    const originalPrice = Number(form.originalPrice) || sellingPrice;
    const seller = sellerById(sellers, form.sellerId);
    if (sellingPrice <= 0) {
      setNote("Enter your selling price.");
      return;
    }
    if (!seller.isOwn && dealerPrice <= 0) {
      setNote("Dealer numbers need a dealer price and your selling price.");
      return;
    }
    if (dealerPrice > 0 && sellingPrice < dealerPrice) {
      setNote("Selling price should be at least the dealer price.");
      return;
    }
    const discount = discountFrom(originalPrice, sellingPrice);
    const existing = numbers.find((item) => item.id === (editing === "new" ? digits : editing));
    const item: VipNumber = {
      id: digits,
      digits,
      pattern: form.pattern.trim() || formatPattern(digits),
      originalPrice,
      discount,
      price: sellingPrice,
      dealerPrice: dealerPrice > 0 ? dealerPrice : undefined,
      category: form.category,
      categories: Array.from(new Set([form.category, ...(existing?.categories ?? [])])),
      checkout: form.checkout,
      status: form.status,
      visibility: form.visibility,
      sellerId: form.sellerId,
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

  const sellingPreview = Number(form.sellingPrice) || 0;
  const dealerPreview = Number(form.dealerPrice) || 0;
  const marginPreview = marginFrom(sellingPreview, dealerPreview || undefined);

  if (!data) return <p className="text-muted">Loading numbers…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Numbers</h1>
          <p className="text-muted text-sm mt-1">
            {filtered.length} shown · {numbers.length} in catalogue. Seller tags stay in admin only.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          Add number
        </button>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search digits"
          className="h-11 rounded-xl border border-line px-3"
          inputMode="numeric"
        />
        <select value={sellerFilter} onChange={(e) => setSellerFilter(e.target.value)} className="h-11 rounded-xl border border-line px-3 bg-white">
          <option value="all">All sellers</option>
          {sellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
              {seller.isOwn ? " (in-house)" : ""}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-xl border border-line px-3 bg-white">
          <option value="all">All statuses</option>
          <option value="live">Live</option>
          <option value="sold">Sold</option>
          <option value="hidden">Hidden</option>
        </select>
        <select value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value)} className="h-11 rounded-xl border border-line px-3 bg-white">
          <option value="all">Public & private</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <BulkNumberUpload
        numbers={numbers}
        exportNumbers={filtered}
        exportLabel={sellerFilter === "all" ? "all-filtered" : sellerById(sellers, sellerFilter).isOwn ? "in-house" : sellerById(sellers, sellerFilter).name}
        sellers={sellers}
        onApply={async (nextNumbers, nextSellers) => {
          const ok = await save({ numbers: nextNumbers, sellers: nextSellers });
          setNote(ok ? "Bulk catalogue published." : "Save failed.");
          return ok;
        }}
      />

      {note && <p className="mt-3 text-sm text-azure">{note}</p>}

      {editing && (
        <div className="card-surface p-4 sm:p-5 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Digits" value={form.digits} onChange={(v) => setForm({ ...form, digits: v, highlights: v.replace(/\D/g, "").length === 10 ? form.highlights : [] })} />
          <Field label="Display pattern" value={form.pattern} onChange={(v) => setForm({ ...form, pattern: v })} />
          <Field label="Dealer price" value={form.dealerPrice} onChange={(v) => setForm({ ...form, dealerPrice: v })} />
          <Field label="Selling price" value={form.sellingPrice} onChange={(v) => setForm({ ...form, sellingPrice: v })} />
          <Field label="Original / MRP (optional)" value={form.originalPrice} onChange={(v) => setForm({ ...form, originalPrice: v })} />
          <p className="text-xs text-muted sm:col-span-2 -mt-1">
            Dealer price is what the partner charges you. Selling price is what shoppers pay. MRP is only for the crossed-out figure.
            {marginPreview !== undefined && sellingPreview ? ` Margin ${inr(marginPreview)}.` : ""}
          </p>
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
            Seller
            <select value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name}
                  {seller.isOwn ? " (in-house)" : ""}
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
          <label className="text-sm">
            Visibility
            <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as NumberVisibility })} className="mt-1 w-full h-11 rounded-xl border border-line px-3 bg-white">
              <option value="public">Public on shop</option>
              <option value="private">Private (admin only)</option>
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
        {filtered.slice(0, 80).map((item) => {
          const seller = sellerById(sellers, item.sellerId);
          return (
            <article key={item.id} className="card-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-xl number-digits leading-tight">
                    <PatternHighlight pattern={item.pattern} digits={item.digits} highlights={item.highlights} />
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {seller.name} · {item.visibility ?? "public"} · {item.category} · {item.status}
                    {item.dealerPrice ? ` · dealer ${inr(item.dealerPrice)}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-azure">{inr(item.price)}</p>
                  {item.dealerPrice ? (
                    <p className="text-[11px] text-muted mt-0.5">margin {inr(item.price - item.dealerPrice)}</p>
                  ) : null}
                </div>
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
          );
        })}
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
