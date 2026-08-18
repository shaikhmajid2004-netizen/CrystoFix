"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CarFront, ShieldCheck, Tag, CircleCheck } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface ShopHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const TRUST_ITEMS = [
  { icon: CircleCheck, label: "Quality Products" },
  { icon: Tag, label: "Clear Pricing" },
  { icon: CarFront, label: "Vehicle Compatibility" },
  { icon: ShieldCheck, label: "Trusted Automotive Platform" },
];

export function ShopHero({ searchQuery, onSearchChange }: ShopHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--shop-charcoal)] via-[var(--shop-charcoal)] to-[var(--shop-forest-deep)]">
      {/* Signature element: a faint instrument-gauge arc, evoking a dial cluster */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 opacity-[0.14] sm:block lg:-right-10"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" stroke="var(--shop-gold)" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="200" cy="200" r="140" stroke="var(--shop-gold)" strokeWidth="1" />
        <path
          d="M 60 260 A 180 180 0 0 1 100 90"
          stroke="var(--shop-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 340 260 A 180 180 0 0 0 300 90"
          stroke="var(--shop-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line x1="200" y1="40" x2="200" y2="65" stroke="var(--shop-gold)" strokeWidth="2" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--shop-gold-soft)]">
            CrystoFix Automotive Shop
          </p>
          <h1
            className="text-3xl leading-tight text-[var(--shop-cream)] sm:text-4xl lg:text-[2.75rem]"
            style={{ fontFamily: "var(--font-shop-display)" }}
          >
            Parts your vehicle can rely on
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--shop-cream)]/70 sm:text-lg">
            Quality automotive parts with clear pricing, trusted products and vehicle compatibility.
          </p>

          <div className="mt-7 max-w-lg">
            <SearchBar
              id="shop-search-hero"
              value={searchQuery}
              onChange={onSearchChange}
              size="lg"
              label="Search products"
            />
          </div>
        </motion.div>

        <motion.dl
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-4"
        >
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0 text-[var(--shop-gold)]" aria-hidden="true" />
              <dt className="sr-only">Trust indicator</dt>
              <dd className="text-xs font-medium text-[var(--shop-cream)]/75 sm:text-sm">{label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
