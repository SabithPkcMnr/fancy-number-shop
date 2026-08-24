"use client";

import { useState } from "react";
import type { Slide } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminSlidesPage() {
  const { data, save } = useAdminData();
  const [note, setNote] = useState("");
  if (!data) return <p className="text-muted">Loading slides…</p>;

  function update(id: string, patch: Partial<Slide>) {
    save({ slides: data!.slides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)) }).then((ok) => setNote(ok ? "Saved." : "Save failed."));
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Homepage slides</h1>
          <p className="text-muted text-sm mt-1">These rotate on the homepage hero. Image URL is optional — a colour gradient is used if empty.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            save({
              slides: [
                ...data.slides,
                {
                  id: `slide-${Date.now()}`,
                  kicker: "New slide",
                  title: "Write a strong headline",
                  text: "A short supporting line for customers.",
                  ctaLabel: "Browse VIP numbers",
                  ctaHref: "/numbers",
                  image: "",
                  gradient: "from-teal-900 via-cyan-800 to-sky-700",
                  active: true,
                },
              ],
            })
          }
        >
          Add slide
        </button>
      </div>
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}
      <div className="mt-6 space-y-4">
        {data.slides.map((slide) => (
          <div key={slide.id} className="card-surface p-5 grid lg:grid-cols-2 gap-3">
            <Field label="Kicker" value={slide.kicker} onChange={(v) => update(slide.id, { kicker: v })} />
            <Field label="Title" value={slide.title} onChange={(v) => update(slide.id, { title: v })} />
            <Field label="Text" value={slide.text} onChange={(v) => update(slide.id, { text: v })} />
            <Field label="Button label" value={slide.ctaLabel} onChange={(v) => update(slide.id, { ctaLabel: v })} />
            <Field label="Button link" value={slide.ctaHref} onChange={(v) => update(slide.id, { ctaHref: v })} />
            <Field label="Image URL (optional)" value={slide.image} onChange={(v) => update(slide.id, { image: v })} />
            <Field label="Gradient classes" value={slide.gradient} onChange={(v) => update(slide.id, { gradient: v })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={slide.active} onChange={(e) => update(slide.id, { active: e.target.checked })} />
              Visible
            </label>
            <button className="text-danger text-sm" onClick={() => save({ slides: data.slides.filter((item) => item.id !== slide.id) })}>
              Delete slide
            </button>
          </div>
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
