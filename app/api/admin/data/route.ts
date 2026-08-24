import { isAdminRequest } from "@/lib/auth";
import { getStore, updateStore } from "@/lib/db";
import type { AppData } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await getStore();
  return Response.json(store);
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const patch = (await request.json()) as Partial<AppData>;
  const next = await updateStore(patch);
  return Response.json(next);
}
