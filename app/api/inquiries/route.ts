import { getStore, nextId, updateStore } from "@/lib/db";
import { notifyAdmins } from "@/lib/notify";
import type { Inquiry } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    kind?: Inquiry["kind"];
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };
  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").replace(/\D/g, "");
  const message = (body.message ?? "").trim();
  if (!name || phone.length < 10 || !message) {
    return Response.json({ error: "Please fill name, mobile, and message." }, { status: 400 });
  }

  const store = await getStore();
  const inquiry: Inquiry = {
    id: nextId("inq"),
    kind: body.kind === "choice" ? "choice" : "contact",
    name,
    phone,
    email: body.email,
    message,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await updateStore({ inquiries: [inquiry, ...store.inquiries] });
  await notifyAdmins({
    title: "New inquiry",
    message: `${name} · ${phone} · ${message.slice(0, 80)}`,
    url: "/admin/inquiries",
  });
  return Response.json({ ok: true });
}
