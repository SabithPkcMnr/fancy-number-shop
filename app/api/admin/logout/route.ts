import { adminCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const store = await cookies();
  store.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 });
  return Response.json({ ok: true });
}
