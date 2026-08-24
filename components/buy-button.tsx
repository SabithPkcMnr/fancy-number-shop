"use client";

import { useRouter } from "next/navigation";
import type { VipNumber } from "@/lib/catalog";
import { numberWhatsAppUrl } from "@/lib/site";
import { useStore } from "@/lib/store";

export function BuyButton({
  item,
  className = "",
  label,
}: {
  item: VipNumber;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const { settings } = useStore();

  async function buy() {
    if (item.checkout === "whatsapp") {
      fetch("/api/checkout/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      }).catch(() => undefined);
      window.open(numberWhatsAppUrl(item, settings), "_blank", "noopener,noreferrer");
      return;
    }
    router.push(`/checkout?id=${item.id}`);
  }

  const whatsapp = item.checkout === "whatsapp";
  return (
    <button
      onClick={buy}
      className={`${whatsapp ? "btn-whatsapp" : "btn-primary"} w-full ${className}`}
    >
      {whatsapp ? label || "Buy on WhatsApp" : label || "Buy now"}
    </button>
  );
}
