import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { inr } from "@/lib/site";
import { getStore, mutateStore } from "@/lib/db";
import { notifyAdmins } from "@/lib/notify";
import type { AppData, Order } from "@/lib/types";

export function newConfirmToken() {
  return `tok_${randomBytes(18).toString("hex")}`;
}

export function razorpayKeys(settings: AppData["settings"]) {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || settings.razorpayKeyId,
    keySecret: process.env.RAZORPAY_KEY_SECRET || settings.razorpayKeySecret,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || settings.razorpayWebhookSecret,
  };
}

export function signaturesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkoutSignature(orderId: string, paymentId: string, secret: string) {
  return createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
}

export function webhookSignature(rawBody: string, secret: string) {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

export async function fetchRazorpayPayment(paymentId: string, keyId: string, keySecret: string) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
  };
}

function publicConfirmation(order: Order) {
  return {
    ok: true as const,
    status: order.status,
    orderId: order.id,
    paymentId: order.paymentId ?? "",
    upc: order.upc ?? "",
    number: order.items[0]?.pattern ?? "",
    digits: order.items[0]?.digits ?? "",
    total: order.total,
    totalLabel: inr(order.total),
    customer: order.customer.name,
    paidAt: order.paidAt ?? null,
    confirmed: order.status === "paid" || order.status === "processing" || order.status === "completed",
  };
}

export async function fulfillPaidOrder(input: {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}) {
  let notified: Order | null = null;
  const store = await mutateStore((current) => {
    const order = current.orders.find(
      (item) =>
        (input.orderId && item.id === input.orderId) ||
        (input.razorpayOrderId && item.razorpayOrderId === input.razorpayOrderId),
    );
    if (!order) return current;
    if (order.status === "paid" || order.status === "processing" || order.status === "completed") {
      const merged = {
        ...order,
        paymentId: input.razorpayPaymentId || order.paymentId,
      };
      notified = null;
      return {
        ...current,
        orders: current.orders.map((item) => (item.id === order.id ? merged : item)),
      };
    }
    const upc = order.upc || `${Math.floor(100000 + Math.random() * 900000)}`;
    const soldIds = new Set(order.items.map((item) => item.id));
    const paid: Order = {
      ...order,
      status: "paid",
      paymentId: input.razorpayPaymentId || order.paymentId,
      razorpayOrderId: input.razorpayOrderId || order.razorpayOrderId,
      upc,
      paidAt: new Date().toISOString(),
    };
    notified = paid;
    return {
      ...current,
      orders: current.orders.map((item) => (item.id === order.id ? paid : item)),
      numbers: current.numbers.map((item) => (soldIds.has(item.id) ? { ...item, status: "sold" as const } : item)),
    };
  });

  const order =
    notified ||
    store.orders.find(
      (item) =>
        (input.orderId && item.id === input.orderId) ||
        (input.razorpayOrderId && item.razorpayOrderId === input.razorpayOrderId),
    );
  if (!order) return null;
  if (notified) {
    await notifyAdmins({
      title: "Payment confirmed",
      message: `${order.id} · ${order.items[0]?.pattern ?? "VIP number"} · ${inr(order.total)}`,
      url: "/admin/orders",
    });
  }
  return publicConfirmation(order);
}

export async function confirmationByToken(token: string) {
  const store = await getStore();
  const order = store.orders.find((item) => item.confirmToken && item.confirmToken === token);
  if (!order) return null;
  return publicConfirmation(order);
}
