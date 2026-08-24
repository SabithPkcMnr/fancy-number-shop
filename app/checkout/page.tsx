"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { inr } from "@/lib/site";
import { useStore } from "@/lib/store";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading checkout…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const params = useSearchParams();
  const { findNumber, user, settings } = useStore();
  const item = findNumber(params.get("id") ?? "");
  const [done, setDone] = useState<{ upc: string; number: string } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Payment received</p>
        <h1 className="font-display text-5xl mt-3">Your UPC is ready</h1>
        <p className="mt-6 text-muted">
          Porting code for <strong className="text-ink">{done.number}</strong> has been issued. Take this to any Jio,
          Airtel, Vi or BSNL retailer with Aadhaar.
        </p>
        <p className="mt-8 font-display text-4xl tracking-[0.2em]">{done.upc}</p>
        <Link href="/numbers" className="mt-10 inline-block text-sm font-semibold text-azure">
          Browse more numbers
        </Link>
      </div>
    );
  }

  if (!item || item.checkout !== "razorpay") {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Choose a number first</h1>
        <p className="mt-3 text-muted">Buy now opens checkout for one number at a time.</p>
        <Link href="/numbers" className="mt-6 inline-block text-azure font-semibold">
          Return to the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12 grid lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-12">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          const customer = {
            name: String(form.get("name") || ""),
            phone: String(form.get("phone") || ""),
            email: String(form.get("email") || ""),
            city: String(form.get("city") || ""),
          };
          try {
            const res = await fetch("/api/checkout/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: [item.id], customer }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Could not start payment.");
              return;
            }
            if (data.mock) {
              const verify = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderId, mock: true }),
              });
              const result = await verify.json();
              setDone({ upc: result.upc, number: result.number });
              return;
            }
            if (!window.Razorpay) {
              setError("Razorpay checkout is still loading. Try again in a moment.");
              return;
            }
            const rzp = new window.Razorpay({
              key: data.keyId,
              amount: data.amount,
              currency: data.currency,
              name: settings.name,
              description: `VIP number ${item.pattern}`,
              order_id: data.razorpayOrderId,
              prefill: { name: customer.name, contact: customer.phone, email: customer.email },
              handler: async (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
              }) => {
                const verify = await fetch("/api/checkout/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: data.orderId,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });
                const result = await verify.json();
                if (!verify.ok) {
                  setError(result.error || "Payment verification failed.");
                  return;
                }
                setDone({ upc: result.upc, number: result.number });
              },
            });
            rzp.open();
          } catch {
            setError("Payment could not be started.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
        <p className="text-muted">Pay securely with Razorpay. We will send the UPC to your mobile.</p>
        <input required name="name" defaultValue={user?.name} placeholder="Full name as on Aadhaar" className="w-full h-12 rounded-xl border border-line px-3" />
        <input required name="phone" defaultValue={user?.phone} placeholder="Mobile for UPC SMS" className="w-full h-12 rounded-xl border border-line px-3" />
        <input required name="email" defaultValue={user?.email} placeholder="Email" className="w-full h-12 rounded-xl border border-line px-3" />
        <input required name="city" placeholder="City / PIN" className="w-full h-12 rounded-xl border border-line px-3" />
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" required className="mt-1" />
          I understand some pre-owned numbers may receive residual SMS after activation.
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={busy} className="btn-primary w-full h-12">
          {busy ? "Starting payment…" : `Pay ${inr(item.price)}`}
        </button>
      </form>
      <aside className="card-surface p-6 h-fit">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Your number</h2>
        <p className="mt-4 font-display text-3xl number-digits">{item.pattern}</p>
        <p className="text-sm text-muted mt-1">{item.digits}</p>
        <div className="flex justify-between mt-6 pt-4 border-t border-line font-semibold">
          <span>Total</span>
          <span className="text-azure">{inr(item.price)}</span>
        </div>
      </aside>
    </div>
  );
}
