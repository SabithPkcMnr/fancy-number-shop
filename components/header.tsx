"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, User, X, Phone } from "lucide-react";
import { useState } from "react";
import { fallbackNav } from "@/lib/site";
import { useStore } from "@/lib/store";
import { BrandLogo } from "./brand-logo";
import { SearchPanel } from "./search-panel";
import { AuthModal } from "./auth-modal";

export function Header() {
  const path = usePathname();
  const { wishlist, user, settings, menus } = useStore();
  const [openNav, setOpenNav] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const nav = menus.filter((item) => item.placement === "header");
  const links = nav.length ? nav : fallbackNav;

  return (
    <>
      <div className="bg-navy text-white overflow-hidden">
        <div className="flex ticker whitespace-nowrap py-2 text-[11px] sm:text-[12px] font-medium">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {(settings.ticker?.length ? settings.ticker : fallbackNav.map((item) => item.label)).map((item) => (
                <span key={`${i}-${item}`} className="px-6 sm:px-8 opacity-90">
                  {item}
                  <span className="mx-6 sm:mx-8 text-gold">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-6">
            <button className="lg:hidden grid h-9 w-9 shrink-0 place-items-center -ml-1" onClick={() => setOpenNav(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center min-w-0 flex-1" aria-label="FancyNumberShop home">
              <BrandLogo className="h-9 w-auto max-w-[min(220px,calc(100vw-9.5rem))] object-contain object-left sm:max-w-[230px] lg:h-10 lg:max-w-[250px]" />
            </Link>

            <nav className="hidden xl:flex items-center gap-5 text-[13px] font-semibold">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-azure transition-colors ${path === item.href ? "text-azure" : "text-ink/75"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-3 shrink-0">
              <a href={settings.phoneHref} className="grid h-9 w-9 sm:h-auto sm:w-auto sm:flex sm:items-center sm:gap-2 place-items-center text-azure font-semibold" aria-label={settings.phone}>
                <Phone size={18} />
                <span className="hidden md:inline text-sm">{settings.phone}</span>
              </a>
              <button onClick={() => setOpenSearch(true)} aria-label="Search" className="grid h-9 w-9 place-items-center">
                <Search size={20} />
              </button>
              <button onClick={() => setOpenAuth(true)} aria-label="Account" className="hidden sm:grid h-9 w-9 place-items-center">
                <User size={20} />
              </button>
              <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-9 w-9 place-items-center">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-azure text-[10px] text-white flex items-center justify-center px-1">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {openNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-ink/40" onClick={() => setOpenNav(false)} />
          <aside className="absolute left-0 top-0 h-full w-[86%] max-w-sm bg-paper p-6 overflow-auto">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo className="h-8 w-auto max-w-[200px] object-contain object-left" />
              <button onClick={() => setOpenNav(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <a href={settings.phoneHref} className="mt-6 block text-center text-azure font-semibold">
              {settings.phone}
            </a>
            <ul className="mt-6 space-y-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpenNav(false)}
                    className="block py-3 border-b border-line font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/wishlist" onClick={() => setOpenNav(false)} className="block py-3 font-medium">
                  Wishlist
                </Link>
              </li>
            </ul>
            <button
              onClick={() => {
                setOpenNav(false);
                setOpenAuth(true);
              }}
              className="mt-8 text-sm text-muted"
            >
              {user ? `Signed in as ${user.name}` : "My Account"}
            </button>
          </aside>
        </div>
      )}

      {openSearch && (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 z-0 bg-navy/55 backdrop-blur-[2px]" onClick={() => setOpenSearch(false)} aria-label="Close search overlay" />
          <div className="relative z-10 h-full sm:h-auto sm:mx-auto sm:mt-8 sm:mb-8 sm:max-w-3xl sm:px-4 overflow-auto pointer-events-none">
            <div className="pointer-events-auto min-h-full sm:min-h-0 bg-paper sm:rounded-[28px] shadow-2xl overflow-hidden">
              <div className="relative px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 sm:px-8 sm:pt-7 sm:pb-6 bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-azure via-gold to-amber-300" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-azure">Find a lucky number</p>
                    <h2 className="font-display text-[26px] sm:text-3xl mt-1">Search VIP numbers</h2>
                    <p className="mt-1 text-sm text-muted">Digits, price, or a matching family pack.</p>
                  </div>
                  <button
                    onClick={() => setOpenSearch(false)}
                    className="h-10 w-10 rounded-full bg-white border border-line grid place-items-center shrink-0"
                    aria-label="Close search"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
                <SearchPanel compact onSearch={() => setOpenSearch(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}
