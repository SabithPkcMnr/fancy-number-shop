import { createHmac } from "crypto";
import { getStore, updateStore } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    mock?: boolean;
  };

  const store = await getStore();
  const order = store.orders.find((item) => item.id === body.orderId);
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  if (!body.mock) {
    const secret = process.env.RAZORPAY_KEY_SECRET || store.settings.razorpayKeySecret;
    const payload = `${body.razorpayOrderId}|${body.razorpayPaymentId}`;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (expected !== body.razorpaySignature) {
      return Response.json({ error: "Payment signature mismatch." }, { status: 400 });
    }
  }

  const upc = `${Math.floor(100000 + Math.random() * 900000)}`;
  const soldIds = new Set(order.items.map((item) => item.id));
  const next = {
    ...store,
    orders: store.orders.map((item) =>
      item.id === order.id
        ? {
            ...item,
            status: "paid" as const,
            paymentId: body.razorpayPaymentId || item.paymentId,
            upc,
          }
        : item,
    ),
    numbers: store.numbers.map((item) => (soldIds.has(item.id) ? { ...item, status: "sold" as const } : item)),
  };
  await updateStore(next);
  return Response.json({ ok: true, upc, number: order.items[0]?.pattern });
}
