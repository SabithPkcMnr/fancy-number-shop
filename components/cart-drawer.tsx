"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { inr } from "@/lib/site";
import { useStore } from "@/lib/store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, cartTotal, removeFromCart } = useStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-paper shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="text-sm font-bold uppercase tracking-wider">Bag ({cartItems.length})</h2>
          <button onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <p className="text-muted py-12 text-center">Your Razorpay bag is empty. WhatsApp numbers open chat directly.</p>
          ) : (
            <ul className="space-y-5">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <p className="font-display text-2xl number-digits">{item.pattern}</p>
                    <p className="text-sm text-azure mt-1 font-semibold">{inr(item.price)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase tracking-wider text-muted">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-6 py-5">
          <div className="flex justify-between text-sm mb-4">
            <span className="uppercase tracking-wider text-muted">Subtotal</span>
            <span className="font-semibold">{inr(cartTotal)}</span>
          </div>
          <Link href="/checkout" onClick={onClose} className="btn-primary w-full">
            Checkout
          </Link>
          <Link href="/cart" onClick={onClose} className="block text-center mt-3 text-sm text-muted">
            View bag
          </Link>
        </div>
      </aside>
    </div>
  );
}
