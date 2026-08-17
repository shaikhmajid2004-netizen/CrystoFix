import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CrystoFix — Premium Automotive Technology Platform",
    template: "%s | CrystoFix",
  },
  description:
    "CrystoFix makes vehicle ownership easier, safer and more transparent with trusted car services, garage partners, pickup & drop, digital service history and automotive parts.",
  applicationName: "CrystoFix",
  keywords: [
    "CrystoFix",
    "car service",
    "car repair",
    "automotive services",
    "garage",
    "car parts",
    "vehicle service history",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
