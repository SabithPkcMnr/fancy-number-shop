"use client";

import { useState } from "react";
import { PatternHighlight } from "@/components/pattern-highlight";
import { applyImport, applyNewSellers, downloadNumberTemplate, downloadNumbersSheet, numbersSheetFilename, parseNumberSheet, workbookFromFile, type ImportRow } from "@/lib/excel-numbers";
import { inr } from "@/lib/site";
import { sellerById } from "@/lib/sellers";
import type { Seller, VipNumber } from "@/lib/types";

export function BulkNumberUpload({
  numbers,
  exportNumbers,
  exportLabel,
  sellers,
  onApply,
}: {
  numbers: VipNumber[];
  exportNumbers: VipNumber[];
  exportLabel: string;
  sellers: Seller[];
  onApply: (nextNumbers: VipNumber[], nextSellers: Seller[]) => Promise<boolean>;
}) {
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setNote("");
    try {
      const json = await workbookFromFile(file);
      const parsed = parseNumberSheet(json, numbers, sellers);
      setRows(parsed);
      if (!parsed.length) setNote("No number rows found in that sheet.");
    } catch {
      setNote("Could not read that Excel file. Use the sample template.");
      setRows(null);
    }
  }

  const ready = rows?.filter((row) => !row.errors.length) ?? [];
  const blocked = rows?.filter((row) => row.errors.length) ?? [];

  return (
    <section className="card-surface p-4 sm:p-5 mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Bulk Excel</h2>
          <p className="text-xs text-muted mt-1">Upload a sheet to add or update numbers. Download the current filter, in-house stock, or the full catalogue.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-10 px-4 rounded-xl border border-line text-sm font-semibold"
            onClick={() => downloadNumberTemplate(numbers[0], sellers)}
          >
            Download template
          </button>
          <button
            type="button"
            className="h-10 px-4 rounded-xl border border-line text-sm font-semibold disabled:opacity-40"
            disabled={!exportNumbers.length}
            onClick={() => downloadNumbersSheet(exportNumbers, sellers, numbersSheetFilename(exportLabel))}
          >
            Download shown ({exportNumbers.length})
          </button>
          <button
            type="button"
            className="h-10 px-4 rounded-xl border border-line text-sm font-semibold disabled:opacity-40"
            onClick={() => {
              const own = numbers.filter((item) => sellerById(sellers, item.sellerId).isOwn);
              if (!own.length) return;
              downloadNumbersSheet(own, sellers, numbersSheetFilename("in-house"));
            }}
          >
            Download in-house
          </button>
          <button
            type="button"
            className="h-10 px-4 rounded-xl border border-line text-sm font-semibold disabled:opacity-40"
            disabled={!numbers.length}
            onClick={() => downloadNumbersSheet(numbers, sellers, numbersSheetFilename("all"))}
          >
            Download all
          </button>
          <label className="h-10 px-4 rounded-xl bg-navy text-white text-sm font-semibold grid place-items-center cursor-pointer">
            Upload Excel
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </div>
      </div>
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}
      {rows && (
        <div className="mt-4">
          <p className="text-sm text-muted">
            {ready.length} ready to save · {blocked.length} with errors · {ready.filter((row) => row.action === "create").length} new ·{" "}
            {ready.filter((row) => row.action === "update").length} updates
          </p>
          <div className="mt-3 max-h-[28rem] overflow-auto space-y-2">
            {rows.slice(0, 80).map((row) => (
              <article key={row.number.digits} className="rounded-xl border border-line bg-white p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-display text-lg number-digits">
                    <PatternHighlight pattern={row.number.pattern} digits={row.number.digits} highlights={row.number.highlights} />
                  </p>
                  <p className="text-sm font-semibold text-azure shrink-0">{inr(row.number.price)}</p>
                </div>
                <p className="text-xs text-muted mt-1">
                  {row.sellerName} · {row.number.visibility} · {row.number.status} · {row.action}
                  {row.number.dealerPrice ? ` · dealer ${inr(row.number.dealerPrice)}` : ""}
                </p>
                {row.errors.map((item) => (
                  <p key={item} className="text-xs text-danger mt-1">
                    {item}
                  </p>
                ))}
                {row.warnings.map((item) => (
                  <p key={item} className="text-xs text-muted mt-1">
                    {item}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!ready.length || busy}
              className="btn-primary"
              onClick={async () => {
                setBusy(true);
                const ok = await onApply(applyImport(numbers, rows), applyNewSellers(sellers, rows));
                setBusy(false);
                setNote(ok ? `Published ${ready.length} numbers.` : "Save failed.");
                if (ok) setRows(null);
              }}
            >
              {busy ? "Publishing…" : `Publish ${ready.length} numbers`}
            </button>
            <button type="button" className="h-11 px-4 rounded-xl border border-line" onClick={() => setRows(null)}>
              Cancel preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
