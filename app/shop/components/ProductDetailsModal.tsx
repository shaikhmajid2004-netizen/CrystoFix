"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Star, X } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { discountPercent, formatINR } from "../lib/format";
import type { Product } from "../types";
import { ProductImage } from "./ProductImage";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      closeButtonRef.current?.focus();
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  const categoryLabel = product
    ? CATEGORIES.find((category) => category.id === product.category)?.label
    : undefined;
  const discount = product ? discountPercent(product.price, product.originalPrice) : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-[var(--shop-charcoal)]/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-3xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--shop-ink)] shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
            >
              <X className="h-[18px] w-[18px]" />
            </button>

            <div className="overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative aspect-[4/3] w-full bg-[var(--shop-cream)] sm:aspect-auto sm:h-full">
                  <ProductImage src={product.image} alt={product.name} sizes="(min-width: 640px) 50vw, 100vw" priority />
                  {product.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--shop-forest)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--shop-cream)]">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4 p-5 sm:p-7">
                  {categoryLabel && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--shop-forest)]">
                      {categoryLabel}
                    </span>
                  )}
                  <div>
                    <h2
                      id="product-details-title"
                      className="text-xl font-semibold leading-snug text-[var(--shop-ink)] sm:text-2xl"
                      style={{ fontFamily: "var(--font-shop-display)" }}
                    >
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--shop-mist)]">{product.brand}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-[var(--shop-gold)] text-[var(--shop-gold)]" aria-hidden="true" />
                    <span className="font-medium text-[var(--shop-ink)]">{product.rating.toFixed(1)}</span>
                    <span className="text-[var(--shop-mist)]">({product.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-[var(--shop-ink)]">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[var(--shop-mist)] line-through">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                    {discount && (
                      <span className="text-sm font-semibold text-[var(--shop-rust)]">{discount}% off</span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--shop-ink)]/80">{product.description}</p>

                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--shop-mist)]">
                      Compatible vehicles
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.compatibleVehicles.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="rounded-full border border-[var(--shop-line)] bg-[var(--shop-cream-soft)] px-2.5 py-1 text-xs text-[var(--shop-ink)]"
                        >
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-[var(--shop-line)] pt-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 rounded-full border border-[var(--shop-line)] px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--shop-ink)] transition-colors hover:bg-[var(--shop-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold text-[var(--shop-ink)]" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((qty) => qty + 1)}
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--shop-ink)] transition-colors hover:bg-[var(--shop-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product, quantity)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--shop-forest)] px-5 py-3 text-sm font-semibold text-[var(--shop-cream)] transition-colors hover:bg-[var(--shop-forest-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] focus-visible:ring-offset-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
