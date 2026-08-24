import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="text-[11px] tracking-[0.28em] uppercase text-azure">404</p>
      <h1 className="font-display text-5xl mt-3">This number is not in the book</h1>
      <Link href="/numbers" className="mt-8 inline-block text-xs tracking-[0.2em] uppercase text-azure">
        Return to the collection
      </Link>
    </div>
  );
}
