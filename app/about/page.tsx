import { steps } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta(
  "About Fancy Number Shop, Mukkom Calicut",
  "Fancy Number Shop is a VIP mobile number desk in Mukkom, Kozhikode (Calicut), Kerala 673602. Buy fancy, 786, mirror and numerology numbers online since 2012.",
  "/about",
);

export default function AboutPage() {
  return (
    <div>
      <div className="relative min-h-[320px] bg-gradient-to-br from-teal-800 via-cyan-700 to-sky-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_46%)]" />
        <div className="relative h-full max-w-7xl mx-auto px-6 py-20 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em]">Established {site.since}</p>
          <h1 className="font-display text-5xl sm:text-6xl mt-2">About Fancy Number Shop</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-display text-3xl leading-snug">
          We help people choose a mobile number that is easy to remember, lucky to keep, and simple to port.
        </p>
        <p className="mt-6 text-muted leading-relaxed">
          Over {site.stats.years} years we have become a trusted desk for more than {site.stats.customers}{" "}
          customers across India. Our desk is in Mukkom, Calicut, with a catalogue that is edited daily
          and a buying path that is either instant Razorpay checkout or a WhatsApp conversation about that exact number.
        </p>
        <h2 className="font-display text-3xl mt-12">What we offer</h2>
        <p className="mt-4 text-muted leading-relaxed">
          Business numbers that are easy to remember. Personal numbers with repeating digits, mirrors, and 786.
          Family packs that share a prefix. Numerology-clean holdings without 2, 4 and 8. And rare VVIP pieces
          reserved for those who know.
        </p>
        <h2 className="font-display text-3xl mt-12">Why customers stay</h2>
        <ul className="mt-4 space-y-3 text-muted">
          <li>A live catalogue with honest prices and clear discounts.</li>
          <li>Pay online with Razorpay or buy the same number on WhatsApp.</li>
          <li>{site.stats.customers} clients, from neighbourhood clinics to public names.</li>
          <li>Secure UPC delivery and support until the SIM lights up.</li>
          <li>Visit us in Mukkom, Calicut, if you prefer to close in person.</li>
        </ul>
        <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-azure">{site.tagline}</p>
      </div>
      <div className="bg-paper border-y border-line">
        <div className="mx-auto max-w-7xl px-6 py-16 grid sm:grid-cols-4 gap-8 text-center">
          {steps.map((step) => (
            <div key={step.n}>
              <p className="font-display text-4xl text-azure/30">{step.n}</p>
              <h3 className="font-display text-2xl mt-2">{step.title}</h3>
              <p className="text-sm text-muted mt-2">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
