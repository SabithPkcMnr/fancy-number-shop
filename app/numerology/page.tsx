"use client";

import { useMemo, useState } from "react";
import { NumberGrid } from "@/components/number-card";
import { destinyMeanings, getNumerology } from "@/lib/numerology";
import { useStore } from "@/lib/store";

export default function NumerologyPage() {
  const { numbers } = useStore();
  const [digits, setDigits] = useState("");
  const [sum, setSum] = useState("8");
  const [without248, setWithout248] = useState(true);

  const reading = useMemo(() => {
    const clean = digits.replace(/\D/g, "");
    if (clean.length < 10) return null;
    return getNumerology(clean);
  }, [digits]);

  const matches = numbers.filter((item) => {
    const n = getNumerology(item.digits);
    if (n.destiny !== Number(sum)) return false;
    if (without248 && /[248]/.test(item.digits)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">By the numbers</p>
      <h1 className="font-display text-5xl mt-2">Numerology</h1>
      <p className="text-muted mt-3 max-w-2xl">
        Enter a number for a full reduction, or choose a destiny digit and we will show live stock that matches.
      </p>

      <div className="mt-10 grid lg:grid-cols-2 gap-8">
        <form className="card-surface p-8" onSubmit={(e) => e.preventDefault()}>
          <label className="text-xs font-bold uppercase tracking-wider text-muted">Read a number</label>
          <input
            value={digits}
            onChange={(e) => setDigits(e.target.value)}
            placeholder="10-digit mobile"
            className="mt-2 w-full h-12 rounded-xl border border-line px-3"
          />
          {reading ? (
            <div className="mt-6">
              <p className="font-display text-4xl">{reading.display}</p>
              <p className="mt-3 text-azure font-semibold uppercase tracking-wider text-sm">
                Destiny {reading.destiny} · {destinyMeanings[reading.destiny].title}
              </p>
              <p className="mt-3 text-muted">{destinyMeanings[reading.destiny].text}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Type ten digits to see total, compound, and destiny.</p>
          )}
        </form>

        <div className="rounded-2xl bg-sky/70 border border-line p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Shop by destiny</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => setSum(String(n))}
                className={`h-11 w-11 rounded-xl ${sum === String(n) ? "bg-azure text-white" : "bg-paper"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={without248} onChange={(e) => setWithout248(e.target.checked)} />
            Without 2, 4 & 8
          </label>
          <p className="mt-4 font-display text-3xl">{destinyMeanings[Number(sum)].title}</p>
          <p className="mt-2 text-muted">{destinyMeanings[Number(sum)].text}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-3xl mb-8">Matching numbers</h2>
        <NumberGrid items={matches.slice(0, 16)} />
      </div>
    </div>
  );
}
