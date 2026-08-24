"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { catalog, getNumber as seedNumber, type VipNumber } from "./catalog";
import { defaultSettings, fallbackNav, publicSettings } from "./site";
import type { MenuItem, PublicPayload, PublicSettings, Slide } from "./types";

export type CartLine = { id: string; qty: number };

type User = { name: string; phone: string; email?: string } | null;

type Persisted = { cart: CartLine[]; wishlist: string[]; user: User };

type Store = Persisted & {
  hydrated: boolean;
  numbers: VipNumber[];
  slides: Slide[];
  menus: MenuItem[];
  settings: PublicSettings;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  login: (user: NonNullable<User>) => void;
  logout: () => void;
  register: (user: { name: string; phone: string; email?: string; password?: string }) => Promise<string | null>;
  findNumber: (id: string) => VipNumber | undefined;
  cartItems: (VipNumber & { qty: number })[];
  cartCount: number;
  cartTotal: number;
  wishItems: VipNumber[];
};

const StoreContext = createContext<Store | null>(null);

const empty: Persisted = { cart: [], wishlist: [], user: null };
const listeners = new Set<() => void>();
let memory: Persisted = empty;

const fallbackPublic: PublicPayload = {
  settings: publicSettings(defaultSettings),
  numbers: catalog.filter((item) => item.status === "live"),
  slides: [],
  menus: fallbackNav.map((item, index) => ({
    id: `header-${index}`,
    href: item.href,
    label: item.label,
    placement: "header",
    order: index,
    visible: true,
  })),
};

function emit() {
  listeners.forEach((listener) => listener());
}

function read(): Persisted {
  try {
    const raw = localStorage.getItem("fns-store");
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: Persisted) {
  memory = next;
  try {
    localStorage.setItem("fns-store", JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

if (typeof window !== "undefined") {
  memory = read();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, () => memory, () => empty);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [publicData, setPublicData] = useState<PublicPayload>(fallbackPublic);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/public`)
      .then((res) => (res.ok ? res.json() : fallbackPublic))
      .then((data: PublicPayload) => {
        if (!cancelled) setPublicData(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const findNumber = useCallback(
    (id: string) => publicData.numbers.find((item) => item.id === id) ?? seedNumber(id),
    [publicData.numbers],
  );

  const addToCart = useCallback(
    (id: string) => {
      const item = findNumber(id);
      if (!item || item.checkout === "whatsapp") return;
      const current = memory;
      if (current.cart.some((line) => line.id === id)) return;
      write({ ...current, cart: [...current.cart, { id, qty: 1 }] });
    },
    [findNumber],
  );

  const removeFromCart = useCallback((id: string) => {
    const current = memory;
    write({ ...current, cart: current.cart.filter((line) => line.id !== id) });
  }, []);

  const clearCart = useCallback(() => {
    write({ ...memory, cart: [] });
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    const current = memory;
    write({
      ...current,
      wishlist: current.wishlist.includes(id)
        ? current.wishlist.filter((item) => item !== id)
        : [...current.wishlist, id],
    });
  }, []);

  const login = useCallback((user: NonNullable<User>) => {
    write({ ...memory, user });
  }, []);

  const logout = useCallback(() => {
    write({ ...memory, user: null });
  }, []);

  const register = useCallback(async (user: { name: string; phone: string; email?: string; password?: string }) => {
    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) return data.error ?? "Could not create account.";
      write({ ...memory, user: { name: user.name, phone: user.phone, email: user.email } });
      return null;
    } catch {
      return "Could not create account.";
    }
  }, []);

  const cartItems = useMemo(
    () =>
      state.cart
        .map((line) => {
          const item = findNumber(line.id);
          return item ? { ...item, qty: line.qty } : null;
        })
        .filter((item): item is VipNumber & { qty: number } => Boolean(item)),
    [state.cart, findNumber],
  );

  const wishItems = useMemo(
    () => state.wishlist.map(findNumber).filter((item): item is VipNumber => Boolean(item)),
    [state.wishlist, findNumber],
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      hydrated,
      numbers: publicData.numbers,
      slides: publicData.slides,
      menus: publicData.menus,
      settings: publicData.settings,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      login,
      logout,
      register,
      findNumber,
      cartItems,
      cartCount: cartItems.length,
      cartTotal: cartItems.reduce((sum, item) => sum + item.price, 0),
      wishItems,
    }),
    [
      state,
      hydrated,
      publicData,
      addToCart,
      removeFromCart,
      clearCart,
      toggleWishlist,
      login,
      logout,
      register,
      findNumber,
      cartItems,
      wishItems,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
