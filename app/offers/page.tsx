import { LiveNumberGrid } from "@/components/number-card";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "VIP Number Offers & Festival Discounts",
  "Festival discounts on VIP and fancy mobile numbers. Extra 10–25% off selected choice numbers from Fancy Number Shop, Calicut, Kerala.",
  "/offers",
);

export default function OffersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Festival edit</p>
      <h1 className="font-display text-5xl mt-2">Offer Zone</h1>
      <p className="text-muted mt-3 max-w-xl">A rotating selection with 15–33% concessions. Numbers here move quickly.</p>
      <div className="mt-10">
        <LiveNumberGrid preset="offer" />
      </div>
    </div>
  );
}
