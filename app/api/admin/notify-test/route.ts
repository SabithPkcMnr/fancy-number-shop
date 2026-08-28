import { isAdminRequest } from "@/lib/auth";
import { notifyAdmins } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await notifyAdmins({
    title: "Fancy Number Shop",
    message: "Browser notifications are working. You will see alerts for payments, bookings, and new inquiries.",
    url: "/admin",
  });
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
