"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inr } from "@/lib/site";
import { useStore } from "@/lib/store";
import { PatternHighlight } from "@/components/pattern-highlight";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
    };
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
  const router = useRouter();
  const { findNumber, user, settings } = useStore();
  const item = findNumber(params.get("id") ?? "");
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
              setBusy(false);
              return;
            }
            sessionStorage.setItem("fns_confirm", data.confirmToken);
            if (!window.Razorpay) {
              setError("Razorpay checkout is still loading. Try again in a moment.");
              setBusy(false);
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
              notes: { storeOrderId: data.orderId, digits: item.digits },
              theme: { color: "#0f766e" },
              modal: {
                ondismiss: () => {
                  setBusy(false);
                  setError("Payment window closed. If money was deducted, wait a moment and open your confirmation link.");
                },
              },
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
                  setBusy(false);
                  return;
                }
                router.push(`/checkout/confirmed?token=${encodeURIComponent(result.token || data.confirmToken)}`);
              },
            });
            rzp.on("payment.failed", (response) => {
              setBusy(false);
              setError(response.error?.description || "Payment failed. No money was captured.");
            });
            rzp.open();
          } catch {
            setError("Payment could not be started.");
            setBusy(false);
          }
        }}
      >
        <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
        <p className="text-muted">Pay securely with Razorpay. Your UPC is issued only after Razorpay confirms the payment.</p>
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
          {busy ? "Opening Razorpay…" : `Pay ${inr(item.price)}`}
        </button>
      </form>
      <aside className="card-surface p-6 h-fit">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Your number</h2>
        <p className="mt-4 font-display text-3xl number-digits">
          <PatternHighlight pattern={item.pattern} digits={item.digits} highlights={item.highlights} />
        </p>
        <p className="text-sm text-muted mt-1">{item.digits}</p>
        <div className="flex justify-between mt-6 pt-4 border-t border-line font-semibold">
          <span>Total</span>
          <span className="text-azure">{inr(item.price)}</span>
        </div>
      </aside>
    </div>
  );
}
