"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { useStore } from "@/lib/store";

export function WhatsAppFloat() {
  const { settings } = useStore();
  return (
    <a
      href={whatsappLink(settings.whatsapp, `Hello ${settings.name}, I would like help choosing a VIP number.`)}
      className="fixed bottom-5 right-4 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle fill="currentColor" />
    </a>
  );
}
