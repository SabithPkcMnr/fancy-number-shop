"use client";

import type { InquiryStatus } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminInquiriesPage() {
  const { data, save } = useAdminData();
  if (!data) return <p className="text-muted">Loading inquiries…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">Inquiries</h1>
      <p className="text-muted text-sm mt-1">Contact form and choice-number requests.</p>
      <div className="mt-6 space-y-4">
        {data.inquiries.map((item) => (
          <article key={item.id} className="card-surface p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {item.name} · {item.phone}
                </p>
                <p className="text-xs uppercase tracking-wider text-muted mt-1">{item.kind}</p>
              </div>
              <select
                value={item.status}
                onChange={(e) =>
                  save({
                    inquiries: data.inquiries.map((row) => (row.id === item.id ? { ...row, status: e.target.value as InquiryStatus } : row)),
                  })
                }
                className="h-9 rounded-lg border border-line px-2 bg-white text-sm"
              >
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="mt-3 text-sm">{item.message}</p>
            <p className="mt-2 text-xs text-muted">{new Date(item.createdAt).toLocaleString("en-IN")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
