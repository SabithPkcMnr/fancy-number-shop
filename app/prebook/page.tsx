import { LiveNumberGrid } from "@/components/number-card";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Pre-Book Upcoming VIP Mobile Numbers",
  "Reserve upcoming VIP and fancy mobile numbers before the UPC date. Pre-booking from Fancy Number Shop, Mukkom, Calicut, Kerala 673602.",
  "/prebook",
);

export default function PrebookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Reserve ahead</p>
      <h1 className="font-display text-5xl mt-2">Pre-Booking</h1>
      <p className="text-muted mt-3 max-w-2xl">
        These numbers become available on the UPC date printed on each card. Reserve today — the holding is in your name until the date arrives.
      </p>
      <div className="mt-10">
        <LiveNumberGrid preset="prebook" />
      </div>
    </div>
  );
}
