import Link from "next/link";
import { steps } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "How to Buy a VIP Fancy Number in India",
  "Find a VIP number, pay with Razorpay or WhatsApp, receive UPC in 60 minutes, and port to any network on your name. Fancy Number Shop, Mukkom, Calicut.",
  "/how-it-works",
);

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-5xl">How it works</h1>
      <p className="mt-4 text-muted">
        From catalogue to a SIM in your name — usually five days, often less.
      </p>
      <ol className="mt-12 space-y-10">
        {steps.map((step) => (
          <li key={step.n} className="grid grid-cols-[72px_1fr] gap-4">
            <span className="font-display text-4xl text-azure">{step.n}</span>
            <div>
              <h2 className="font-display text-3xl">{step.title}</h2>
              <p className="mt-2 text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        href="/numbers"
        className="mt-12 inline-flex h-12 items-center px-8 bg-azure text-white text-xs tracking-[0.2em] uppercase"
      >
        Choose a number
      </Link>
    </div>
  );
}
