import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import NumbersBrowser from "./browser";

export const metadata = pageMeta(
  "Buy VIP & Fancy Mobile Numbers Online",
  "Browse VIP, fancy, choice, 786, mirror and numerology mobile numbers for sale in India. Buy one number at a time from Fancy Number Shop, Mukkom, Calicut, Kerala 673602.",
  "/numbers",
);

export default function NumbersPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted">Loading the collection…</div>}>
      <NumbersBrowser />
    </Suspense>
  );
}
