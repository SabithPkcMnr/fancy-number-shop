import { faqs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "VIP Number FAQ — UPC, Porting & Payment",
  "How to buy a VIP fancy mobile number in India, get UPC in 60 minutes, and port to Jio, Airtel, Vi or BSNL from Fancy Number Shop, Calicut.",
  "/faq",
);

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-[11px] tracking-[0.28em] uppercase text-azure">Must read</p>
      <h1 className="font-display text-5xl mt-2">Frequently asked</h1>
      <div className="mt-10 space-y-8">
        {faqs.map((faq, i) => (
          <div key={faq.q}>
            <h2 className="font-display text-2xl">
              Q{i + 1}. {faq.q}
            </h2>
            <p className="mt-2 text-muted leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
