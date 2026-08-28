import { getStore } from "@/lib/db";
import { fulfillPaidOrder, razorpayKeys, signaturesMatch, webhookSignature } from "@/lib/payments";

export const dynamic = "force-dynamic";

type RazorpayWebhook = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        status?: string;
        notes?: { storeOrderId?: string };
      };
    };
    order?: {
      entity?: {
        id?: string;
        receipt?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const store = await getStore();
  const { webhookSecret } = razorpayKeys(store.settings);
  if (!webhookSecret) {
    return Response.json({ error: "Webhook secret is not configured." }, { status: 503 });
  }
  if (!signaturesMatch(webhookSignature(raw, webhookSecret), signature)) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(raw) as RazorpayWebhook;
  if (event.event !== "payment.captured" && event.event !== "order.paid") {
    return Response.json({ ok: true, ignored: event.event });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrder = event.payload?.order?.entity;
  const result = await fulfillPaidOrder({
    orderId: payment?.notes?.storeOrderId || razorpayOrder?.receipt,
    razorpayOrderId: payment?.order_id || razorpayOrder?.id,
    razorpayPaymentId: payment?.id,
  });
  return Response.json({ ok: true, orderId: result?.orderId, confirmed: result?.confirmed ?? false });
}
