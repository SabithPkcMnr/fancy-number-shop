import { findNumber, getStore, nextOrderId, updateStore } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; name?: string; phone?: string };
  const number = body.id ? await findNumber(body.id) : undefined;
  if (!number || number.status !== "live") {
    return Response.json({ error: "Number not available." }, { status: 404 });
  }

  const store = await getStore();
  const orderId = nextOrderId();
  await updateStore({
    orders: [
      {
        id: orderId,
        items: [{ id: number.id, digits: number.digits, pattern: number.pattern, price: number.price }],
        total: number.price,
        customer: {
          name: body.name?.trim() || "WhatsApp customer",
          phone: body.phone?.replace(/\D/g, "") || "",
          email: "",
          city: "",
        },
        payment: "whatsapp",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...store.orders,
    ],
  });

  return Response.json({ ok: true, orderId });
}
