import { notFound } from "next/navigation";
import { posts } from "@/lib/content";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt,
    alternates: post ? { canonical: `https://fancynumbershop.com/blog/${post.slug}` } : undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">
        {post.date} · {post.read}
      </p>
      <h1 className="font-display text-5xl mt-3">{post.title}</h1>
      <div className="mt-10 h-56 rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-500" />
      <div className="mt-10 space-y-5 text-lg text-muted leading-relaxed">
        {post.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
    </article>
  );
}
