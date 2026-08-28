"use client";

import Link from "next/link";
import type { VipNumber } from "@/lib/catalog";
import { inr } from "@/lib/site";
import { useStore } from "@/lib/store";
import { BuyButton } from "@/components/buy-button";

export function BuyBox({ item, meaning }: { item: VipNumber; meaning: string }) {
  const { toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(item.id);

  return (
    <div className="card-surface min-w-0 p-5 sm:p-6">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
        <span className="text-sm sm:text-lg text-muted line-through">{inr(item.originalPrice)}</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[1.75rem] sm:text-3xl leading-none text-azure font-extrabold">
            {inr(item.price)}
          </span>
          {item.discount > 0 && (
            <span className="shrink-0 whitespace-nowrap rounded-md bg-red-50 px-2 py-0.5 text-sm text-danger font-semibold">
              {item.discount}% off
            </span>
          )}
        </div>
      </div>
      <p className="mt-4 inline-flex max-w-full rounded-full bg-sky px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-azure">
        {item.checkout === "whatsapp" ? "Buy on WhatsApp" : "Pay securely with Razorpay"}
      </p>
      <p className="mt-5 text-sm text-muted leading-relaxed">{meaning}</p>
      {item.prebookDate && (
        <p className="mt-4 text-sm">
          UPC available{" "}
          <strong>
            {new Date(item.prebookDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
          . Reserve it today.
        </p>
      )}
      <BuyButton item={item} className="mt-8" />
      <button
        onClick={() => toggleWishlist(item.id)}
        className="mt-3 w-full h-12 rounded-xl border border-line text-sm font-semibold"
      >
        {wished ? "Saved to wishlist" : "Add to wishlist"}
      </button>
      <Link href="/contact" className="mt-3 block text-center text-sm text-muted">
        Request a similar number
      </Link>
    </div>
  );
}
