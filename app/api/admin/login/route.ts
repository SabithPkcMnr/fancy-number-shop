import { adminCookie, createAdminToken, verifyAdminCredentials } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const ok = await verifyAdminCredentials(body.username ?? "", body.password ?? "");
  if (!ok) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }
  const store = await cookies();
  store.set(adminCookie.name, createAdminToken(), adminCookie.options);
  return Response.json({ ok: true });
}
