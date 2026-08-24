"use client";

import Link from "next/link";
import { NumberGrid } from "@/components/number-card";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishItems } = useStore();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-5xl">Wishlist</h1>
      {wishItems.length === 0 ? (
        <p className="mt-8 text-muted">
          Nothing saved yet.{" "}
          <Link href="/numbers" className="text-azure">
            Open the collection
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10">
          <NumberGrid items={wishItems} />
        </div>
      )}
    </div>
  );
}
