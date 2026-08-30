"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Hash, IndianRupee, Search, Users } from "lucide-react";
import { toSearchParams, type SearchQuery } from "@/lib/search";

const digitTabs = ["Global Search", "Premium Search", "Advance Search"] as const;
const popular = ["786", "0000", "1111", "9999", "1234", "7777"];
const digitPlaces = [
  ["start", "Start with"],
  ["anywhere", "Anywhere"],
  ["end", "End with"],
] as const;
type DigitPlace = (typeof digitPlaces)[number][0];

type Props = {
  compact?: boolean;
  onSearch?: () => void;
  initialQuery?: SearchQuery;
};

function hasFullNumberFilter(query?: SearchQuery) {
  if (!query) return false;
  return Boolean(query.must || query.not || query.total || query.sum);
}

function digitPlaceFromQuery(query?: SearchQuery): DigitPlace {
  if (query?.start && !query.anywhere && !query.q && !query.end) return "start";
  if (query?.end && !query.anywhere && !query.q && !query.start) return "end";
  return "anywhere";
}

function modeFromQuery(query?: SearchQuery): "digits" | "price" | "family" {
  if (query?.family) return "family";
  if (query?.min || query?.max) return "price";
  return "digits";
}

function digitTabFromQuery(query?: SearchQuery): (typeof digitTabs)[number] {
  if (query?.must || query?.not || query?.total || query?.sum) return "Advance Search";
  if (query?.start || query?.end || query?.anywhere) return "Premium Search";
  return "Global Search";
}

export function SearchPanel({ compact, onSearch, initialQuery }: Props) {
  const router = useRouter();
  const queryKey = toSearchParams(initialQuery ?? {});
  const [mode, setMode] = useState<"digits" | "price" | "family">(modeFromQuery(initialQuery));
  const [digitTab, setDigitTab] = useState<(typeof digitTabs)[number]>(digitTabFromQuery(initialQuery));
  const [form, setForm] = useState<SearchQuery>(initialQuery ?? {});
  const [fullFilter, setFullFilter] = useState(hasFullNumberFilter(initialQuery));
  const [digitPlace, setDigitPlace] = useState<DigitPlace>(digitPlaceFromQuery(initialQuery));

  useEffect(() => {
    const next = Object.fromEntries(new URLSearchParams(queryKey)) as SearchQuery;
    const place = digitPlaceFromQuery(next);
    setDigitPlace(place);
    setForm({
      ...next,
      q: next.q || (place === "start" ? next.start : place === "end" ? next.end : next.anywhere) || "",
    });
    setMode(modeFromQuery(next));
    setDigitTab(digitTabFromQuery(next));
    if (hasFullNumberFilter(next)) setFullFilter(true);
  }, [queryKey]);

  function set(key: keyof SearchQuery, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function go(extra: SearchQuery = {}) {
    const query = { ...form, ...extra };
    router.push(`/numbers?${toSearchParams(query)}`);
    onSearch?.();
  }

  function goBasic() {
    const digits = form.q ?? "";
    const extra: SearchQuery = { q: "" };
    if (digitPlace === "start") extra.start = digits;
    else if (digitPlace === "end") extra.end = digits;
    else extra.anywhere = digits;
    go(extra);
  }

  return (
    <div
      className={
        compact
          ? ""
          : "relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-amber-100 bg-paper shadow-[0_12px_32px_rgba(17,17,17,0.08)] sm:shadow-[0_24px_60px_rgba(17,17,17,0.12)] p-3.5 sm:p-8 min-w-0"
      }
    >
      {!compact && (
        <>
          <div className="absolute inset-x-0 top-0 hidden sm:block h-1.5 bg-gradient-to-r from-azure via-gold to-amber-300" />
          <div className="absolute -right-16 -top-16 hidden sm:block h-40 w-40 rounded-full bg-sky/70 blur-2xl pointer-events-none" />
        </>
      )}

      <div className="relative z-20 grid grid-cols-3 gap-2" role="tablist" aria-label="Search by">
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
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`relative z-20 flex h-10 sm:h-14 min-w-0 cursor-pointer items-center justify-center rounded-xl sm:rounded-2xl px-1 text-[11px] sm:text-sm font-bold transition-all ${
              mode === id
                ? "bg-azure text-white shadow-sm sm:shadow-lg sm:shadow-azure/25"
                : "bg-sky/90 text-ink hover:bg-sky"
            }`}
          >
            <span className="inline-flex min-w-0 items-center justify-center gap-1 sm:gap-2">
              <Icon size={14} className="shrink-0" />
              <span className="truncate sm:hidden">{short}</span>
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
                className="h-8 px-3 rounded-full border border-amber-100 bg-sky/50 text-[12px] font-semibold text-azure hover:bg-azure hover:text-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="sm:hidden">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-2">
              <input
                value={form.q ?? ""}
                onChange={(e) => set("q", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goBasic()}
                placeholder="Search digits"
                inputMode="numeric"
                aria-label="Search digits"
                className="min-w-0 h-11 rounded-xl border border-line bg-slate-50 px-3 text-sm focus:bg-white"
              />
              <SearchBtn onClick={goBasic} />
            </div>
            <div
              className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100/90 p-1"
              role="radiogroup"
              aria-label="Match digits"
            >
              {digitPlaces.map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  role="radio"
                  aria-checked={digitPlace === id}
                  onClick={() => setDigitPlace(id)}
                  className={`h-8 rounded-lg px-0.5 text-[10px] font-semibold whitespace-nowrap transition-colors ${
                    digitPlace === id ? "bg-azure text-white shadow-sm" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-1 flex w-full justify-center">
              <button
                type="button"
                aria-expanded={fullFilter}
                onClick={() => setFullFilter((open) => !open)}
                className="inline-flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-azure"
              >
                Full number filter
                <ChevronDown size={14} className={`transition-transform ${fullFilter ? "rotate-180" : ""}`} />
              </button>
            </div>
            {fullFilter && (
              <div className="mt-1 grid grid-cols-2 gap-2">
                <Field label="Must contain" hint="1,5,9" value={form.must ?? ""} onChange={(v) => set("must", v)} />
                <Field label="Not contain" hint="2,4,8" value={form.not ?? ""} onChange={(v) => set("not", v)} />
                <Field label="Sum" hint="single 5" value={form.sum ?? ""} onChange={(v) => set("sum", v)} />
                <Field label="Total" hint="41" value={form.total ?? ""} onChange={(v) => set("total", v)} />
                <div className="col-span-2">
                  <SearchBtn onClick={goBasic} />
                </div>
              </div>
            )}
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
        <div className="relative mt-3 sm:mt-6 grid grid-cols-[1fr_1fr_auto] gap-2 sm:gap-3">
          <Field label="Min price" value={form.min ?? ""} onChange={(v) => set("min", v)} />
          <Field label="Max price" value={form.max ?? ""} onChange={(v) => set("max", v)} />
          <SearchBtn onClick={() => go()} />
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
        className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border border-line bg-slate-50 px-3 sm:px-3.5 text-sm focus:bg-white"
      />
    </label>
  );
}

function SearchBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search"
      className="h-11 sm:h-12 w-11 sm:w-auto px-0 sm:px-6 rounded-xl sm:rounded-2xl bg-azure sm:bg-gradient-to-r sm:from-azure sm:to-orange-600 text-white text-sm font-bold hover:bg-azure-dark sm:hover:from-azure-dark sm:hover:to-azure transition-colors shrink-0 min-w-11 sm:min-w-36 inline-flex items-center justify-center gap-1.5 self-end shadow-sm sm:shadow-lg sm:shadow-azure/20"
    >
      <Search size={16} />
      <span className="hidden sm:inline">Search</span>
    </button>
  );
}
