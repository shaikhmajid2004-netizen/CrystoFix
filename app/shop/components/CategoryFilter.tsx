"use client";

import { CATEGORIES } from "../data/categories";
import type { CategoryId } from "../types";

interface CategoryFilterProps {
  selected: CategoryId | "all";
  onSelect: (category: CategoryId | "all") => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <nav aria-label="Product categories" className="border-b border-[var(--shop-line)] bg-[var(--shop-cream-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex list-none gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = selected === id;
            return (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-forest)] focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-[var(--shop-forest)] bg-[var(--shop-forest)] text-[var(--shop-cream)]"
                      : "border-[var(--shop-line)] bg-white text-[var(--shop-ink)] hover:border-[var(--shop-gold)] hover:text-[var(--shop-forest)]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
