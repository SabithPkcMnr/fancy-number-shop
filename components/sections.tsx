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
  { href: "/numbers?category=septa", title: "Septa", tone: "from-rose-700 to-orange-500" },
  { href: "/numbers?category=octa", title: "Octa", tone: "from-fuchsia-800 to-pink-500" },
  { href: "/numbers?category=two-digit", title: "2 Digit Numbers", tone: "from-sky-800 to-cyan-500" },
  { href: "/numbers?category=aaa-bbb", title: "AAA BBB", tone: "from-violet-800 to-indigo-500" },
  { href: "/numbers?category=abc-abc-abc", title: "ABC ABC ABC", tone: "from-teal-800 to-emerald-500" },
  { href: "/numbers?category=abcd-xy-abcd", title: "ABCD XY ABCD", tone: "from-slate-800 to-blue-500" },
  { href: "/numbers?category=middle-penta", title: "MIDDLE PENTA", tone: "from-orange-800 to-amber-500" },
  { href: "/numbers?category=aoo-boo", title: "AOO BOO", tone: "from-neutral-800 to-stone-500" },
];

export function CategoryTiles() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <Link key={tile.href} href={tile.href} className={`relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br ${tile.tone} group`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_50%)]" />
          <h3 className="relative h-full grid place-items-center font-display text-xl sm:text-2xl text-white text-center px-4 leading-tight">
            {tile.title}
          </h3>
        </Link>
      ))}
    </section>
  );
}
