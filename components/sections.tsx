import { Headphones, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const items = [
  {
    icon: Headphones,
    title: "24/7 customer support",
    text: "A live desk for every new collector",
  },
  {
    icon: Sparkles,
    title: "Festival offers",
    text: "Fresh discounts on selected VIP numbers",
  },
  {
    icon: ShieldCheck,
    title: "Secure buying",
    text: "Razorpay payments or WhatsApp booking, UPC in 60 minutes",
  },
];

export function TrustBar() {
  return (
    <section className="grid md:grid-cols-3 gap-4 mx-auto max-w-7xl px-4 sm:px-6">
      {items.map((item) => (
        <div key={item.title} className="card-surface px-8 py-10 text-center">
          <item.icon className="mx-auto text-azure" />
          <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
          <p className="mt-2 text-sm text-muted">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

const tiles = [
  { href: "/numbers?category=vvip", title: "VVIP", tone: "from-neutral-900 to-orange-700" },
  { href: "/numbers?category=mirror", title: "Mirror", tone: "from-indigo-700 to-violet-500" },
  { href: "/numbers?category=penta", title: "Penta", tone: "from-amber-600 to-orange-500" },
  { href: "/numbers?category=lucky-786", title: "786 Special", tone: "from-emerald-700 to-lime-500" },
];

export function CategoryTiles() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <Link key={tile.href} href={tile.href} className={`relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br ${tile.tone} group`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_50%)]" />
          <h3 className="relative h-full grid place-items-center font-display text-3xl text-white">{tile.title}</h3>
        </Link>
      ))}
    </section>
  );
}
