import type { Metadata } from "next";

export const siteUrl = "https://fancynumbershop.com";

export function pageMeta(title: string, description: string, path = "/"): Metadata {
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;
  return {
    title: path === "/" ? { absolute: `${title} | Fancy Number Shop` } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Fancy Number Shop`,
      description,
      url,
      locale: "en_IN",
      siteName: "Fancy Number Shop",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Fancy Number Shop`,
      description,
    },
  };
}
