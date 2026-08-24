import type { MetadataRoute } from "next";
import { posts } from "@/lib/content";
import { getStore } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const store = await getStore();

  const pages: MetadataRoute.Sitemap = [
    "",
    "/numbers",
    "/offers",
    "/prebook",
    "/numerology",
    "/about",
    "/gallery",
    "/contact",
    "/faq",
    "/how-it-works",
    "/blog",
    "/privacy",
    "/terms",
    "/refund",
  ].map((path) => ({
    url: path ? `${siteUrl}${path}` : `${siteUrl}/`,
    lastModified: now,
    changeFrequency: path === "" || path === "/numbers" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/numbers" ? 0.9 : 0.7,
  }));

  const numbers = store.numbers
    .filter((item) => item.status !== "hidden")
    .slice(0, 200)
    .map((item) => ({
      url: `${siteUrl}/numbers/${item.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const articles = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...pages, ...articles, ...numbers];
}
