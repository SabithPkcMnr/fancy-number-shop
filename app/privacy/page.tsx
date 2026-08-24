import { Legal } from "@/components/legal";
import { site } from "@/lib/site";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Privacy Policy",
  "How Fancy Number Shop in Mukkom, Calicut collects and uses customer details when you buy a VIP mobile number.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <Legal
      title="Privacy Policy"
      body={[
        `${site.name} is committed to protecting your privacy. This statement applies to the public website and governs data collection and usage. By using the site you consent to the practices described here.`,
        "We collect the name, mobile number, and billing details you provide at checkout so we can issue UPC and activation support. We also keep anonymised records of which catalogue pages are most visited, so we can edit the collection.",
        "Cookies remember your bag and wishlist. They cannot run programs. You may decline cookies in your browser; some shopping features will then be unavailable.",
        "We do not sell personal data. Payment information is processed by Razorpay and is not stored on Fancy Number Shop servers in full.",
        `Questions: ${site.email} or ${site.phone}.`,
      ]}
    />
  );
}
