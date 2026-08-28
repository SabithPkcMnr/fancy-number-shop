import { getStore } from "@/lib/db";
import {
  checkoutSignature,
  fetchRazorpayPayment,
  fulfillPaidOrder,
  razorpayKeys,
  signaturesMatch,
} from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };

  if (!body.orderId || !body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
    return Response.json({ error: "Payment details are incomplete." }, { status: 400 });
  }

  const store = await getStore();
  const order = store.orders.find((item) => item.id === body.orderId);
  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.razorpayOrderId && order.razorpayOrderId !== body.razorpayOrderId) {
    return Response.json({ error: "This payment does not match the order." }, { status: 400 });
  }

  const { keyId, keySecret } = razorpayKeys(store.settings);
  if (!keyId || !keySecret) {
    return Response.json({ error: "Razorpay is not configured." }, { status: 503 });
  }

  const expected = checkoutSignature(body.razorpayOrderId, body.razorpayPaymentId, keySecret);
  if (!signaturesMatch(expected, body.razorpaySignature)) {
    return Response.json({ error: "Payment signature mismatch. This purchase was not confirmed." }, { status: 400 });
  }

  const payment = await fetchRazorpayPayment(body.razorpayPaymentId, keyId, keySecret);
  if (!payment || payment.order_id !== body.razorpayOrderId) {
    return Response.json({ error: "Razorpay could not confirm this payment." }, { status: 400 });
  }
  if (payment.status !== "captured" && payment.status !== "authorized") {
    return Response.json({ error: `Payment is ${payment.status}, not captured yet.` }, { status: 409 });
  }
  if (payment.amount !== order.total * 100) {
    return Response.json({ error: "Paid amount does not match this order." }, { status: 400 });
  }

  const result = await fulfillPaidOrder({
    orderId: order.id,
    razorpayOrderId: body.razorpayOrderId,
    razorpayPaymentId: body.razorpayPaymentId,
  });
  if (!result) {
    return Response.json({ error: "Order could not be updated." }, { status: 500 });
  }
  return Response.json({ ...result, token: order.confirmToken });
}
