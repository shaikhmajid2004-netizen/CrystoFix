"use client";

import type { ChangeEvent } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS, type SortOption } from "../types";

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="relative inline-flex items-center">
      <SlidersHorizontal
        aria-hidden="true"
        className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[var(--shop-mist)]"
      />
      <label htmlFor="shop-sort" className="sr-only">
        Sort products
      </label>
      <select
        id="shop-sort"
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value as SortOption)}
        className="appearance-none rounded-full border border-[var(--shop-line)] bg-white py-2 pl-9 pr-8 text-sm font-medium text-[var(--shop-ink)] outline-none transition-colors focus-visible:border-[var(--shop-gold)] focus-visible:ring-2 focus-visible:ring-[var(--shop-gold)]/30"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-[var(--shop-mist)]"
      />
    </div>
  );
}
