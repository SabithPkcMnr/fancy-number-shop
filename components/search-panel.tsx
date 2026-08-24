"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Hash, IndianRupee, Search, Users } from "lucide-react";
import { toSearchParams, type SearchQuery } from "@/lib/search";

const digitTabs = ["Global Search", "Premium Search", "Advance Search"] as const;
const popular = ["786", "0000", "1111", "9999", "1234", "7777"];

type Props = {
  compact?: boolean;
  onSearch?: () => void;
};

export function SearchPanel({ compact, onSearch }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"digits" | "price" | "family">("digits");
  const [digitTab, setDigitTab] = useState<(typeof digitTabs)[number]>("Premium Search");
  const [form, setForm] = useState<SearchQuery>({});

  function set(key: keyof SearchQuery, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function go(extra: SearchQuery = {}) {
    const query = { ...form, ...extra };
    router.push(`/numbers?${toSearchParams(query)}`);
    onSearch?.();
  }

  return (
    <div
      className={
        compact
          ? ""
          : "relative overflow-hidden rounded-[28px] border border-teal-100 bg-paper shadow-[0_24px_60px_rgba(8,47,59,0.14)] p-4 sm:p-8"
      }
    >
      {!compact && (
        <>
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-azure via-teal-400 to-gold" />
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky/70 blur-2xl pointer-events-none" />
        </>
      )}

      <div className="relative grid grid-cols-3 gap-2">
        {(
          [
            ["digits", "Digits", "By digits", Hash],
            ["price", "Price", "By price", IndianRupee],
            ["family", "Family", "Family pack", Users],
          ] as const
        ).map(([id, short, label, Icon]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`h-12 sm:h-14 rounded-2xl text-[12px] sm:text-sm font-bold transition-all ${
              mode === id
                ? "bg-azure text-white shadow-lg shadow-azure/25"
                : "bg-sky/90 text-ink hover:bg-sky"
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
              <Icon size={15} />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </span>
          </button>
        ))}
      </div>

      {mode === "digits" && (
        <div className="relative mt-5 sm:mt-6">
          <div className="flex gap-1 p-1 rounded-2xl bg-slate-100/90 mb-5">
            {digitTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setDigitTab(tab)}
                className={`flex-1 px-2 sm:px-3 py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold ${
                  digitTab === tab ? "bg-paper text-azure shadow-sm" : "text-muted"
                }`}
              >
                {tab.replace(" Search", "")}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {popular.map((chip) => (
              <button
                key={chip}
                onClick={() => go({ q: chip, anywhere: chip })}
                className="h-8 px-3 rounded-full border border-teal-100 bg-sky/50 text-[12px] font-semibold text-azure hover:bg-azure hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {digitTab === "Global Search" && (
            <div className="grid sm:grid-cols-[1fr_auto] gap-3">
              <Field label="Enter digits" value={form.q ?? ""} onChange={(v) => set("q", v)} onEnter={() => go()} />
              <SearchBtn onClick={() => go()} />
            </div>
          )}

          {digitTab === "Premium Search" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Start with" value={form.start ?? ""} onChange={(v) => set("start", v)} />
              <Field label="Anywhere" value={form.anywhere ?? ""} onChange={(v) => set("anywhere", v)} />
              <Field label="End with" value={form.end ?? ""} onChange={(v) => set("end", v)} />
              <div className="sm:col-span-3">
                <SearchBtn onClick={() => go()} />
              </div>
            </div>
          )}

          {digitTab === "Advance Search" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field label="Start with" value={form.start ?? ""} onChange={(v) => set("start", v)} />
              <Field label="Anywhere" value={form.anywhere ?? ""} onChange={(v) => set("anywhere", v)} />
              <Field label="End with" value={form.end ?? ""} onChange={(v) => set("end", v)} />
              <Field label="Must contain" hint="1,5,9" value={form.must ?? ""} onChange={(v) => set("must", v)} />
              <Field label="Not contain" hint="2,4,8" value={form.not ?? ""} onChange={(v) => set("not", v)} />
              <Field label="Total" hint="41" value={form.total ?? ""} onChange={(v) => set("total", v)} />
              <Field label="Sum" hint="single 5" value={form.sum ?? ""} onChange={(v) => set("sum", v)} />
              <SearchBtn onClick={() => go()} />
            </div>
          )}
        </div>
      )}

      {mode === "price" && (
        <div className="relative mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Minimum price" value={form.min ?? ""} onChange={(v) => set("min", v)} />
          <Field label="Maximum price" value={form.max ?? ""} onChange={(v) => set("max", v)} />
          <SearchBtn onClick={() => go()} />
        </div>
      )}

      {mode === "family" && (
        <div className="relative mt-5 sm:mt-6">
          <p className="text-sm text-muted mb-4">How many similar numbers do you want for family or business?</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:max-w-md">
            <Field label="Quantity" value={form.family ?? ""} onChange={(v) => set("family", v)} />
            <SearchBtn onClick={() => go({ family: form.family || "3" })} />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  onEnter?: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder={hint ?? label}
        inputMode="numeric"
        className="w-full h-12 rounded-2xl border border-line bg-slate-50 px-3.5 text-sm focus:bg-white"
      />
    </label>
  );
}

function SearchBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-12 px-6 rounded-2xl bg-gradient-to-r from-azure to-teal-600 text-white text-sm font-bold hover:from-azure-dark hover:to-azure transition-colors w-full sm:w-auto sm:min-w-36 inline-flex items-center justify-center gap-2 sm:self-end shadow-lg shadow-azure/20"
    >
      <Search size={16} />
      Search
    </button>
  );
}
