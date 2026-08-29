import { notFound } from "next/navigation";
import Link from "next/link";
import { catalog, getNumber } from "@/lib/catalog";
import { findNumber, getStore, similarFrom } from "@/lib/db";
import { getNumerology, destinyMeanings } from "@/lib/numerology";
import { inr, site } from "@/lib/site";
import { siteUrl } from "@/lib/seo";
import { numberBuyGuide } from "@/lib/content";
import { NumberGrid } from "@/components/number-card";
import { PatternHighlight } from "@/components/pattern-highlight";
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
      ? `Buy VIP mobile number ${item.digits} for ${inr(item.price)} from Fancy Number Shop, Mukkom, Calicut. Pay online or on WhatsApp. Porting code shared after we contact you.`
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }} />
      <p className="text-xs font-bold tracking-[0.18em] uppercase text-azure">
        {item.categories[0].replace("-", " ")} · {item.prebook ? "Pre-booking" : "Ready now"}
      </p>
      <div className="mt-5 sm:mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-12">
        <div className="min-w-0 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-orange-950 px-5 py-12 sm:px-8 sm:py-16 text-center text-white">
          <p className="text-sm text-white/70 number-digits">{item.digits}</p>
          <h1 className="font-display mt-3 number-digits whitespace-nowrap tracking-normal text-[clamp(1.45rem,7vw,3.75rem)]">
            <PatternHighlight pattern={item.pattern} digits={item.digits} highlights={item.highlights} tone="dark" />
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/80">{numerology.display}</p>
          <p className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-200">
            Destiny {numerology.destiny} · {meaning.title}
          </p>
        </div>
        <BuyBox item={item} meaning={meaning.text} />
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="font-display text-3xl">Why this number works</h2>
        <p className="mt-3 text-muted leading-relaxed">{meaning.text}</p>
      </div>

      <section className="mt-10 sm:mt-16 max-w-3xl" aria-labelledby="how-to-buy">
        <h2 id="how-to-buy" className="font-display text-2xl sm:text-3xl">
          {numberBuyGuide.title}
        </h2>
        <ol className="mt-5 space-y-4">
          {numberBuyGuide.steps.map((step) => (
            <li key={step.n} className="grid grid-cols-[28px_1fr] gap-3">
              <span className="font-display text-xl text-azure leading-7">{step.n}.</span>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{step.title}</h3>
                <p className="mt-0.5 text-sm text-muted leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted">
          Need help with activation? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-azure">
            {site.phone}
          </a>
          .{" "}
          <Link href="/how-it-works" className="text-azure font-semibold">
            Full process
          </Link>
        </p>
      </section>

      <div className="mt-16">
        <h2 className="font-display text-3xl mb-8">Similar numbers</h2>
        <NumberGrid items={similar} />
      </div>
    </div>
  );
}
