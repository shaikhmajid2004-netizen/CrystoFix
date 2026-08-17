"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cog,
  CreditCard,
  
  FileText,
  Hammer,
  Heart,
  Info,
  
  Mail,
  MapPin,
  Menu,
  Navigation,
  Paintbrush,
  ShoppingCart,
  Star,
  Truck,
  User,
  Warehouse,
  Wrench,
  X,
  
  Zap,
} from "lucide-react";
import { Inter, Manrope, Playfair_Display } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

/* ------------------------------------------------------------------ */
/*  Palette — matches the reference image exactly                      */
/* ------------------------------------------------------------------ */

const C = {
  black: "#02090A",
  darkGreen: "#06352F",
  green: "#0E4A3F",
  gold: "#D8A63A",
  goldBright: "#F2C45A",
  goldGlow: "rgba(216,166,58,0.35)",
  cream: "#F5EBD2",
  textCream: "#F8F3E8",
  subtext: "#A79E8C",
  success: "#32D583",
  error: "#F04438",
};

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  href: string;
  icon: typeof User;
  theme: "green" | "bronze" | "navy";
}

const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    id: "customer",
    title: "Customer",
    description: "Take care of your car with trusted service, transparent pricing and complete visibility.",
    features: ["Book Service", "Pickup & Drop", "Vehicle Problems", "Track Service", "Service History", "Digital Invoice"],
    ctaLabel: "Continue as Customer",
    href: "/dashboard",
    icon: User,
    theme: "green",
  },
  {
    id: "garage",
    title: "Garage Partner",
    description: "Grow your garage with digital bookings, job management and trusted customer relationships.",
    features: ["Booking Requests", "Active Jobs", "Technicians", "Customer Vehicles", "Ratings & Reviews", "Garage Location"],
    ctaLabel: "Continue as Garage Partner",
    href: "/garage/dashboard",
    icon: Warehouse,
    theme: "green",
  },
  {
    id: "shop",
    title: "CrystoFix Shop",
    description: "Discover automotive parts with clear pricing, product details and trusted reviews.",
    features: ["Search Parts", "Categories", "Product Photos", "Price & Ratings", "Add to Cart", "Order Tracking"],
    ctaLabel: "Explore Shop",
    href: "#experience",
    icon: ShoppingCart,
    theme: "bronze",
  },
  {
    id: "about",
    title: "About CrystoFix",
    description: "Learn why we're building India's trusted automotive technology ecosystem.",
    features: ["Our Story", "Mission & Vision", "Trust & Transparency", "How It Works", "Contact Us"],
    ctaLabel: "Discover CrystoFix",
    href: "#experience",
    icon: Info,
    theme: "navy",
  },
];

const SERVICES: { title: string; icon: typeof Wrench }[] = [
  { title: "Car Service", icon: Wrench },
  { title: "Engine Repair", icon: Cog },
  { title: "Electrical Repair", icon: Zap },
  { title: "Denting", icon: Hammer },
  { title: "Painting", icon: Paintbrush },
  { title: "Pickup & Drop", icon: Truck },
  { title: "Vehicle Health", icon: CarFront },
  { title: "Digital History", icon: FileText },
];

interface GaragePartner {
  id: string;
  name: string;
  location: string;
  rating: number;
  servicesLabel: string;
  specialties: string[];
}

const GARAGES: GaragePartner[] = [
  { id: "g1", name: "AutoCare Hub", location: "Marathahalli, Bangalore", rating: 4.7, servicesLabel: "1.2K+ Services", specialties: ["General Service", "Engine Repair", "Denting & Painting"] },
  { id: "g2", name: "SpeedTech Garage", location: "HSR Layout, Bangalore", rating: 4.8, servicesLabel: "980+ Services", specialties: ["Electrical", "AC Repair", "Battery"] },
  { id: "g3", name: "Perfect Wheels", location: "Koramangala, Bangalore", rating: 4.6, servicesLabel: "890+ Services", specialties: ["Painting", "Detailing", "General Service"] },
  { id: "g4", name: "ProFix Automotives", location: "Whitefield, Bangalore", rating: 4.7, servicesLabel: "700+ Services", specialties: ["Engine Repair", "Electrical", "Battery"] },
];

const PROCESS_STEPS: { number: string; label: string; icon: typeof ClipboardList }[] = [
  { number: "01", label: "Choose what you need", icon: ClipboardList },
  { number: "02", label: "Select your vehicle", icon: CarFront },
  { number: "03", label: "Choose service or garage", icon: Wrench },
  { number: "04", label: "Book pickup or visit", icon: Truck },
  { number: "05", label: "Track the work", icon: Navigation },
  { number: "06", label: "Pay securely", icon: CreditCard },
  { number: "07", label: "Receive digital invoice", icon: FileText },
  { number: "08", label: "Review the service", icon: Star },
];

const STATS: { value: string; label: string; icon: typeof Warehouse }[] = [
  { value: "1,250+", label: "Partner Garages", icon: Warehouse },
  { value: "75,000+", label: "Services Completed", icon: CheckCircle2 },
  { value: "50,000+", label: "Vehicles Managed", icon: CarFront },
  { value: "4.8/5", label: "Customer Rating", icon: Star },
];

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  vehicle: string;
}

const TESTIMONIALS: Testimonial[] = [
  { name: "Rajesh Kumar", location: "Bangalore", rating: 5, review: "Excellent service! Pickup & drop was on time and the repair quality is outstanding. Highly recommended!", vehicle: "BMW X5 Series" },
  { name: "Ananya Sharma", location: "Bangalore", rating: 5, review: "CrystoFix made car servicing so easy. Transparent pricing and regular updates are amazing.", vehicle: "Hyundai Creta" },
  { name: "Imran Khan", location: "Bangalore", rating: 4, review: "The digital service history and invoice feature is fantastic. Everything is so professional!", vehicle: "Honda City" },
];

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Customer", href: "/dashboard" },
  { label: "Garage", href: "/garage/dashboard" },
  { label: "Shop", href: "#experience" },
  { label: "About", href: "#experience" },
];

interface FooterLink {
  label: string;
  href?: string;
}

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Customer",
    links: [
      { label: "Book Service", href: "/dashboard" },
      { label: "My Vehicles", href: "/dashboard" },
      { label: "Service History", href: "/dashboard" },
      { label: "Pickup & Drop", href: "/dashboard" },
      { label: "Track Service", href: "/dashboard" },
    ],
  },
  {
    title: "Garage Partner",
    links: [
      { label: "Become a Partner", href: "/garage/dashboard" },
      { label: "Garage Login", href: "/login" },
      { label: "Garage Dashboard", href: "/garage/dashboard" },
      { label: "Resources", href: "#experience" },
      { label: "Support", href: "#experience" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "All Parts", href: "#experience" },
      { label: "Categories", href: "#experience" },
      { label: "My Orders", href: "#experience" },
      { label: "Track Orders", href: "#experience" },
      { label: "Returns", href: "#experience" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#experience" },
      { label: "Contact Us", href: "mailto:support@crystofix.in" },
      { label: "Privacy Policy" },
      { label: "Terms & Conditions" },
      { label: "Careers", href: "#experience" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function GoldWord({ children }: { children: ReactNode }) {
  return <span style={{ color: C.gold }}>{children}</span>;
}

function SectionHeading({
  title,
  goldWord,
  subtitle,
  align = "center",
}: {
  title: string;
  goldWord: string;
  subtitle: string;
  align?: "center" | "left";
}) {
  const parts = title.split(goldWord);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}
    >
      <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
        {parts[0]}
        <GoldWord>{goldWord}</GoldWord>
        {parts[1]}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.subtext }}>
        {subtitle}
      </p>
    </motion.div>
  );
}

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? C.gold : "none"}
          stroke={C.gold}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal (used for garage details)                                     */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default"
            style={{ backgroundColor: "rgba(2,9,10,0.75)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{ backgroundColor: "#0B0E10", border: `1px solid ${C.gold}55`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.gold}25` }}>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:scale-105"
                style={{ backgroundColor: `${C.gold}1a`, color: C.gold }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Bespoke hero artwork — luxury vehicle inside a premium workshop      */
/* ------------------------------------------------------------------ */

function HeroArtwork() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Premium vehicle inside a modern CrystoFix workshop"
    >
     <img
  src="/crystofix-hero-car.jpg"
  alt="Premium vehicle inside a modern CrystoFix workshop"
  className="h-full w-full object-cover object-center"
/>
      {/* Premium CrystoFix lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,167,61,0.16),transparent_48%),linear-gradient(180deg,rgba(0,8,7,0.08),rgba(0,8,7,0.22)_55%,rgba(0,8,7,0.52))]" />

      {/* Green luxury atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 65%, rgba(11,82,65,0.18), transparent 55%)",
        }}
      />

      {/* Cinematic gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: `inset 0 0 90px ${C.gold}18`,
        }}
      />

      {/* Gold premium frame */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          border: `1.5px solid ${C.gold}`,
          boxShadow: `0 0 32px ${C.gold}28, inset 0 0 35px ${C.gold}12`,
        }}
      />

      {/* Workshop label */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center text-[10px] tracking-[0.45em]"
        style={{
          color: C.gold,
          opacity: 0.78,
          fontFamily: "var(--font-inter)",
          textShadow: `0 0 12px ${C.gold}55`,
        }}
      >
        CRYSTOFIX PREMIUM WORKSHOP
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact car glyph — used in the final CTA banner                    */
/* ------------------------------------------------------------------ */

function CompactCarGlyph() {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full" role="img" aria-label="Illustration of a CrystoFix serviced vehicle">
      <path
        d="M20 100 Q20 84 42 80 L64 80 Q80 44 118 36 L180 36 Q212 44 228 80 L238 80 Q252 84 252 100 L252 108
           Q252 116 242 116 L226 116 Q222 130 204 130 Q186 130 182 116 L96 116 Q92 130 74 130 Q56 130 52 116 L34 116
           Q20 116 20 108 Z"
        fill={C.darkGreen}
        stroke={C.cream}
        strokeWidth="2"
      />
      <path d="M76 80 Q88 52 118 44 L180 44 Q204 52 216 80 Z" fill="none" stroke={C.cream} strokeOpacity="0.8" strokeWidth="1.4" />
      <circle cx="74" cy="116" r="15" fill="#0A1512" stroke={C.cream} strokeWidth="2.4" />
      <circle cx="204" cy="116" r="15" fill="#0A1512" stroke={C.cream} strokeWidth="2.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Garage card scene — bespoke mini workshop art, varied per card       */
/* ------------------------------------------------------------------ */

function GarageCardArt({ seed }: { seed: number }) {
  const carX = 90 + (seed % 3) * 6;
  const glowCx = 40 + (seed % 4) * 8;
  return (
    <svg viewBox="0 0 270 130" className="h-full w-full" role="img" aria-label="Illustration of a CrystoFix partner garage workshop">
      <defs>
        <radialGradient id={`garageGlow-${seed}`} cx={`${glowCx}%`} cy="20%" r="70%">
          <stop offset="0%" stopColor={C.goldBright} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.goldBright} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`garageFloor-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.darkGreen} stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="270" height="130" fill={C.darkGreen} />
      <rect x="0" y="0" width="270" height="130" fill={`url(#garageGlow-${seed})`} />
      {/* garage door slats */}
      {[16, 30, 44, 58].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="270" y2={y} stroke={C.gold} strokeOpacity="0.14" strokeWidth="1" />
      ))}
      <line x1="0" y1="88" x2="270" y2="88" stroke={C.gold} strokeOpacity="0.35" strokeWidth="1.2" />
      <rect x="0" y="88" width="270" height="42" fill={`url(#garageFloor-${seed})`} />
      {/* pendant light */}
      <line x1={carX + 30} y1="0" x2={carX + 30} y2="30" stroke={C.gold} strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx={carX + 30} cy="34" r="16" fill={`url(#garageGlow-${seed})`} />
      {/* simplified vehicle */}
      <path
        d={`M${carX - 55} 92 Q${carX - 55} 80 ${carX - 40} 77 L${carX - 20} 77 Q${carX - 8} 55 ${carX + 15} 50 L${carX + 55} 50 Q${carX + 78} 55 ${carX + 90} 77 L${carX + 105} 77 Q${carX + 120} 80 ${carX + 120} 92 L${carX + 120} 98
           Q${carX + 120} 104 ${carX + 112} 104 L${carX + 98} 104 Q${carX + 95} 114 ${carX + 82} 114 Q${carX + 69} 114 ${carX + 66} 104 L${carX - 6} 104 Q${carX - 9} 114 ${carX - 22} 114 Q${carX - 35} 114 ${carX - 38} 104 L${carX - 50} 104
           Q${carX - 55} 104 ${carX - 55} 98 Z`}
        fill={C.green}
        stroke={C.goldBright}
        strokeWidth="1.6"
      />
      <circle cx={carX - 22} cy="104" r="9" fill="#04100D" stroke={C.gold} strokeWidth="1.6" />
      <circle cx={carX + 82} cy="104" r="9" fill="#04100D" stroke={C.gold} strokeWidth="1.6" />
      {[[24, 22, 1.4], [244, 30, 1.2], [14, 70, 1.3]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={C.goldBright} fillOpacity="0.75" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */

export default function CrystoFixLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [garageModalId, setGarageModalId] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const garageScrollRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const activeGarage = GARAGES.find((g) => g.id === garageModalId) || null;

  function scrollGarages(direction: 1 | -1): void {
    garageScrollRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  function nextTestimonial(): void {
    setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
  }

  function prevTestimonial(): void {
    setTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  const cardThemeStyle: Record<ExperienceCard["theme"], { background: string; iconBg: string }> = {
    green: { background: `linear-gradient(160deg, ${C.darkGreen} 0%, ${C.green} 100%)`, iconBg: "#04100D" },
    bronze: { background: "linear-gradient(160deg, #3B2A11 0%, #1E1408 100%)", iconBg: "#170F05" },
    navy: { background: "linear-gradient(160deg, #0D1926 0%, #060C14 100%)", iconBg: "#050A10" },
  };

  return (
    <div
      className={`${playfair.variable} ${inter.variable} ${manrope.variable} relative min-h-screen overflow-x-hidden`}
      style={{ backgroundColor: C.black, fontFamily: "var(--font-inter)", color: C.textCream }}
    >
      {/* ---------------------------------------------------------- */}
      {/*  Ambient background — layered, section-aware atmosphere      */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundColor: C.black }}>
        <div
  className="absolute inset-0"
  style={{
    background:
  "radial-gradient(1100px 650px at 10% 5%, rgba(216,166,58,0.16), transparent 60%), " +
  "radial-gradient(1000px 620px at 100% 10%, rgba(22,105,86,0.32), transparent 55%), " +
  "radial-gradient(1050px 650px at 50% 25%, rgba(18,91,76,0.24), transparent 60%), " +
  "radial-gradient(900px 580px at 88% 38%, rgba(216,166,58,0.10), transparent 60%), " +
  "radial-gradient(1000px 620px at 12% 50%, rgba(18,91,76,0.22), transparent 55%), " +
  "radial-gradient(950px 600px at 85% 65%, rgba(216,166,58,0.12), transparent 60%), " +
  "linear-gradient(180deg, #0B1815 0%, #0A1714 30%, #091512 60%, #081310 100%)",
  }}
/>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Header                                                       */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: `${C.black}f0`, borderColor: `${C.gold}30` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" transform="rotate(45 20 20)" stroke={C.gold} strokeWidth="1.6" />
              <path d="M13 24 L16 15 H24 L27 24" stroke={C.gold} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
              <circle cx="16.5" cy="24.5" r="2" stroke={C.gold} strokeWidth="1.4" />
              <circle cx="23.5" cy="24.5" r="2" stroke={C.gold} strokeWidth="1.4" />
            </svg>
            <div className="leading-tight">
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
                CrystoFix
              </p>
              <p className="-mt-0.5 text-[9px] uppercase tracking-[0.18em]" style={{ color: C.gold }}>
                Your Car. Our Commitment.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[#D8A63A]"
                style={{ color: C.textCream }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-full px-5 py-2 text-sm font-semibold transition hover:scale-[1.03]"
              style={{ border: `1px solid ${C.textCream}55`, color: C.textCream }}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full px-5 py-2 text-sm font-bold transition hover:scale-[1.03]"
              style={{ backgroundColor: C.gold, color: "#1A1300" }}
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full lg:hidden"
            style={{ border: `1px solid ${C.gold}55`, color: C.gold }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden lg:hidden"
              style={{ borderTop: `1px solid ${C.gold}25`, backgroundColor: C.black }}
            >
              <div className="flex flex-col gap-1 px-5 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium"
                    style={{ color: C.textCream }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full py-2.5 text-center text-sm font-semibold"
                    style={{ border: `1px solid ${C.textCream}55`, color: C.textCream }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full py-2.5 text-center text-sm font-bold"
                    style={{ backgroundColor: C.gold, color: "#1A1300" }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* ---------------------------------------------------------- */}
        {/*  Hero                                                         */}
        {/* ---------------------------------------------------------- */}
        <section className="grid grid-cols-1 gap-10 pt-10 sm:pt-14 lg:grid-cols-2 lg:items-center lg:gap-12">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span style={{ color: C.textCream }}>Your Car.</span>
              <br />
              <span style={{ color: C.gold }}>Our Commitment.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: C.subtext }}>
              Book trusted automotive services, manage your vehicle, track repairs and discover genuine parts — all in one place.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#experience"
                className="rounded-full px-6 py-3.5 text-sm font-bold transition hover:scale-[1.03]"
                style={{ backgroundColor: C.gold, color: "#1A1300", boxShadow: `0 14px 34px ${C.goldGlow}` }}
              >
                Explore CrystoFix
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:scale-[1.03]"
                style={{ backgroundColor: "#0C1210", color: C.textCream, border: `1px solid ${C.textCream}30` }}
              >
                Book a Service <ArrowRight size={15} />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["#0E4A3F", "#D8A63A", "#6B4A1E"].map((bg, i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full"
                      style={{ backgroundColor: bg, border: `2px solid ${C.black}` }}
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold" style={{ color: C.gold }}>
                    Trusted by 50,000+
                  </p>
                  <p className="text-xs" style={{ color: C.subtext }}>
                    Customers across India
                  </p>
                </div>
              </div>
              <div className="h-9 w-px" style={{ backgroundColor: `${C.textCream}20` }} />
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: C.gold }}>
                    4.8
                  </span>
                  <StarRow rating={4.8} />
                </div>
                <p className="mt-0.5 text-xs" style={{ color: C.subtext }}>
                  Customer Rating
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
              transition={shouldReduceMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]"
              style={{ border: `1.5px solid ${C.gold}`, boxShadow: `0 0 0 1px ${C.goldGlow}, 0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${C.goldGlow}` }}
            >
              <HeroArtwork />
            </motion.div>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Four experience cards                                       */}
        {/* ---------------------------------------------------------- */}
        <section id="experience" className="scroll-mt-20 pt-24 sm:pt-28">
          <SectionHeading
            title="Choose Your CrystoFix Experience"
            goldWord="CrystoFix"
            subtitle="Everything you need for your car, in one trusted platform."
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {EXPERIENCE_CARDS.map((card) => {
              const theme = cardThemeStyle[card.theme];
              return (
                <motion.div
                  key={card.id}
                  variants={fadeUp}
                  whileHover={{
  y: -8,
  scale: 1.015,
  boxShadow: `0 28px 65px rgba(0,0,0,0.48), 0 0 34px ${C.goldGlow}`,
}}
transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex flex-col rounded-3xl p-6"
                  style={{ background: theme.background, border: `1.5px solid ${C.gold}70`, boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: theme.iconBg, border: `1.5px solid ${C.gold}` }}>
                    <card.icon size={24} style={{ color: C.gold }} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: C.subtext }}>
                    {card.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: C.textCream }}>
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${C.gold}25` }}>
                          <Check size={10} style={{ color: C.goldBright }} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className="mt-6 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition hover:scale-[1.02]"
                    style={{ backgroundColor: C.gold, color: "#1A1300" }}
                  >
                    {card.ctaLabel} <ArrowRight size={15} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Automotive services                                         */}
        {/* ---------------------------------------------------------- */}
        <section className="pt-24 sm:pt-28">
          <SectionHeading title="Our Automotive Services" goldWord="Services" subtitle="Professional care for every part of your vehicle." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8"
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: C.gold }}
                className="flex flex-col items-center gap-3 rounded-2xl px-3 py-6 text-center"
                style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}25` }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full" style={{ border: `1.5px solid ${C.green}` }}>
                  <s.icon size={19} style={{ color: C.goldBright }} />
                </div>
                <p className="text-xs font-semibold" style={{ color: C.textCream }}>
                  {s.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Trusted garage partners                                     */}
        {/* ---------------------------------------------------------- */}
        <section id="garages" className="scroll-mt-20 pt-24 sm:pt-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="left"
              title="Trusted Garage Partners"
              goldWord="Garage"
              subtitle="Verified garages. Quality service. Happy customers."
            />
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Link
                href="#garages"
                className="inline-block rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{ border: `1px solid ${C.gold}70`, color: C.gold }}
              >
                View All Garages
              </Link>
            </motion.div>
          </div>

          <div className="relative mt-8">
            <motion.div
              ref={garageScrollRef}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="flex gap-5 overflow-x-auto pb-2"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
            >
              {GARAGES.map((g, i) => (
                <motion.div
                  key={g.id}
                  variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: `0 20px 45px rgba(0,0,0,0.5), 0 0 26px ${C.goldGlow}` }}
                  className="group w-[290px] shrink-0 overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}30`, scrollSnapAlign: "start" }}
                >
                  <div className="relative h-36 overflow-hidden">
                    <motion.div className="h-full w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                      <img
  src={`/garage-${i + 1}.jpg`}
  alt={`${g.name} workshop`}
  className="h-full w-full object-cover"
  loading="lazy"
/>
                    </motion.div>
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ boxShadow: `inset 0 0 40px ${C.goldGlow}` }}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-bold" style={{ color: C.textCream }}>
                      {g.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: C.subtext }}>
                      <MapPin size={11} /> {g.location}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 font-semibold" style={{ color: C.gold }}>
                        <Star size={12} fill={C.gold} stroke={C.gold} /> {g.rating}
                      </span>
                      <span style={{ color: `${C.subtext}80` }}>•</span>
                      <span style={{ color: C.subtext }}>{g.servicesLabel}</span>
                    </div>
                    <button
                      onClick={() => setGarageModalId(g.id)}
                      className="mt-4 w-full rounded-full py-2.5 text-xs font-semibold transition hover:scale-[1.02]"
                      style={{ border: `1px solid ${C.gold}60`, color: C.gold }}
                    >
                      View Garage
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <button
              onClick={() => scrollGarages(1)}
              aria-label="Scroll garages right"
              className="absolute -right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full sm:grid"
              style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}55`, color: C.gold }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  How CrystoFix works + by the numbers                        */}
        {/* ---------------------------------------------------------- */}
        <section className="grid grid-cols-1 gap-14 pt-24 sm:pt-28 lg:grid-cols-2 lg:gap-10">
          <div>
            <SectionHeading align="left" title="How CrystoFix Works" goldWord="CrystoFix" subtitle="Simple steps for a smooth experience." />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="relative mt-10 grid grid-cols-4 gap-x-3 gap-y-8 sm:grid-cols-8"
            >
              <div className="absolute left-0 right-0 top-7 hidden h-px sm:block" style={{ backgroundColor: `${C.gold}25` }} />
              {PROCESS_STEPS.map((step) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center gap-2.5 text-center"
                >
                  <div className="relative">
                    <div
                      className="relative z-10 grid h-14 w-14 place-items-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: "#0B0F0E", border: `1.5px solid ${C.gold}`, color: C.gold }}
                    >
                      {step.number}
                    </div>
                    <div
                      className="absolute -right-1 -top-1 z-20 grid h-5 w-5 place-items-center rounded-full"
                      style={{ backgroundColor: C.green, border: `1px solid ${C.gold}` }}
                    >
                      <step.icon size={10} style={{ color: C.goldBright }} />
                    </div>
                  </div>
                  <p className="text-[11px] leading-tight sm:text-xs" style={{ color: C.subtext }}>
                    {step.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <SectionHeading align="left" title="CrystoFix by the Numbers" goldWord="Numbers" subtitle="Growing every day with your trust." />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-10 grid grid-cols-2 gap-5"
            >
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  whileHover={{ y: -4, borderColor: C.gold }}
                  className="rounded-2xl p-6"
                  style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}30` }}
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-4 grid h-12 w-12 place-items-center rounded-xl"
                    style={{ backgroundColor: `${C.green}40` }}
                  >
                    <s.icon size={20} style={{ color: C.goldBright }} />
                  </motion.div>
                  <p className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-sm" style={{ color: C.subtext }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Testimonials                                                */}
        {/* ---------------------------------------------------------- */}
        <section className="pt-24 sm:pt-28">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full sm:hidden"
              style={{ border: `1px solid ${C.gold}55`, color: C.gold }}
            >
              <ChevronLeft size={16} />
            </button>
            <SectionHeading title="What Our Customers Say" goldWord="Customers" subtitle="Real stories from real drivers" />
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full sm:hidden"
              style={{ border: `1px solid ${C.gold}55`, color: C.gold }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* mobile: one at a time */}
          <div className="mt-8 sm:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}30` }}
              >
                <TestimonialContent t={TESTIMONIALS[testimonialIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* desktop/tablet: full grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-8 hidden grid-cols-1 gap-5 sm:grid sm:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl p-6" style={{ backgroundColor: "#0B0F0E", border: `1px solid ${C.gold}30` }}>
                <TestimonialContent t={t} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Final CTA                                                    */}
        {/* ---------------------------------------------------------- */}
        <section className="pt-24 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-14 sm:py-16"
            style={{ background: `linear-gradient(120deg, ${C.cream} 0%, #EFE0BC 100%)` }}
          >
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[240px_1fr_220px]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="hidden h-40 w-full lg:block"
              >
                <img
  src="/crystofix-hero-car.jpg"
  alt="Premium CrystoFix vehicle"
  className="h-full w-full object-cover object-center"
/>
              </motion.div>

              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                  Ready to take better care of your car?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed lg:mx-0" style={{ color: "#4A4030" }}>
                  From trusted repairs to digital vehicle history, CrystoFix brings your entire car-care experience into one platform.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3.5 lg:justify-start">
                  <Link
                    href="/dashboard"
                    className="rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:scale-[1.03]"
                    style={{ backgroundColor: C.darkGreen }}
                  >
                    Book a Service
                  </Link>
                  <Link
                    href="#experience"
                    className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition hover:scale-[1.03]"
                    style={{ border: `1.5px solid ${C.darkGreen}`, color: C.darkGreen }}
                  >
                    Explore CrystoFix <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto hidden w-40 lg:block"
              >
                <div className="mx-auto w-40 overflow-hidden rounded-2xl" style={{ border: `2px solid ${C.darkGreen}`, backgroundColor: "#0B0F0E" }}>
                  <div className="px-3.5 py-2.5" style={{ borderBottom: `1px solid ${C.gold}40` }}>
                    <p className="text-[10px] font-bold" style={{ color: C.gold, fontFamily: "var(--font-playfair)" }}>
                      CrystoFix
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3">
                    <div className="h-8 rounded-md" style={{ backgroundColor: `${C.green}55` }} />
                    <div className="h-2.5 w-3/4 rounded-full" style={{ backgroundColor: `${C.gold}40` }} />
                    <div className="h-2.5 w-1/2 rounded-full" style={{ backgroundColor: `${C.gold}25` }} />
                    <div className="h-10 rounded-md" style={{ backgroundColor: `${C.green}35` }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/*  Footer                                                       */}
      {/* ---------------------------------------------------------- */}
      <footer className="mt-24 sm:mt-28" style={{ borderTop: `1px solid ${C.gold}20` }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl px-5 py-16 sm:px-8"
        >
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                  <rect x="2" y="2" width="36" height="36" rx="10" transform="rotate(45 20 20)" stroke={C.gold} strokeWidth="1.6" />
                  <path d="M13 24 L16 15 H24 L27 24" stroke={C.gold} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
                </svg>
                <p className="text-base font-bold" style={{ fontFamily: "var(--font-playfair)", color: C.textCream }}>
                  CrystoFix
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.subtext }}>
                Making vehicle ownership simpler, safer and smarter.
              </p>
              <div className="mt-5 flex gap-2.5">
                
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-bold" style={{ color: C.textCream }}>
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) =>
                    link.href ? (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm transition-colors hover:text-[#F2C45A]" style={{ color: C.subtext }}>
                          {link.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <span className="text-sm" style={{ color: `${C.subtext}80` }}>
                          {link.label}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-14 flex flex-col items-center justify-between gap-3 pt-6 text-xs sm:flex-row"
            style={{ borderTop: `1px solid ${C.gold}20`, color: C.subtext }}
          >
            <p>© 2025 CrystoFix. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              India&apos;s Most Trusted Automotive Platform <Heart size={12} fill={C.gold} stroke={C.gold} />
            </p>
          </div>
        </motion.div>
      </footer>

      {/* ---------------------------------------------------------- */}
      {/*  Garage detail modal                                         */}
      {/* ---------------------------------------------------------- */}
      <Modal open={!!garageModalId} onClose={() => setGarageModalId(null)} title={activeGarage?.name ?? "Garage Partner"}>
        {activeGarage ? (
          <div className="space-y-4">
            <div className="flex h-28 items-center justify-center rounded-2xl" style={{ background: `linear-gradient(150deg, ${C.green}, ${C.darkGreen})` }}>
              <Warehouse size={40} style={{ color: C.goldBright }} strokeWidth={1.3} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5" style={{ color: C.subtext }}>
                <MapPin size={13} /> {activeGarage.location}
              </span>
              <span className="flex items-center gap-1 font-semibold" style={{ color: C.gold }}>
                <Star size={13} fill={C.gold} stroke={C.gold} /> {activeGarage.rating}
              </span>
            </div>
            <p className="text-sm" style={{ color: C.subtext }}>
              {activeGarage.servicesLabel} completed on CrystoFix.
            </p>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: C.subtext }}>
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {activeGarage.specialties.map((s) => (
                  <span key={s} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${C.gold}18`, color: C.gold }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold"
              style={{ backgroundColor: C.gold, color: "#1A1300" }}
            >
              Book with {activeGarage.name} <ArrowRight size={15} />
            </Link>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonial content (shared by mobile + desktop layouts)            */
/* ------------------------------------------------------------------ */

function TestimonialContent({ t }: { t: Testimonial }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold"
          style={{ background: `linear-gradient(145deg, ${C.goldBright}, ${C.gold})`, color: "#1A1300" }}
        >
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: C.textCream }}>
            {t.name}
          </p>
          <p className="text-xs" style={{ color: C.subtext }}>
            {t.location}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <StarRow rating={t.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: C.subtext }}>
        {t.review}
      </p>
      <p className="mt-3 text-xs font-semibold" style={{ color: C.gold }}>
        {t.vehicle}
      </p>
    </div>
  );
}
