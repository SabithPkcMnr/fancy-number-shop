"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { getNumerology } from "@/lib/numerology";
import { inr } from "@/lib/site";
import { type VipNumber } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { BuyButton } from "./buy-button";

export function NumberCard({ item }: { item: VipNumber }) {
  const { toggleWishlist, wishlist } = useStore();
  const numerology = getNumerology(item.digits);
  const wished = wishlist.includes(item.id);

  return (
    <article className="vip-card group relative min-w-0 bg-paper border border-line rounded-2xl p-3.5 sm:p-5 text-center shadow-sm hover:shadow-xl hover:shadow-azure/10 hover:-translate-y-0.5 transition-all">
      {item.discount > 0 && (
        <span className="absolute left-3 top-3 bg-danger text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
          {item.discount}%
        </span>
      )}
      <button
        onClick={() => toggleWishlist(item.id)}
        className="absolute right-3 top-3 text-muted hover:text-danger"
        aria-label="Wishlist"
      >
        <Heart size={18} fill={wished ? "currentColor" : "none"} className={wished ? "text-danger" : ""} />
      </button>

      {item.prebook && item.prebookDate && (
        <p className="text-[11px] font-semibold uppercase text-azure mb-2">
          UPC {new Date(item.prebookDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      )}

      <div className="mt-4 mb-1 text-xs sm:text-sm">
        <span className="text-muted line-through mr-1.5 sm:mr-2">{inr(item.originalPrice)}</span>
        <span className="text-azure font-extrabold">{inr(item.price)}</span>
      </div>

      <Link href={`/numbers/${item.id}`} className="block min-w-0">
        <p className="text-[11px] sm:text-[13px] text-muted number-digits whitespace-nowrap overflow-hidden text-ellipsis">
          {item.digits}
        </p>
        <FitNumber>{item.pattern}</FitNumber>
        <p className="mt-2 text-[11px] sm:text-[13px] text-muted">{numerology.display}</p>
      </Link>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
        {item.checkout === "whatsapp" ? "WhatsApp booking" : "Pay online"}
      </p>
      <BuyButton item={item} className="mt-3" />
    </article>
  );
}

export function NumberGrid({ items }: { items: VipNumber[] }) {
  if (!items.length) {
    return (
      <p className="py-16 text-center text-muted">
        No numbers match this search. Relax a filter, or try a shorter digit string.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
      {items.map((item) => (
        <NumberCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function FitNumber({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = "";
      const maxPx = parseFloat(getComputedStyle(el).fontSize);
      const available = el.parentElement?.clientWidth || el.clientWidth;
      if (!available) return;
      let low = 10;
      let high = maxPx;
      for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2;
        el.style.fontSize = `${mid}px`;
        if (el.scrollWidth > available + 0.5) high = mid;
        else low = mid;
      }
      el.style.fontSize = `${Math.max(10, low)}px`;
    };

    const schedule = () => requestAnimationFrame(fit);
    fit();
    schedule();
    const fonts = document.fonts?.ready.then(schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => {
      observer.disconnect();
      void fonts;
    };
  }, [children]);

  return (
    <h3 ref={ref} className="vip-number mt-1 font-display w-full px-0.5">
      {children}
    </h3>
  );
}

export function LiveNumberGrid({
  preset = "all",
  limit,
}: {
  preset?: "all" | "featured" | "offer" | "prebook";
  limit?: number;
}) {
  const { numbers } = useStore();
  const items = numbers
    .filter((item) => {
      if (preset === "featured") return Boolean(item.featured);
      if (preset === "offer") return Boolean(item.offer || item.discount >= 15);
      if (preset === "prebook") return Boolean(item.prebook);
      return true;
    })
    .slice(0, limit);
  return <NumberGrid items={items} />;
}
