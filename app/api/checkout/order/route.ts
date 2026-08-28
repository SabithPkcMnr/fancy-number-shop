import { findNumber, getStore, nextOrderId, updateStore } from "@/lib/db";
import { newConfirmToken, razorpayKeys } from "@/lib/payments";
import type { OrderItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    ids?: string[];
    customer?: { name?: string; phone?: string; email?: string; city?: string };
  };
  const ids = body.ids ?? [];
  const items: OrderItem[] = [];
  for (const id of ids) {
    const number = await findNumber(id);
    if (!number || number.status !== "live" || number.checkout !== "razorpay") continue;
    items.push({ id: number.id, digits: number.digits, pattern: number.pattern, price: number.price });
  }
  if (!items.length) {
    return Response.json({ error: "This number is not available for online payment." }, { status: 400 });
  }

  const name = body.customer?.name?.trim() || "";
  const phone = body.customer?.phone?.replace(/\D/g, "") || "";
  const email = body.customer?.email?.trim() || "";
  const city = body.customer?.city?.trim() || "";
  if (name.length < 2 || phone.length < 10 || !email.includes("@") || city.length < 2) {
    return Response.json({ error: "Enter your name, mobile, email, and city to continue." }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const store = await getStore();
  const { keyId, keySecret } = razorpayKeys(store.settings);
  if (!keyId || !keySecret) {
    return Response.json(
      { error: "Online payment is not configured yet. Use WhatsApp booking, or add Razorpay keys in Admin → Settings." },
      { status: 503 },
    );
  }

  const orderId = nextOrderId();
  const confirmToken = newConfirmToken();
  const customer = { name, phone, email, city };
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: total * 100,
      currency: "INR",
      receipt: orderId,
      payment_capture: 1,
      notes: { storeOrderId: orderId, number: items[0]?.digits ?? "" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json({ error: "Could not create Razorpay order.", detail }, { status: 502 });
  }

  const razorpayOrder = (await res.json()) as { id: string };
  await updateStore({
    orders: [
      {
        id: orderId,
        items,
        total,
        customer,
        payment: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        confirmToken,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...store.orders,
    ],
  });

  return Response.json({
    orderId,
    confirmToken,
    razorpayOrderId: razorpayOrder.id,
    amount: total * 100,
    currency: "INR",
    keyId,
    name: store.settings.name,
  });
}
