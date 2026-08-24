import { findNumber, getStore, nextOrderId, updateStore } from "@/lib/db";
import type { OrderItem } from "@/lib/types";

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
    return Response.json({ error: "No payable numbers in this order." }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const store = await getStore();
  const keyId = process.env.RAZORPAY_KEY_ID || store.settings.razorpayKeyId;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || store.settings.razorpayKeySecret;
  const orderId = nextOrderId();
  const customer = {
    name: body.customer?.name?.trim() || "Guest",
    phone: body.customer?.phone?.replace(/\D/g, "") || "",
    email: body.customer?.email?.trim() || "",
    city: body.customer?.city?.trim() || "",
  };

  if (!keyId || !keySecret) {
    await updateStore({
      orders: [
        {
          id: orderId,
          items,
          total,
          customer,
          payment: "razorpay",
          status: "pending",
          notes: "Razorpay keys missing — complete payment after keys are added.",
          createdAt: new Date().toISOString(),
        },
        ...store.orders,
      ],
    });
    return Response.json({
      mock: true,
      orderId,
      amount: total * 100,
      currency: "INR",
      keyId: "",
      error: "Razorpay is not configured yet. Add Key ID and Secret in Admin → Settings.",
    });
  }

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
      notes: { storeOrderId: orderId },
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
        paymentId: razorpayOrder.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...store.orders,
    ],
  });

  return Response.json({
    mock: false,
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: total * 100,
    currency: "INR",
    keyId,
    name: store.settings.name,
  });
}
