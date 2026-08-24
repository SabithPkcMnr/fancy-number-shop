import { Legal } from "@/components/legal";
import { site } from "@/lib/site";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Terms & Conditions",
  "Terms for buying VIP fancy mobile numbers from Fancy Number Shop, Mukkom, Calicut, Kerala 673602.",
  "/terms",
);

export default function TermsPage() {
  return (
    <Legal
      title="Terms & Conditions"
      body={[
        `These terms govern purchase of VIP and fancy mobile numbers from ${site.legalName} (${site.name}). Numbers remain in our holding until UPC is issued.`,
        "You may only purchase numbers visible in the live catalogue. Patterns requested via the Choice Number form are a hunt, not a guarantee.",
        "After payment we issue UPC and activation support. Porting to Jio, Airtel, Vi or BSNL is completed at a retailer of your choice with Aadhaar and a live photograph. Activation typically takes 4–5 days and is subject to TRAI MNP rules.",
        "Pre-booked numbers are reserved against a future UPC date printed on the card. Residual SMS on previously active numbers, where disclosed, is not grounds for refund once UPC is delivered.",
        `Governing law: India. Desk: ${site.address.line1}, ${site.address.line2}.`,
      ]}
    />
  );
}
