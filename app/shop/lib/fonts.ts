import { Fraunces, Manrope } from "next/font/google";

// Scoped to /shop only — does not touch the app's global font setup.
export const shopDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-shop-display",
  display: "swap",
});

export const shopSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-shop-sans",
  display: "swap",
});
