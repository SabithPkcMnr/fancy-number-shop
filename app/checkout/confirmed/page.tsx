"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Confirmation = {
  confirmed: boolean;
  orderId: string;
  paymentId: string;
  upc: string;
  number: string;
  totalLabel: string;
  customer: string;
};

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading confirmation…</div>}>
      <ConfirmationView />
    </Suspense>
  );
}

function ConfirmationView() {
  const params = useSearchParams();
  const [data, setData] = useState<Confirmation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token") || sessionStorage.getItem("fns_confirm") || "";
    if (!token) {
      setError("No payment to confirm. Complete checkout first.");
      return;
    }
    let stop = false;
    async function load(attempt = 0) {
      const res = await fetch(`/api/checkout/confirmation?token=${encodeURIComponent(token)}`);
      const body = await res.json();
      if (stop) return;
      if (!res.ok) {
        setError(body.error || "Could not load this confirmation.");
        return;
      }
      setData(body);
      if (!body.confirmed && attempt < 12) {
        window.setTimeout(() => load(attempt + 1), 2500);
      }
    }
    load().catch(() => setError("Could not load this confirmation."));
    return () => {
      stop = true;
    };
  }, [params]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Payment not found</h1>
        <p className="mt-3 text-muted">{error}</p>
        <Link href="/numbers" className="mt-6 inline-block text-azure font-semibold">
          Browse numbers
        </Link>
      </div>
    );
  }

  if (!data || !data.confirmed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Confirming with Razorpay</p>
        <h1 className="font-display text-4xl mt-3">Checking your payment</h1>
        <p className="mt-4 text-muted">This page updates when Razorpay confirms the capture. Do not pay again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Payment confirmed</p>
      <h1 className="font-display text-4xl sm:text-5xl mt-3">Your UPC is ready</h1>
      <p className="mt-5 text-muted">
        Thank you{data.customer ? `, ${data.customer}` : ""}. Razorpay confirmed {data.totalLabel} for{" "}
        <strong className="text-ink">{data.number}</strong>.
      </p>
      <p className="mt-8 font-display text-4xl tracking-[0.2em]">{data.upc}</p>
      <p className="mt-3 text-sm text-muted">Take this UPC to any Jio, Airtel, Vi or BSNL retailer with Aadhaar.</p>
      <div className="mt-8 card-surface p-5 text-left text-sm space-y-2">
        <p>
          <span className="text-muted">Order</span> · {data.orderId}
        </p>
        {data.paymentId && (
          <p>
            <span className="text-muted">Payment</span> · {data.paymentId}
          </p>
        )}
      </div>
      <Link href="/numbers" className="mt-10 inline-block text-sm font-semibold text-azure">
        Browse more numbers
      </Link>
    </div>
  );
}
