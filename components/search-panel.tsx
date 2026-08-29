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
  const [digitTab, setDigitTab] = useState<(typeof digitTabs)[number]>("Global Search");
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
          : "relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-teal-100 bg-paper shadow-[0_12px_32px_rgba(8,47,59,0.1)] sm:shadow-[0_24px_60px_rgba(8,47,59,0.14)] p-3 sm:p-8"
      }
    >
      {!compact && (
        <>
          <div className="absolute inset-x-0 top-0 hidden sm:block h-1.5 bg-gradient-to-r from-azure via-teal-400 to-gold" />
          <div className="absolute -right-16 -top-16 hidden sm:block h-40 w-40 rounded-full bg-sky/70 blur-2xl pointer-events-none" />
        </>
      )}

      <div className="relative grid grid-cols-3 gap-1.5 sm:gap-2">
        {(
          [
            ["digits", "Digits", "By digits", Hash],
            ["price", "Price", "By price", IndianRupee],
            ["family", "Family", "Family pack", Users],
          ] as const
        ).map(([id, short, label, Icon]) => (
          <button
            type="button"
            key={id}
            onClick={() => setMode(id)}
            className={`h-10 sm:h-14 rounded-xl sm:rounded-2xl text-[12px] sm:text-sm font-bold transition-all ${
              mode === id
                ? "bg-azure text-white shadow-sm sm:shadow-lg sm:shadow-azure/25"
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
        <div className="relative mt-3 sm:mt-6">
          <div className="hidden sm:flex gap-1 p-1 rounded-2xl bg-slate-100/90 mb-5">
            {digitTabs.map((tab) => (
              <button
                type="button"
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

          <div className="hidden sm:flex flex-wrap gap-2 mb-4">
            {popular.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => go({ q: chip, anywhere: chip })}
                className="h-8 px-3 rounded-full border border-teal-100 bg-sky/50 text-[12px] font-semibold text-azure hover:bg-azure hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="sm:hidden">
            <div className="flex gap-2">
              <input
                value={form.q ?? ""}
                onChange={(e) => set("q", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go({ q: form.q })}
                placeholder="Search digits"
                inputMode="numeric"
                aria-label="Search digits"
                className="min-w-0 flex-1 h-10 rounded-xl border border-line bg-slate-50 px-3 text-sm focus:bg-white"
              />
              <SearchBtn onClick={() => go({ q: form.q })} />
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer py-1.5 text-xs font-semibold text-azure">More filters</summary>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Field label="Start with" value={form.start ?? ""} onChange={(v) => set("start", v)} />
                <Field label="End with" value={form.end ?? ""} onChange={(v) => set("end", v)} />
                <Field label="Anywhere" value={form.anywhere ?? ""} onChange={(v) => set("anywhere", v)} />
                <Field label="Must contain" hint="1,5,9" value={form.must ?? ""} onChange={(v) => set("must", v)} />
                <Field label="Not contain" hint="2,4,8" value={form.not ?? ""} onChange={(v) => set("not", v)} />
                <Field label="Sum" hint="single 5" value={form.sum ?? ""} onChange={(v) => set("sum", v)} />
                <div className="col-span-2">
                  <SearchBtn onClick={() => go()} />
                </div>
              </div>
            </details>
          </div>

          <div className="hidden sm:block">
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
        </div>
      )}

      {mode === "price" && (
        <div className="relative mt-3 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <Field label="Min price" value={form.min ?? ""} onChange={(v) => set("min", v)} />
          <Field label="Max price" value={form.max ?? ""} onChange={(v) => set("max", v)} />
          <div className="col-span-2 sm:col-span-1">
            <SearchBtn onClick={() => go()} />
          </div>
        </div>
      )}

      {mode === "family" && (
        <div className="relative mt-3 sm:mt-6">
          <p className="hidden sm:block text-sm text-muted mb-4">How many similar numbers do you want for family or business?</p>
          <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3 sm:max-w-md">
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
    <label className="block min-w-0">
      <span className="mb-1 sm:mb-1.5 block text-[11px] sm:text-xs font-semibold text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder={hint ?? label}
        inputMode="numeric"
        className="w-full h-10 sm:h-12 rounded-xl sm:rounded-2xl border border-line bg-slate-50 px-3 sm:px-3.5 text-sm focus:bg-white"
      />
    </label>
  );
}

function SearchBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-azure sm:bg-gradient-to-r sm:from-azure sm:to-teal-600 text-white text-sm font-bold hover:bg-azure-dark sm:hover:from-azure-dark sm:hover:to-azure transition-colors shrink-0 w-auto min-w-[5.5rem] sm:min-w-36 inline-flex items-center justify-center gap-2 sm:self-end shadow-sm sm:shadow-lg sm:shadow-azure/20"
    >
      <Search size={16} />
      Search
    </button>
  );
}
