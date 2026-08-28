"use client";

import { useState } from "react";
import { formatPattern } from "@/lib/site";
import {
  addHighlights,
  colorAt,
  findAllHighlights,
  HIGHLIGHT_COLORS,
  paintDigit,
  suggestHighlights,
  type DigitHighlight,
  type HighlightColor,
} from "@/lib/highlights";
import { PatternHighlight } from "@/components/pattern-highlight";

const swatches: { id: HighlightColor | "off"; label: string; className: string }[] = [
  { id: "gold", label: "Default", className: "bg-amber-500 text-white border-amber-600" },
  { id: "teal", label: "Teal", className: "bg-teal-700 text-white border-teal-800" },
  { id: "violet", label: "Violet", className: "bg-violet-600 text-white border-violet-700" },
  { id: "off", label: "Normal", className: "bg-white text-ink border-line" },
];

const paintClass: Record<HighlightColor, string> = {
  gold: "bg-amber-500 text-white border-amber-600",
  teal: "bg-teal-700 text-white border-teal-800",
  violet: "bg-violet-600 text-white border-violet-700",
};

export function HighlightEditor({
  digits,
  pattern,
  highlights,
  onChange,
}: {
  digits: string;
  pattern: string;
  highlights: DigitHighlight[];
  onChange: (next: DigitHighlight[]) => void;
}) {
  const clean = digits.replace(/\D/g, "").slice(0, 10);
  const display = pattern.trim() || formatPattern(clean);
  const [needle, setNeedle] = useState("");
  const [note, setNote] = useState("");
  const [brush, setBrush] = useState<HighlightColor | "off">("gold");

  function addNeedle() {
    if (brush === "off") {
      setNote("Pick a colour first, then highlight a digit group.");
      return;
    }
    const found = findAllHighlights(clean, needle, brush);
    if (!found.length) {
      setNote("That digit group is not in this number.");
      return;
    }
    onChange(addHighlights(highlights, found, clean.length, brush));
    setNeedle("");
    setNote(`Painted ${found.length === 1 ? "1 group" : `${found.length} groups`} in ${brush}.`);
  }

  return (
    <div className="sm:col-span-2 lg:col-span-4 rounded-2xl border border-line bg-slate-50 p-4">
      <p className="text-sm font-semibold">Highlight special digits</p>
      <p className="mt-1 text-xs text-muted leading-relaxed">
        Pick a colour, then tap digits. Use Default for the main pattern (like 88888) and Teal or Violet for
        other groups (like both 00s). Same colour can mark several areas.
      </p>

      <p className="mt-4 text-center font-display text-2xl sm:text-3xl number-digits">
        {clean.length === 10 ? (
          <PatternHighlight pattern={display} digits={clean} highlights={highlights} />
        ) : (
          <span className="text-muted text-base font-sans">Enter the 10-digit number first</span>
        )}
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {swatches.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setBrush(item.id)}
            className={`h-10 rounded-xl text-xs font-bold border ${item.className} ${
              brush === item.id ? "ring-2 ring-offset-2 ring-navy" : "opacity-80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, index) => {
          const digit = clean[index] ?? "·";
          const color = colorAt(index, highlights);
          return (
            <button
              key={index}
              type="button"
              disabled={clean.length !== 10}
              onClick={() => onChange(paintDigit(index, highlights, brush, 10))}
              className={`h-12 rounded-xl text-lg font-bold number-digits border disabled:opacity-40 ${
                color ? paintClass[color] : "bg-white border-line text-ink"
              }`}
            >
              {digit}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={needle}
          onChange={(e) => setNeedle(e.target.value)}
          inputMode="numeric"
          placeholder="e.g. 00 or 88888 or 786"
          className="h-11 flex-1 rounded-xl border border-line px-3 bg-white"
        />
        <button type="button" onClick={addNeedle} className="h-11 px-4 rounded-xl bg-navy text-white text-sm font-semibold">
          Highlight this
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(suggestHighlights(clean))}
          className="h-10 px-3 rounded-xl border border-line bg-white text-sm font-semibold"
        >
          Suggest
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="h-10 px-3 rounded-xl border border-line bg-white text-sm font-semibold"
        >
          Clear highlights
        </button>
      </div>
      {note && <p className="mt-2 text-xs text-azure">{note}</p>}
      <p className="mt-2 text-[11px] text-muted">Colours: {HIGHLIGHT_COLORS.join(", ")}. Normal digits stay black.</p>
    </div>
  );
}
