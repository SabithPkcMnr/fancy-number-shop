import { getPublicPayload } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getPublicPayload();
  return Response.json(payload);
}
