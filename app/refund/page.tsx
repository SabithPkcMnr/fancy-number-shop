import { Legal } from "@/components/legal";
import { site } from "@/lib/site";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Refund & Cancellation",
  "Refund and cancellation policy for VIP mobile number purchases from Fancy Number Shop, Calicut, Kerala.",
  "/refund",
);

export default function RefundPage() {
  return (
    <Legal
      title="Refund & Cancellation"
      body={[
        "You may cancel an unpaid bag at any time. Once payment is captured, cancellation is possible only before UPC is issued — write to the desk immediately.",
        "If we cannot deliver UPC for a purchased number, we refund the full amount to the original payment method within 5–7 working days.",
        "Refunds are not issued after successful UPC delivery and retailer porting, except where the number cannot be activated for reasons attributable to Fancy Number Shop.",
        `Claims require your invoice number. Email ${site.email} or call ${site.phone}.`,
      ]}
    />
  );
}
