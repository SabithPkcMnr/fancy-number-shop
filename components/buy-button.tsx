"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import type { VipNumber } from "@/lib/catalog";
import { numberWhatsAppUrl } from "@/lib/site";
import { useStore } from "@/lib/store";

export function BuyButton({
  item,
  className = "",
  label,
  viaWhatsApp,
}: {
  item: VipNumber;
  className?: string;
  label?: string;
  viaWhatsApp?: boolean;
}) {
  const router = useRouter();
  const { settings } = useStore();
  const whatsapp = viaWhatsApp || item.checkout === "whatsapp";

  function openWhatsApp() {
    fetch("/api/checkout/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    }).catch(() => undefined);
    window.open(numberWhatsAppUrl(item, settings), "_blank", "noopener,noreferrer");
  }

  function buy() {
    if (whatsapp) {
      openWhatsApp();
      return;
    }
    router.push(`/checkout?id=${item.id}`);
  }

  return (
    <button
      type="button"
      onClick={buy}
      className={`${whatsapp ? "btn-whatsapp" : "btn-primary"} w-full ${className}`}
    >
      {whatsapp ? <MessageCircle size={18} fill="currentColor" className="mr-1.5" /> : null}
      {whatsapp ? label || "Buy via WhatsApp" : label || "Buy now"}
    </button>
  );
}
