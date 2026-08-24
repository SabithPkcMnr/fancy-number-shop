"use client";

import { useAdminData } from "@/components/admin/admin-data";

export default function AdminUsersPage() {
  const { data, save } = useAdminData();
  if (!data) return <p className="text-muted">Loading users…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">Registered users</h1>
      <p className="text-muted text-sm mt-1">{data.users.length} accounts from the website login / register form.</p>
      <div className="mt-6 overflow-auto card-surface">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Joined</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.email || "—"}</td>
                <td className="p-3 text-muted">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="p-3 text-right">
                  <button className="text-danger" onClick={() => save({ users: data.users.filter((item) => item.id !== user.id) })}>
                    Remove
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
