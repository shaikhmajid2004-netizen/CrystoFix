"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onClearFilters: () => void;
}

export function ProductGrid({ products, onAddToCart, onViewDetails, onClearFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--shop-line)] bg-[var(--shop-cream-soft)] px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <PackageSearch className="h-6 w-6 text-[var(--shop-forest)]" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--shop-ink)]" style={{ fontFamily: "var(--font-shop-display)" }}>
          No parts found
        </h2>
        <p className="mt-1.5 max-w-sm text-sm text-[var(--shop-mist)]">
          Try another search term or clear your filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-full border border-[var(--shop-forest)] px-5 py-2 text-sm font-semibold text-[var(--shop-forest)] transition-colors hover:bg-[var(--shop-forest)] hover:text-[var(--shop-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] focus-visible:ring-offset-2"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div key={product.id} layout exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
