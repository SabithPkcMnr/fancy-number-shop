import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

export function JsonLd() {
  const business = {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    name: site.name,
    url: "https://fancynumbershop.com",
    description: site.description,
    telephone: "+91-9747888999",
    email: site.email,
    image: "https://fancynumbershop.com/opengraph-image",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Credit Card, Debit Card, Razorpay, WhatsApp",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mukkom",
      addressLocality: "Kozhikode",
      addressRegion: "Kerala",
      postalCode: "673602",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.3216,
      longitude: 75.964,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: "https://fancynumbershop.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fancynumbershop.com/numbers?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
