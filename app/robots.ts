import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/checkout", "/cart"],
      },
    ],
    sitemap: "https://fancynumbershop.com/sitemap.xml",
    host: "https://fancynumbershop.com",
  };
}
