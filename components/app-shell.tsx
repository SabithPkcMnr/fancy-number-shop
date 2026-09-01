"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsAppFloat } from "./whatsapp-float";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { settings } = useStore();
  if (path.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (settings.maintenanceMode) {
    return (
      <main className="flex-1 min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-azure">{settings.name}</p>
          <h1 className="font-display text-4xl mt-3">We’ll be back shortly</h1>
          <p className="text-muted mt-3 max-w-md mx-auto">The shop is under a short update. Please check again soon, or WhatsApp us if you need a number urgently.</p>
          {settings.whatsapp ? (
            <a className="btn-primary inline-flex mt-6" href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}>
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 min-w-0 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
