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
    <div className="card-surface p-6">
      <div className="text-lg">
        <span className="text-muted line-through mr-3">{inr(item.originalPrice)}</span>
        <span className="text-3xl text-azure font-extrabold">{inr(item.price)}</span>
        <span className="ml-3 text-sm text-danger font-semibold">{item.discount}% off</span>
      </div>
      <p className="mt-3 inline-flex rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase tracking-wider text-azure">
        {item.checkout === "whatsapp" ? "Buy on WhatsApp" : "Pay securely with Razorpay"}
      </p>
      <p className="mt-4 text-sm text-muted leading-relaxed">{meaning}</p>
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
