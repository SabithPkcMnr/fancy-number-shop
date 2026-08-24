import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const ok = await isAdminRequest();
  return Response.json({ ok });
}
