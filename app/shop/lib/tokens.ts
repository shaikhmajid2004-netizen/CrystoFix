import type { CSSProperties } from "react";

// CrystoFix Shop palette — deep forest green, near-black charcoal and a
// restrained champagne gold accent on a warm cream base. Defined as CSS
// custom properties scoped to the shop wrapper so nothing here touches
// the app's global Tailwind theme or globals.css.
export const shopTokens = {
  "--shop-forest": "#163826",
  "--shop-forest-deep": "#0E2419",
  "--shop-charcoal": "#15161B",
  "--shop-charcoal-soft": "#1E2025",
  "--shop-gold": "#C6A15B",
  "--shop-gold-soft": "#E3D2A6",
  "--shop-cream": "#F6F1E6",
  "--shop-cream-soft": "#FBF8F2",
  "--shop-ink": "#1B1D1A",
  "--shop-mist": "#6E7268",
  "--shop-line": "#E3DAC6",
  "--shop-rust": "#B3492F",
} as CSSProperties;

export const shopDisplayFont: CSSProperties = {
  fontFamily: "var(--font-shop-display)",
};

export const shopSansFont: CSSProperties = {
  fontFamily: "var(--font-shop-sans)",
};
