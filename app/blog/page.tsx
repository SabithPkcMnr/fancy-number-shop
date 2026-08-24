import Link from "next/link";
import { posts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "VIP Number Guides, 786 & Numerology Tips",
  "Guides on buying VIP fancy mobile numbers, 786 numbers, mirror patterns, and numerology in India from Fancy Number Shop, Calicut.",
  "/blog",
);

const tones = ["from-teal-600 to-cyan-400", "from-indigo-600 to-violet-400", "from-amber-500 to-orange-400", "from-emerald-600 to-lime-400"];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">Guides</p>
      <h1 className="font-display text-5xl mt-2">Blog</h1>
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-surface overflow-hidden">
            <div className={`h-44 bg-gradient-to-br ${tones[index % tones.length]}`} />
            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                {post.date} · {post.read}
              </p>
              <h2 className="font-display text-3xl mt-2 group-hover:text-azure">{post.title}</h2>
              <p className="mt-3 text-muted">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
