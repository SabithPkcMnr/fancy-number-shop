"use client";

import { inr } from "@/lib/site";
import type { OrderStatus } from "@/lib/types";
import { useAdminData } from "@/components/admin/admin-data";

export default function AdminOrdersPage() {
  const { data, save } = useAdminData();
  if (!data) return <p className="text-muted">Loading orders…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <p className="text-muted text-sm mt-1">Razorpay checkouts and WhatsApp buy requests land here.</p>
      <div className="mt-6 overflow-auto card-surface">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Numbers</th>
              <th className="p-3">Total</th>
              <th className="p-3">Pay</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order.id} className="border-t border-line align-top">
                <td className="p-3">
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                  {order.upc && <p className="text-xs text-azure mt-1">UPC {order.upc}</p>}
                </td>
                <td className="p-3">
                  <p>{order.customer.name}</p>
                  <p className="text-xs text-muted">{order.customer.phone}</p>
                </td>
                <td className="p-3 number-digits">{order.items.map((item) => item.pattern).join(", ")}</td>
                <td className="p-3">{inr(order.total)}</td>
                <td className="p-3 capitalize">{order.payment}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      save({
                        orders: data.orders.map((item) => (item.id === order.id ? { ...item, status: e.target.value as OrderStatus } : item)),
                      })
                    }
                    className="h-9 rounded-lg border border-line px-2 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
