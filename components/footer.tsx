"use client";

import Link from "next/link";
import { categories } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="bg-navy text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <p className="font-extrabold text-2xl tracking-tight">{settings.name}</p>
          <p className="mt-3 text-sm text-white/60">{settings.tagline}</p>
          <p className="mt-6 text-sm text-white/70 leading-relaxed">
            {settings.addressLine1}
            <br />
            {settings.addressLine2}
          </p>
          <p className="mt-4 text-xs uppercase tracking-wider text-white/50">{settings.trustLine || "Secure UPC in 60 minutes"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/about">About us</Link>
            </li>
            <li>
              <Link href="/how-it-works">How it works</Link>
            </li>
            <li>
              <Link href="/gallery">Reviews</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Popular categories</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {categories.slice(0, 8).map((cat) => (
              <li key={cat.slug}>
                <Link href={`/numbers?category=${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Talk to us</p>
          <p className="mt-4 font-extrabold text-3xl tracking-tight">{settings.phone}</p>
          <p className="text-sm text-white/60 mt-1">{settings.hours}</p>
          <p className="text-sm text-white/60 mt-3">{settings.email}</p>
          <div className="mt-6 flex gap-4 text-xs font-semibold uppercase tracking-wider text-white/50">
            <a href={settings.instagram}>Instagram</a>
            <a href={settings.facebook}>Facebook</a>
            <a href={settings.youtube}>YouTube</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/40">
        <div className="flex flex-wrap justify-center gap-5 mb-3">
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms & conditions</Link>
          <Link href="/refund">Refund & cancellation</Link>
        </div>
        © {new Date().getFullYear()} {settings.legalName}. All rights reserved. {settings.domain.replace("https://", "")}
      </div>
    </footer>
  );
}
