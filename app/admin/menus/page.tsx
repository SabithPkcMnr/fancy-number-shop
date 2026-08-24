"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminMenusPage() {
  const { data, save } = useAdminData();
  const [note, setNote] = useState("");
  if (!data) return <p className="text-muted">Loading menus…</p>;

  function update(id: string, patch: Partial<MenuItem>) {
    save({ menus: data!.menus.map((item) => (item.id === id ? { ...item, ...patch } : item)) }).then((ok) => setNote(ok ? "Saved." : "Save failed."));
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Menus</h1>
          <p className="text-muted text-sm mt-1">Control header navigation labels, links, order, and visibility.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            save({
              menus: [
                ...data.menus,
                {
                  id: `menu-${Date.now()}`,
                  href: "/numbers",
                  label: "New link",
                  placement: "header",
                  order: data.menus.length,
                  visible: true,
                },
              ],
            })
          }
        >
          Add menu item
        </button>
      </div>
      {note && <p className="mt-3 text-sm text-azure">{note}</p>}
      <div className="mt-6 overflow-auto card-surface">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Label</th>
              <th className="p-3">Link</th>
              <th className="p-3">Order</th>
              <th className="p-3">Visible</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.menus
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="p-3">
                    <input value={item.label} onChange={(e) => update(item.id, { label: e.target.value })} className="h-10 rounded-lg border border-line px-2 w-40" />
                  </td>
                  <td className="p-3">
                    <input value={item.href} onChange={(e) => update(item.id, { href: e.target.value })} className="h-10 rounded-lg border border-line px-2 w-48" />
                  </td>
                  <td className="p-3">
                    <input type="number" value={item.order} onChange={(e) => update(item.id, { order: Number(e.target.value) })} className="h-10 rounded-lg border border-line px-2 w-20" />
                  </td>
                  <td className="p-3">
                    <input type="checkbox" checked={item.visible} onChange={(e) => update(item.id, { visible: e.target.checked })} />
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-danger" onClick={() => save({ menus: data.menus.filter((menu) => menu.id !== item.id) })}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
