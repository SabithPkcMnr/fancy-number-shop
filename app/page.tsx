import Link from "next/link";
import { Hero } from "@/components/hero";
import { pageMeta } from "@/lib/seo";
import { SearchPanel } from "@/components/search-panel";
import { LiveNumberGrid } from "@/components/number-card";
import { CategoryTiles, TrustBar } from "@/components/sections";
import { posts, steps } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata = pageMeta(
  "Buy VIP Fancy Mobile Numbers Online in India",
  site.description,
  "/",
);

export default function Home() {
  return (
    <>
      <Hero />

      <section id="search" className="mx-auto max-w-7xl px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-20">
        <SearchPanel />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6 sm:mt-16">
        <HeaderRow title="VVIP Numbers" href="/numbers" hideLinkOnMobile />
        <LiveNumberGrid preset="featured" limit={8} />
        <Link href="/numbers" className="md:hidden mt-4 btn-primary w-full h-12 text-base">
          View More
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <HeaderRow title="Best offers" href="/offers" />
        <LiveNumberGrid preset="offer" limit={8} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <CategoryTiles />
      </section>

      <section className="mt-16">
        <TrustBar />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <HeaderRow title="Guides" href="/blog" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-surface overflow-hidden">
              <div className={`h-36 bg-gradient-to-br ${["from-teal-600 to-cyan-400", "from-indigo-600 to-violet-400", "from-amber-500 to-orange-400", "from-emerald-600 to-lime-400"][index % 4]}`} />
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{post.date}</p>
                <h3 className="font-display text-xl mt-2 group-hover:text-azure">{post.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <p className="text-xs font-bold tracking-[0.22em] uppercase text-azure text-center">How it works</p>
        <h2 className="font-display text-3xl sm:text-5xl text-center mt-2">Four simple steps to your number</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.n} className="card-surface text-center px-4 py-8">
              <p className="font-display text-5xl text-azure/30">{step.n}</p>
              <h3 className="mt-2 font-display text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-20 pb-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl">Buy VIP fancy mobile numbers in Calicut, Kerala</h2>
        <p className="mt-5 text-muted leading-relaxed">
          Fancy Number Shop in Mukkom, Kozhikode (Calicut), PIN 673602, is a trusted desk for VIP, fancy,
          choice, 786, mirror, and numerology mobile numbers across India. Pick one number, pay with
          Razorpay or WhatsApp, and receive your UPC within 60 minutes. Port to Jio, Airtel, Vi or BSNL
          on your name. Call {site.phone}. {site.tagline}
        </p>
      </section>
    </>
  );
}

function HeaderRow({
  title,
  href,
  hideLinkOnMobile,
}: {
  title: string;
  href: string;
  hideLinkOnMobile?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
      <h2 className="font-display text-xl sm:text-4xl leading-none">{title}</h2>
      <Link
        href={href}
        className={`shrink-0 text-sm font-semibold text-azure ${hideLinkOnMobile ? "hidden md:inline" : ""}`}
      >
        View more
      </Link>
    </div>
  );
}
