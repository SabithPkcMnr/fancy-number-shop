"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NumberGrid } from "@/components/number-card";
import { SearchPanel } from "@/components/search-panel";
import { categories } from "@/lib/catalog";
import { searchNumbers, type SearchQuery } from "@/lib/search";
import { useStore } from "@/lib/store";

export default function NumbersBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const { numbers } = useStore();
  const key = params.toString();
  const query = Object.fromEntries(new URLSearchParams(key)) as SearchQuery;
  const results = useMemo(
    () => searchNumbers(Object.fromEntries(new URLSearchParams(key)) as SearchQuery, numbers),
    [key, numbers],
  );

  function set(nextKey: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(nextKey, value);
    else next.delete(nextKey);
    router.push(`/numbers?${next.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <p className="text-xs font-bold tracking-[0.22em] uppercase text-azure">The collection</p>
      <h1 className="font-display text-3xl sm:text-5xl mt-2">VIP Numbers</h1>
      <p className="text-muted mt-3 max-w-2xl text-sm sm:text-base">
        {results.length} numbers live now. Start with a basic search, then open the full number filter when you need start, end, or digit rules.
      </p>

      <div className="mt-5 sm:mt-8">
        <SearchPanel initialQuery={query} />
      </div>

      <div className="relative mt-6 sm:mt-8">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button
          onClick={() => set("category", "")}
          className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold ${
            !query.category ? "bg-azure text-white" : "bg-sky/80 text-ink"
          }`}
        >
          All · {numbers.length}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => set("category", cat.slug)}
            className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold ${
              query.category === cat.slug ? "bg-azure text-white" : "bg-sky/80 text-ink"
            }`}
          >
            {cat.name.replace(/ Number$/, "")}
          </button>
        ))}
          <span className="w-2 shrink-0 sm:hidden" aria-hidden />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ivory sm:hidden" />
      </div>

      <div className="mt-4">
        <select
          value={query.sort ?? "featured"}
          onChange={(e) => set("sort", e.target.value)}
          className="h-11 w-full sm:w-56 rounded-xl border border-line px-3 bg-white text-sm"
          aria-label="Sort numbers"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price · low to high</option>
          <option value="price-desc">Price · high to low</option>
          <option value="discount">Highest discount</option>
        </select>
      </div>

      <div className="mt-6 sm:mt-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block space-y-8">
          <FilterBlock title="Category">
            <ul className="space-y-1 text-sm">
              <li>
                <button onClick={() => set("category", "")} className={!query.category ? "text-azure font-semibold" : "text-muted"}>
                  All · {numbers.length}
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => set("category", cat.slug)}
                    className={`w-full text-left flex justify-between gap-3 py-1 ${
                      query.category === cat.slug ? "text-azure font-semibold" : "text-ink/80 hover:text-azure"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-muted">{numbers.filter((item) => item.categories.includes(cat.slug)).length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </FilterBlock>
          <FilterBlock title="Pattern / digits">
            <input placeholder="Must contain" defaultValue={query.must ?? ""} onBlur={(e) => set("must", e.target.value)} className="w-full h-11 rounded-xl border border-line px-3 text-sm mb-2" />
            <input placeholder="Not contain · 2,4,8" defaultValue={query.not ?? ""} onBlur={(e) => set("not", e.target.value)} className="w-full h-11 rounded-xl border border-line px-3 text-sm" />
          </FilterBlock>
          <FilterBlock title="Quick picks">
            <div className="flex flex-wrap gap-2">
              {[
                ["786", { q: "786" }],
                ["999", { q: "999" }],
                ["888", { q: "888" }],
                ["0000 ends", { end: "0000" }],
                ["Without 2 4 8", { not: "2,4,8" }],
              ].map(([label, extra]) => (
                <button
                  key={label as string}
                  onClick={() => {
                    const next = new URLSearchParams();
                    Object.entries(extra as Record<string, string>).forEach(([k, v]) => next.set(k, v));
                    router.push(`/numbers?${next.toString()}`);
                  }}
                  className="px-3 py-1.5 text-xs rounded-full border border-line hover:border-azure hover:text-azure"
                >
                  {label as string}
                </button>
              ))}
            </div>
          </FilterBlock>
          <button onClick={() => router.push("/numbers")} className="text-sm text-muted">
            Reset filters
          </button>
        </aside>

        <div>
          <NumberGrid items={results} />
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">{title}</h2>
      {children}
    </div>
  );
}
