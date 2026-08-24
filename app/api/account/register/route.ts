import { getStore, nextId, updateStore } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; phone?: string; email?: string };
  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").replace(/\D/g, "");
  const email = (body.email ?? "").trim();
  if (!name || phone.length < 10) {
    return Response.json({ error: "Enter your name and a valid 10-digit mobile." }, { status: 400 });
  }

  const store = await getStore();
  const existing = store.users.find((user) => user.phone === phone);
  if (existing) {
    return Response.json({ ok: true, user: existing });
  }

  const user = {
    id: nextId("usr"),
    name,
    phone,
    email,
    createdAt: new Date().toISOString(),
  };
  await updateStore({ users: [user, ...store.users] });
  return Response.json({ ok: true, user });
}
