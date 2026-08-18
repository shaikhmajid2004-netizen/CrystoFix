"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatINR } from "../lib/format";
import type { CartItem } from "../types";
import { ProductImage } from "./ProductImage";

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onContinueShopping: () => void;
}

export function CartDrawer({
  open,
  items,
  subtotal,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onContinueShopping,
}: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-[var(--shop-charcoal)]/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative flex h-full w-full max-w-full flex-col bg-[var(--shop-cream-soft)] shadow-2xl sm:max-w-[420px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--shop-line)] px-5 py-4">
              <h2 className="text-lg font-semibold text-[var(--shop-ink)]" style={{ fontFamily: "var(--font-shop-display)" }}>
                Your Cart
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shop-ink)] transition-colors hover:bg-[var(--shop-line)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                  <ShoppingBag className="h-6 w-6 text-[var(--shop-forest)]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-[var(--shop-ink)]">Your cart is empty</h3>
                <p className="mt-1.5 max-w-xs text-sm text-[var(--shop-mist)]">
                  Explore quality automotive parts for your vehicle.
                </p>
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="mt-5 rounded-full bg-[var(--shop-forest)] px-5 py-2.5 text-sm font-semibold text-[var(--shop-cream)] transition-colors hover:bg-[var(--shop-forest-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] focus-visible:ring-offset-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 list-none divide-y divide-[var(--shop-line)] overflow-y-auto px-5">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-3 py-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--shop-line)] bg-[var(--shop-cream)]">
                        <ProductImage src={product.image} alt={product.name} sizes="64px" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug text-[var(--shop-ink)]">{product.name}</p>
                          <button
                            type="button"
                            onClick={() => onRemove(product.id)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="shrink-0 text-[var(--shop-mist)] transition-colors hover:text-[var(--shop-rust)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--shop-mist)]">{formatINR(product.price)}</p>
                        <div className="mt-2 flex items-center gap-2.5 rounded-full border border-[var(--shop-line)] bg-white px-1.5 py-1 w-fit">
                          <button
                            type="button"
                            onClick={() => onDecrease(product.id)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--shop-ink)] transition-colors hover:bg-[var(--shop-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs font-semibold text-[var(--shop-ink)]" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncrease(product.id)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--shop-ink)] transition-colors hover:bg-[var(--shop-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[var(--shop-line)] bg-[var(--shop-cream-soft)] px-5 py-5">
                  <div className="mb-1 flex items-center justify-between text-sm text-[var(--shop-mist)]">
                    <span>Subtotal</span>
                    <span className="text-base font-semibold text-[var(--shop-ink)]">{formatINR(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-[var(--shop-mist)]">Taxes and delivery calculated at checkout.</p>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Checkout is coming in a future update"
                    className="w-full cursor-not-allowed rounded-full bg-[var(--shop-forest)]/40 px-5 py-3 text-sm font-semibold text-[var(--shop-cream)]"
                  >
                    Checkout — Coming Soon
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
