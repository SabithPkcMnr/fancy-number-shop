import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fancynumbershop.com"),
  title: {
    default: "Buy VIP Fancy Mobile Numbers Online in India | Fancy Number Shop",
    template: `%s | Fancy Number Shop`,
  },
  description:
    "Buy VIP, fancy, choice, 786, mirror, and numerology mobile numbers online from Fancy Number Shop, Mukkom, Calicut, Kerala. Pay with Razorpay or WhatsApp. UPC in 60 minutes. Port to Jio, Airtel, Vi or BSNL.",
  keywords: [
    "buy VIP number online",
    "fancy mobile number",
    "VIP mobile number India",
    "choice number",
    "786 number",
    "mirror number",
    "numerology mobile number",
    "fancy number Calicut",
    "fancy number Kerala",
    "Fancy Number Shop",
    "UPC VIP number",
  ],
  alternates: {
    canonical: "https://fancynumbershop.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fancynumbershop.com",
    siteName: site.name,
    title: "Buy VIP Fancy Mobile Numbers Online | Fancy Number Shop",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy VIP Fancy Mobile Numbers Online | Fancy Number Shop",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Mukkom, Kozhikode",
    "geo.position": "11.3216;75.964",
    ICBM: "11.3216, 75.964",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable} h-full`} data-scroll-behavior="smooth">
      <body className={`${sans.className} min-h-full flex flex-col antialiased bg-ivory text-ink`}>
        <JsonLd />
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
