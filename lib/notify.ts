import { getStore } from "@/lib/db";

export async function notifyAdmins(event: { title: string; message: string; url?: string }) {
  try {
    const store = await getStore();
    const appId = process.env.ONESIGNAL_APP_ID || store.settings.onesignalAppId;
    const restKey = process.env.ONESIGNAL_REST_API_KEY || store.settings.onesignalRestApiKey;
    if (!appId || !restKey) return { ok: false, error: "OneSignal is not configured." };

    const origin = store.settings.domain || "";
    const path = event.url || "/admin/orders";
    const url = path.startsWith("http") ? path : `${origin}${path}`;

    const res = await fetch("https://api.onesignal.com/notifications?c=push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Key ${restKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        target_channel: "push",
        headings: { en: event.title },
        contents: { en: event.message },
        url,
        filters: [{ field: "tag", key: "role", relation: "=", value: "admin" }],
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; errors?: unknown };
    if (!res.ok) return { ok: false, error: "OneSignal rejected the notification.", detail: body };
    return { ok: true, id: body.id };
  } catch {
    return { ok: false, error: "Could not reach OneSignal." };
  }
}
