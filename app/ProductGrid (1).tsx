"use client";

import type { ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "lg";
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SearchBar({
  id,
  value,
  onChange,
  size = "sm",
  placeholder = "Search parts, brands or vehicle models...",
  label = "Search products",
  className = "",
}: SearchBarProps) {
  const isLarge = size === "lg";

  return (
    <div className={`relative w-full ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shop-mist)] ${
          isLarge ? "h-5 w-5" : "h-4 w-4"
        }`}
      />
      <input
        id={id}
        type="text"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-full border border-[var(--shop-line)] bg-[var(--shop-cream-soft)] text-[var(--shop-ink)] placeholder:text-[var(--shop-mist)] outline-none transition-all duration-200 focus:border-[var(--shop-gold)] focus:ring-2 focus:ring-[var(--shop-gold)]/30 ${
          isLarge ? "py-3.5 pl-12 pr-11 text-base shadow-sm" : "py-2 pl-10 pr-9 text-sm"
        }`}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={`absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-[var(--shop-mist)] transition-colors hover:bg-[var(--shop-line)]/60 hover:text-[var(--shop-ink)] ${
            isLarge ? "h-7 w-7" : "h-6 w-6"
          }`}
        >
          <X className={isLarge ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </button>
      )}
    </div>
  );
}
