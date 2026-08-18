"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { discountPercent, formatINR } from "../lib/format";
import type { Product } from "../types";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const BADGE_STYLES: Record<string, string> = {
  Bestseller: "bg-[var(--shop-forest)] text-[var(--shop-cream)]",
  "New Arrival": "bg-[var(--shop-gold)] text-[var(--shop-charcoal)]",
  Sale: "bg-[var(--shop-rust)] text-[var(--shop-cream)]",
  "Limited Stock": "bg-[var(--shop-charcoal)] text-[var(--shop-cream)]",
};

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const categoryLabel = CATEGORIES.find((category) => category.id === product.category)?.label;
  const discount = discountPercent(product.price, product.originalPrice);
  const compatibilityPreview = product.compatibleVehicles.slice(0, 2).join(", ");
  const extraCompatibility = product.compatibleVehicles.length - 2;

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--shop-line)] bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-[var(--shop-forest)]/5"
    >
      <button
        type="button"
        onClick={() => onViewDetails(product)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[var(--shop-cream)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--shop-gold)]"
        aria-label={`View details for ${product.name}`}
      >
        <ProductImage src={product.image} alt={product.name} />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--shop-rust)] shadow-sm">
            {discount}% off
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          {categoryLabel && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--shop-forest)] opacity-80">
              {categoryLabel}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-[var(--shop-ink)]">
            <Star className="h-3.5 w-3.5 fill-[var(--shop-gold)] text-[var(--shop-gold)]" aria-hidden="true" />
            {product.rating.toFixed(1)}
            <span className="text-[var(--shop-mist)]">({product.reviewCount})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="text-left text-[15px] font-semibold leading-snug text-[var(--shop-ink)] transition-colors hover:text-[var(--shop-forest)] focus-visible:outline-none focus-visible:underline"
        >
          {product.name}
        </button>
        <p className="text-xs text-[var(--shop-mist)]">{product.brand}</p>

        <p className="mt-0.5 line-clamp-1 text-xs text-[var(--shop-mist)]">
          Fits: {compatibilityPreview}
          {extraCompatibility > 0 ? ` +${extraCompatibility} more` : ""}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-[var(--shop-ink)]">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-[var(--shop-mist)] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--shop-forest)] px-3.5 py-2 text-xs font-semibold text-[var(--shop-cream)] transition-colors duration-150 hover:bg-[var(--shop-forest-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] focus-visible:ring-offset-2"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
