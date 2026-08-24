import { notFound } from "next/navigation";
import Link from "next/link";
import { catalog, getNumber } from "@/lib/catalog";
import { findNumber, getStore, similarFrom } from "@/lib/db";
import { getNumerology, destinyMeanings } from "@/lib/numerology";
import { inr } from "@/lib/site";
import { siteUrl } from "@/lib/seo";
import { NumberGrid } from "@/components/number-card";
import { BuyBox } from "./buy-box";

export function generateStaticParams() {
  return catalog.filter((item) => item.status !== "hidden").map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = (await findNumber(id)) ?? getNumber(id);
  const url = item ? `${siteUrl}/numbers/${item.id}` : `${siteUrl}/numbers`;
  return {
    title: item ? `Buy ${item.pattern} VIP Fancy Number` : "VIP Number",
    description: item
      ? `Buy VIP mobile number ${item.digits} for ${inr(item.price)} from Fancy Number Shop, Mukkom, Calicut. Pay online or on WhatsApp. UPC in 60 minutes.`
      : "Buy VIP fancy mobile numbers online in India.",
    alternates: { canonical: url },
    openGraph: {
      title: item ? `Buy ${item.pattern} VIP fancy number` : "VIP Number",
      description: item
        ? `VIP number ${item.digits} priced at ${inr(item.price)}. Port to Jio, Airtel, Vi or BSNL.`
        : "Buy VIP fancy mobile numbers online in India.",
      url,
    },
  };
}

export default async function NumberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = (await findNumber(id)) ?? getNumber(id);
  if (!item || item.status === "hidden") notFound();

  const numerology = getNumerology(item.digits);
  const meaning = destinyMeanings[numerology.destiny];
  const store = await getStore();
  const similar = similarFrom(store.numbers, item);

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `VIP mobile number ${item.pattern}`,
    description: `Buy VIP fancy mobile number ${item.digits} from Fancy Number Shop, Mukkom, Calicut, Kerala.`,
    sku: item.id,
    brand: { "@type": "Brand", name: "Fancy Number Shop" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/numbers/${item.id}`,
      priceCurrency: "INR",
      price: item.price,
      availability: item.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Fancy Number Shop" },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }} />
      <p className="text-xs font-bold tracking-[0.22em] uppercase text-azure">
        {item.categories[0].replace("-", " ")} · {item.prebook ? "Pre-booking" : "Ready now"}
      </p>
      <div className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
        <div className="rounded-3xl bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-600 px-8 py-16 text-center text-white">
          <p className="text-sm text-white/70 number-digits">{item.digits}</p>
          <h1 className="font-display mt-3 number-digits whitespace-nowrap tracking-normal text-[clamp(1.6rem,8vw,3.75rem)]">
            {item.pattern}
          </h1>
          <p className="mt-6 text-lg text-white/80">{numerology.display}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-amber-200">
            Destiny {numerology.destiny} · {meaning.title}
          </p>
        </div>
        <BuyBox item={item} meaning={meaning.text} />
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="font-display text-3xl">Why this number works</h2>
        <p className="mt-3 text-muted leading-relaxed">{meaning.text}</p>
        <p className="mt-4 text-sm text-muted">
          After payment you receive UPC and activation support. Port to Jio, Airtel, Vi or BSNL at any
          retailer, on your name, in 4–5 days.{" "}
          <Link href="/how-it-works" className="text-azure font-semibold">
            See how it works
          </Link>
          .
        </p>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl mb-8">Similar numbers</h2>
        <NumberGrid items={similar} />
      </div>
    </div>
  );
}
