"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, ShoppingCart, Wrench } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface ShopHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export function ShopHeader({ searchQuery, onSearchChange, cartCount, onCartClick }: ShopHeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--shop-gold)]/15 bg-[var(--shop-charcoal)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-1 text-[var(--shop-cream)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shop-charcoal)]"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--shop-gold-soft)] transition-transform group-hover:-translate-x-0.5" />
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-shop-display)" }}
          >
            CrystoFix
          </span>
        </Link>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[var(--shop-gold)]/30 bg-[var(--shop-gold)]/10 px-3 py-1 text-xs font-medium tracking-wide text-[var(--shop-gold-soft)] sm:inline-flex">
          <Wrench className="h-3 w-3" />
          Shop
        </span>

        <div className="hidden flex-1 md:block">
          <SearchBar
            id="shop-search-desktop"
            value={searchQuery}
            onChange={onSearchChange}
            size="sm"
            className="max-w-md"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shop-cream)] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)] md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onCartClick}
            aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--shop-cream)] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--shop-gold)] px-1 text-[11px] font-semibold text-[var(--shop-charcoal)]"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="px-4 pb-3 sm:px-6">
              <SearchBar
                id="shop-search-mobile"
                value={searchQuery}
                onChange={onSearchChange}
                size="sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
