"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { WhatsAppFloat } from "./whatsapp-float";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/admin")) {
    return <>{children}</>;
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
