"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Award,
  Bell,
  CarFront,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Download,
  Eye,
  Fuel,
  Gauge,
  History as HistoryIcon,
  Home,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Phone,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Truck,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { Cormorant_Garamond, Inter, Manrope, Playfair_Display } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
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
/*  Palette (as specified)                                             */
/* ------------------------------------------------------------------ */

const C = {
  darkGreen: "#0E2A1F",
  green: "#163F2D",
  hoverGreen: "#1E5A40",
  gold: "#C8A03A",
  goldLight: "#E6C466",
  goldGlow: "rgba(200,160,58,0.25)",
  cream: "#F8F4EA",
  creamSecondary: "#FFF8EE",
  card: "#FFFDF8",
  text: "#1A1A1A",
  subtext: "#6B6B6B",
  success: "#32D583",
  warning: "#F5B942",
  error: "#F04438",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  regNumber: string;
  healthScore: number;
  lastService: string;
}

interface ServiceRecord {
  id: string;
  name: string;
  vehicle: string;
  date: string;
  cost: number;
  status: "Completed" | "In Progress";
}

interface InvoiceRecord {
  id: string;
  number: string;
  date: string;
  amount: number;
  vehicle: string;
}

interface TimelineStep {
  label: string;
  detail: string;
  status: "completed" | "active" | "upcoming";
  icon: typeof PackageCheck;
}

interface ToastItem {
  id: number;
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const CUSTOMER = {
  name: "Abdul Majid",
  id: "CRY-2026-001",
  mobile: "+91 98450 12345",
  address: "HSR Layout, Bengaluru, Karnataka",
  membership: "Premium Member",
  memberSince: "Member since Jan 2026",
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "v1",
    brand: "Honda",
    model: "City",
    year: 2023,
    color: "Pearl White",
    fuelType: "Petrol",
    regNumber: "KA01 AB 1234",
    healthScore: 92,
    lastService: "12 Jul 2026",
  },
  {
    id: "v2",
    brand: "Hyundai",
    model: "Creta",
    year: 2022,
    color: "Titan Grey",
    fuelType: "Diesel",
    regNumber: "KA05 CD 5678",
    healthScore: 87,
    lastService: "02 Jun 2026",
  },
];

const ACTIVE_SERVICE = {
  vehicle: "Honda City · KA01 AB 1234",
  serviceType: "Full Car Service",
  eta: "Today, 6:30 PM",
};

const TIMELINE: TimelineStep[] = [
  { label: "Vehicle Received", detail: "9:10 AM", status: "completed", icon: PackageCheck },
  { label: "Inspection", detail: "9:45 AM", status: "completed", icon: ClipboardList },
  { label: "Repair", detail: "In progress", status: "active", icon: Wrench },
  { label: "Quality Check", detail: "Pending", status: "upcoming", icon: ClipboardCheck },
  { label: "Ready", detail: "Pending", status: "upcoming", icon: CheckCircle2 },
];

const TIMELINE_PROGRESS = (() => {
  const activeIdx = TIMELINE.findIndex((s) => s.status === "active");
  const completed = TIMELINE.filter((s) => s.status === "completed").length;
  const ratio = activeIdx >= 0 ? (activeIdx + 0.5) / (TIMELINE.length - 1) : completed / (TIMELINE.length - 1);
  return Math.round(ratio * 100);
})();

const SERVICE_HISTORY: ServiceRecord[] = [
  { id: "s1", name: "Full Car Service", vehicle: "Honda City", date: "12 Jul 2026", cost: 4850, status: "Completed" },
  { id: "s2", name: "Engine Diagnostics & Repair", vehicle: "Hyundai Creta", date: "02 Jun 2026", cost: 12600, status: "Completed" },
  { id: "s3", name: "Denting & Painting", vehicle: "Honda City", date: "18 Apr 2026", cost: 8200, status: "Completed" },
  { id: "s4", name: "Battery & Electrical Check", vehicle: "Hyundai Creta", date: "05 Mar 2026", cost: 2100, status: "Completed" },
];

const INVOICES: InvoiceRecord[] = [
  { id: "i1", number: "INV-2026-0741", date: "12 Jul 2026", amount: 4850, vehicle: "Honda City · KA01 AB 1234" },
  { id: "i2", number: "INV-2026-0612", date: "02 Jun 2026", amount: 12600, vehicle: "Hyundai Creta · KA05 CD 5678" },
  { id: "i3", number: "INV-2026-0398", date: "18 Apr 2026", amount: 8200, vehicle: "Honda City · KA01 AB 1234" },
];

const NOTIFICATIONS = [
  { id: "n1", title: "Service reminder", detail: "Honda City is due for inspection in 3 days.", time: "2h ago" },
  { id: "n2", title: "Invoice generated", detail: "INV-2026-0741 is ready to download.", time: "1d ago" },
  { id: "n3", title: "Pickup confirmed", detail: "Driver will arrive by 9:00 AM tomorrow.", time: "2d ago" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "actions", label: "Services", icon: Wrench },
  { id: "history", label: "History", icon: HistoryIcon },
  { id: "profile", label: "Profile", icon: UserRound },
] as const;

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: C.gold }}
    >
      <span className="h-px w-6" style={{ backgroundColor: C.gold }} />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-8 max-w-2xl"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-3 text-3xl font-semibold sm:text-4xl lg:text-[2.5rem]"
        style={{ fontFamily: "var(--font-playfair)", color: C.text }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.subtext }}>
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal shell                                                        */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default"
            style={{ backgroundColor: "rgba(14,42,31,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.gold}55`,
              boxShadow: "0 30px 80px rgba(14,42,31,0.35)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${C.gold}30` }}
            >
              <h3
                className="text-xl"
                style={{ fontFamily: "var(--font-playfair)", color: C.text }}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:scale-105"
                style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
              >
                <X size={18} />
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
/*  Hero artwork — bespoke gold line-art of a luxury workshop           */
/* ------------------------------------------------------------------ */

function HeroArtwork() {
  return (
    <svg viewBox="0 0 600 560" className="h-full w-full" role="img" aria-label="Illustration of a premium automotive workshop">
      <defs>
        <radialGradient id="glow" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#E6C466" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E6C466" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E2A1F" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C4A34" />
          <stop offset="100%" stopColor="#0E2A1F" />
        </linearGradient>
        <linearGradient id="warmWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A03A" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#0E2A1F" stopOpacity="0" />
          <stop offset="100%" stopColor="#C8A03A" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="600" height="560" fill="#0E2A1F" />
      <rect x="0" y="0" width="600" height="560" fill="url(#warmWash)" />
      <circle cx="300" cy="140" r="280" fill="url(#glow)" />
      <circle cx="300" cy="140" r="280" fill="url(#glow)" opacity="0.5" />

      {/* wall branding */}
      <text
        x="300"
        y="82"
        textAnchor="middle"
        fill="#E6C466"
        fillOpacity="0.28"
        fontSize="30"
        letterSpacing="10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        CRYSTOFIX
      </text>

      {/* garage arch */}
      <path
        d="M110 500 V230 Q110 120 300 120 Q490 120 490 230 V500"
        fill="none"
        stroke="#E6C466"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path
        d="M150 500 V245 Q150 155 300 155 Q450 155 450 245 V500"
        fill="none"
        stroke="#E6C466"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* tool cabinet, left */}
      <g opacity="0.9">
        <rect x="56" y="330" width="58" height="94" rx="4" fill="#122E22" stroke="#E6C466" strokeOpacity="0.55" strokeWidth="1.3" />
        <line x1="56" y1="360" x2="114" y2="360" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="56" y1="390" x2="114" y2="390" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="85" cy="346" r="1.6" fill="#E6C466" fillOpacity="0.7" />
        <circle cx="85" cy="376" r="1.6" fill="#E6C466" fillOpacity="0.7" />
        <circle cx="85" cy="406" r="1.6" fill="#E6C466" fillOpacity="0.7" />
      </g>

      {/* pendant lamp, warmer glow */}
      <line x1="300" y1="60" x2="300" y2="150" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M282 150 L318 150 L308 174 L292 174 Z" fill="#E6C466" fillOpacity="0.85" />
      <circle cx="300" cy="190" r="46" fill="url(#glow)" />
      <circle cx="300" cy="190" r="20" fill="#E6C466" fillOpacity="0.12" />

      {/* scattered sparkle dots */}
      {[
        [95, 120, 2.2],
        [500, 140, 1.8],
        [130, 340, 1.6],
        [470, 360, 2],
        [80, 460, 1.6],
        [520, 440, 1.8],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#E6C466" fillOpacity="0.6" />
      ))}

      {/* floor reflection */}
      <ellipse cx="300" cy="470" rx="190" ry="20" fill="url(#floorGrad)" />
      <line x1="60" y1="500" x2="540" y2="500" stroke="#E6C466" strokeOpacity="0.25" strokeWidth="1" />

      {/* hydraulic service lift beneath the car */}
      <g opacity="0.8">
        <rect x="150" y="446" width="300" height="8" rx="3" fill="#122E22" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="205" y1="454" x2="205" y2="498" stroke="#E6C466" strokeOpacity="0.45" strokeWidth="5" />
        <line x1="395" y1="454" x2="395" y2="498" stroke="#E6C466" strokeOpacity="0.45" strokeWidth="5" />
        <rect x="188" y="496" width="34" height="8" rx="2" fill="#E6C466" fillOpacity="0.45" />
        <rect x="378" y="496" width="34" height="8" rx="2" fill="#E6C466" fillOpacity="0.45" />
      </g>

      {/* wrench motifs, corners */}
      <g opacity="0.25" stroke="#E6C466" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M140 90 l18 18 M158 90 l-18 18 M149 99 a10 10 0 1 1 0.1 0" />
        <path d="M460 470 l18 18 M478 470 l-18 18 M469 479 a10 10 0 1 1 0.1 0" />
      </g>

      {/* car body */}
      <path
        d="M90 400
           Q90 372 122 366
           L166 366
           Q192 312 254 300
           L372 300
           Q424 312 452 366
           L484 366
           Q516 372 516 400
           L516 420
           Q516 436 500 436
           L468 436
           Q463 462 436 462
           Q409 462 404 436
           L212 436
           Q207 462 180 462
           Q153 462 148 436
           L110 436
           Q90 436 90 420
           Z"
        fill="url(#carBody)"
        stroke="#E6C466"
        strokeWidth="2.5"
      />

      {/* cabin / window line */}
      <path
        d="M188 366 Q210 316 254 306 L372 306 Q412 316 432 366 Z"
        fill="none"
        stroke="#E6C466"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />
      <line x1="300" y1="308" x2="300" y2="366" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1.2" />

      {/* grille + headlight + handle details */}
      <rect x="486" y="378" width="20" height="10" rx="2" fill="#E6C466" fillOpacity="0.85" />
      <ellipse cx="500" cy="400" rx="9" ry="7" fill="#E6C466" fillOpacity="0.9" />
      <line x1="140" y1="392" x2="180" y2="392" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1.5" />
      <line x1="420" y1="392" x2="460" y2="392" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* wheels */}
      <circle cx="180" cy="436" r="34" fill="#0E2A1F" stroke="#E6C466" strokeWidth="3" />
      <circle cx="180" cy="436" r="13" fill="none" stroke="#E6C466" strokeWidth="2" />
      <circle cx="436" cy="436" r="34" fill="#0E2A1F" stroke="#E6C466" strokeWidth="3" />
      <circle cx="436" cy="436" r="13" fill="none" stroke="#E6C466" strokeWidth="2" />

      {/* signature monogram */}
      <text
        x="300"
        y="530"
        textAnchor="middle"
        fill="#E6C466"
        fillOpacity="0.8"
        fontSize="13"
        letterSpacing="6"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        CRYSTOFIX ATELIER
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Circular premium health gauge                                      */
/* ------------------------------------------------------------------ */

function CircularHealthGauge({ value, size = 68 }: { value: number; size?: number }) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? C.success : value >= 50 ? C.warning : C.error;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={`${C.gold}25`} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold" style={{ color: C.darkGreen, fontFamily: "var(--font-playfair)" }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function CrystoFixDashboard() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [bookServiceOpen, setBookServiceOpen] = useState(false);
  const [pickupOpen, setPickupOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState<InvoiceRecord | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [vehicleForm, setVehicleForm] = useState({ brand: "", model: "", regNumber: "" });

  function pushToast(message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }

  function goTo(id: string) {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAddVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleForm.brand || !vehicleForm.model || !vehicleForm.regNumber) return;
    const newVehicle: Vehicle = {
      id: `v${vehicles.length + 1}-${Date.now()}`,
      brand: vehicleForm.brand,
      model: vehicleForm.model,
      year: new Date().getFullYear(),
      color: "Not specified",
      fuelType: "Petrol",
      regNumber: vehicleForm.regNumber,
      healthScore: 100,
      lastService: "Not serviced yet",
    };
    setVehicles((prev) => [...prev, newVehicle]);
    setVehicleForm({ brand: "", model: "", regNumber: "" });
    setAddVehicleOpen(false);
    pushToast(`${newVehicle.brand} ${newVehicle.model} added to your garage`);
  }

  const avgHealth = Math.round(vehicles.reduce((sum, v) => sum + v.healthScore, 0) / vehicles.length);

  const stats = [
    { label: "My Vehicles", value: String(vehicles.length), icon: CarFront },
    { label: "Active Services", value: "1", icon: Wrench },
    { label: "Completed Services", value: String(SERVICE_HISTORY.length), icon: CheckCircle2 },
    { label: "Health Score", value: `${avgHealth}%`, icon: Gauge },
  ];

  const quickActions = [
    {
      title: "Book Service",
      desc: "Schedule your next service in under a minute.",
      icon: Wrench,
      onClick: () => setBookServiceOpen(true),
    },
    {
      title: "Pickup & Drop",
      desc: "We collect and return your vehicle, doorstep to garage.",
      icon: Truck,
      onClick: () => setPickupOpen(true),
    },
    {
      title: "Service History",
      desc: "Every visit, logged and easy to revisit.",
      icon: HistoryIcon,
      onClick: () => goTo("history"),
    },
    {
      title: "Contact Garage",
      desc: "Reach your service centre directly, anytime.",
      icon: Phone,
      onClick: () => goTo("support"),
    },
  ];

  return (
    <div
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${manrope.variable} relative min-h-screen overflow-x-hidden`}
      style={{ backgroundColor: C.cream, fontFamily: "var(--font-manrope)", color: C.text }}
    >
      {/* ---------------------------------------------------------- */}
      {/*  Ambient background                                         */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: C.cream }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 680px at 10% -10%, rgba(200,160,58,0.20), transparent 60%), radial-gradient(1000px 620px at 108% 8%, rgba(22,63,45,0.14), transparent 55%), radial-gradient(800px 560px at 50% 118%, rgba(200,160,58,0.16), transparent 60%), linear-gradient(180deg, #FFF8EE 0%, #F8F4EA 40%, #FFF8EE 100%)",
          }}
        />
        {/* faint automotive blueprint grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" preserveAspectRatio="none">
          <defs>
            <pattern id="blueprintGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0 L0 0 0 64" fill="none" stroke={C.darkGreen} strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
        </svg>
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <svg className="absolute -right-24 top-24 h-72 w-72 opacity-[0.07]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke={C.gold} strokeWidth="1" />
          <circle cx="100" cy="100" r="70" stroke={C.gold} strokeWidth="1" />
        </svg>
        <svg className="absolute -left-16 bottom-32 h-64 w-64 opacity-[0.05]" viewBox="0 0 200 200" fill="none">
          <rect x="10" y="10" width="180" height="180" stroke={C.darkGreen} strokeWidth="1" />
        </svg>
        {/* faint vehicle silhouette, automotive blueprint style */}
        <svg
          className="absolute -right-10 bottom-0 h-[280px] w-[560px] opacity-[0.05] sm:h-[360px] sm:w-[720px]"
          viewBox="0 0 720 360"
          fill="none"
        >
          <path
            d="M40 260 Q40 220 90 212 L150 212 Q190 140 270 122 L460 122 Q540 140 580 212 L630 212 Q680 220 680 260 L680 288 Q680 302 662 302 L610 302 Q604 336 566 336 Q528 336 522 302 L200 302 Q194 336 156 336 Q118 336 112 302 L58 302 Q40 302 40 288 Z"
            stroke={C.darkGreen}
            strokeWidth="1.5"
          />
          <circle cx="200" cy="302" r="44" stroke={C.darkGreen} strokeWidth="1.5" />
          <circle cx="524" cy="302" r="44" stroke={C.darkGreen} strokeWidth="1.5" />
        </svg>
        {/* floating gold ambient particles */}
        {[
          { top: "14%", left: "18%", size: 4, delay: 0 },
          { top: "62%", left: "8%", size: 3, delay: 0.6 },
          { top: "24%", left: "92%", size: 5, delay: 1.1 },
          { top: "78%", left: "88%", size: 3, delay: 1.7 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ top: p.top, left: p.left, width: p.size, height: p.size, backgroundColor: C.gold, opacity: 0.35 }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Header                                                      */}
      {/* ---------------------------------------------------------- */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ backgroundColor: `${C.cream}e0`, borderColor: `${C.gold}35` }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-full"
              style={{ background: `linear-gradient(145deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
            >
              <span className="text-sm font-semibold" style={{ color: C.goldLight, fontFamily: "var(--font-playfair)" }}>
                CF
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-base sm:text-lg" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                CrystoFix
              </p>
              <p className="hidden text-[11px] uppercase tracking-[0.2em] sm:block" style={{ color: C.subtext }}>
                Premium Automotive Technology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full transition hover:scale-105"
                style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span
                  className="absolute right-2 top-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: C.error, boxShadow: `0 0 0 2px ${C.cream}` }}
                />
              </button>
              <AnimatePresence>
                {notifOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl"
                    style={{ backgroundColor: C.card, border: `1px solid ${C.gold}40`, boxShadow: "0 24px 60px rgba(14,42,31,0.25)" }}
                  >
                    <div className="px-5 py-4" style={{ borderBottom: `1px solid ${C.gold}25` }}>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>
                        Notifications
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} className="px-5 py-3" style={{ borderBottom: `1px solid ${C.gold}15` }}>
                          <p className="text-sm font-medium" style={{ color: C.text }}>
                            {n.title}
                          </p>
                          <p className="mt-0.5 text-xs" style={{ color: C.subtext }}>
                            {n.detail}
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: C.gold }}>
                            {n.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              onClick={() => goTo("profile")}
              className="flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition hover:scale-[1.02]"
              style={{ backgroundColor: C.card, border: `1px solid ${C.gold}50` }}
            >
              <div
                className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold"
                style={{ background: `linear-gradient(145deg, ${C.goldLight}, ${C.gold})`, color: C.darkGreen }}
              >
                AM
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-semibold" style={{ color: C.text }}>
                  {CUSTOMER.name}
                </p>
                <p className="text-[10px]" style={{ color: C.gold }}>
                  {CUSTOMER.membership}
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-32 sm:px-8">
        {/* ---------------------------------------------------------- */}
        {/*  Hero                                                        */}
        {/* ---------------------------------------------------------- */}
        <section id="home" className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-2 lg:gap-16 lg:pt-20">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Eyebrow>{CUSTOMER.membership}</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.75rem]"
              style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}
            >
              Good Morning,
              <br />
              <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: C.gold }}>
                {CUSTOMER.name}
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-md text-[15px] leading-relaxed"
              style={{ color: C.subtext }}
            >
              Track services, manage vehicles and experience premium automotive care with complete transparency.
            </motion.p>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="relative mt-8 max-w-md overflow-hidden rounded-3xl p-6"
              style={{
                background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.green} 100%)`,
                border: `1px solid ${C.gold}`,
                boxShadow: `0 25px 60px rgba(14,42,31,0.35), 0 0 0 1px ${C.goldGlow}`,
              }}
            >
              {/* glass reflection */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 35%)" }}
              />
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
                style={{ background: `radial-gradient(circle, ${C.goldLight}30, transparent 70%)` }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-full text-sm font-semibold"
                    style={{ background: `linear-gradient(145deg, ${C.goldLight}, ${C.gold})`, color: C.darkGreen }}
                  >
                    AM
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: `${C.goldLight}bb` }}>
                      Membership Card
                    </p>
                    <p className="text-sm font-semibold" style={{ color: C.goldLight, fontFamily: "var(--font-playfair)" }}>
                      CrystoFix
                    </p>
                  </div>
                </div>
                <Sparkles size={16} style={{ color: C.goldLight }} />
              </div>

              <div className="relative mt-6 space-y-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: "#B9C9BF" }}>Name</span>
                  <span className="font-medium" style={{ color: C.cream }}>
                    {CUSTOMER.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#B9C9BF" }}>Customer ID</span>
                  <span className="font-medium tracking-wide" style={{ color: C.cream }}>
                    {CUSTOMER.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#B9C9BF" }}>Vehicle Count</span>
                  <span className="font-medium" style={{ color: C.cream }}>
                    {vehicles.length} Vehicles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#B9C9BF" }}>Address</span>
                  <span className="max-w-[55%] text-right font-medium" style={{ color: C.cream }}>
                    {CUSTOMER.address}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.gold}35` }}>
                  <span style={{ color: "#B9C9BF" }}>Status</span>
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${C.goldLight}22`, color: C.goldLight }}
                  >
                    <Award size={12} /> {CUSTOMER.membership}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="group relative mx-auto aspect-[6/5.6] w-full max-w-lg overflow-hidden rounded-[2rem] p-2 transition-shadow duration-500"
            style={{
              border: `1.5px solid ${C.gold}`,
              boxShadow: `0 30px 70px rgba(14,42,31,0.25), 0 0 0 1px ${C.goldGlow}`,
              backgroundColor: C.darkGreen,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
              <HeroArtwork />
              {/* glass reflection sheen */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 22%, transparent 40%)",
                  backdropFilter: "blur(0.5px)",
                }}
              />
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                style={{ background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.16), transparent)" }}
                initial={{ x: "-40%" }}
                whileHover={{ x: "260%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 60px ${C.goldLight}55` }}
              />
            </div>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Quick stats                                                 */}
        {/* ---------------------------------------------------------- */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mt-20 grid grid-cols-2 gap-4 sm:mt-24 lg:grid-cols-4 lg:gap-6"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 sm:p-6"
              style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.06)" }}
            >
              <div
                className="mb-4 grid h-10 w-10 place-items-center rounded-xl"
                style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
              >
                <s.icon size={19} />
              </div>
              <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: C.subtext }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* ---------------------------------------------------------- */}
        {/*  Quick actions                                               */}
        {/* ---------------------------------------------------------- */}
        <section id="actions" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="Top Priority" title="Quick Actions" subtitle="The four things you'll reach for most." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {quickActions.map((a) => (
              <motion.button
                key={a.title}
                variants={fadeUp}
                whileHover={{ y: -7, scale: 1.03, boxShadow: `0 24px 55px rgba(14,42,31,0.32), 0 0 30px ${C.goldGlow}` }}
                whileTap={{ scale: 0.98 }}
                onClick={a.onClick}
                className="group relative overflow-hidden rounded-2xl p-6 text-left"
                style={{
                  backgroundColor: C.darkGreen,
                  border: `1px solid ${C.gold}`,
                  boxShadow: "0 16px 40px rgba(14,42,31,0.22)",
                }}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${C.goldLight}40, transparent 70%)` }}
                />
                <div
                  className="mb-5 grid h-11 w-11 place-items-center rounded-xl"
                  style={{ backgroundColor: `${C.goldLight}22`, color: C.gold }}
                >
                  <a.icon size={20} />
                </div>
                <p className="text-base font-semibold" style={{ color: C.cream, fontFamily: "var(--font-playfair)" }}>
                  {a.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: `${C.cream}b3` }}>
                  {a.desc}
                </p>
                <ChevronRight
                  size={16}
                  className="mt-4 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: C.gold }}
                />
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  My Vehicles                                                 */}
        {/* ---------------------------------------------------------- */}
        <section id="vehicles" className="mt-20 scroll-mt-24 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Your Garage" title="My Vehicles" subtitle="Every vehicle you own, watched over in one place." />
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => setAddVehicleOpen(true)}
              className="mb-8 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-[1.03]"
              style={{ backgroundColor: C.darkGreen, color: C.goldLight, border: `1px solid ${C.gold}` }}
            >
              <Plus size={16} /> Add Vehicle
            </motion.button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {vehicles.map((v) => (
              <motion.div
                key={v.id}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-3xl"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 16px 40px rgba(14,42,31,0.08)" }}
              >
                <div
                  className="relative flex h-32 items-center justify-center"
                  style={{ background: `linear-gradient(150deg, ${C.green}, ${C.darkGreen})` }}
                >
                  <CarFront size={54} style={{ color: C.goldLight }} strokeWidth={1.3} />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
                        {v.brand} {v.model} {v.year}
                      </p>
                      <p className="mt-0.5 text-xs font-medium tracking-wide" style={{ color: C.gold }}>
                        {v.regNumber}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CircularHealthGauge value={v.healthScore} />
                      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.subtext }}>
                        Health
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2" style={{ color: C.subtext }}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.gold }} />
                      {v.color}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: C.subtext }}>
                      <Fuel size={13} /> {v.fuelType}
                    </div>
                    <div className="col-span-2 flex items-center gap-2" style={{ color: C.subtext }}>
                      <HistoryIcon size={13} /> Last service: {v.lastService}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Active service timeline                                     */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <SectionHeading
            eyebrow="Live Tracking"
            title="Active Service"
            subtitle={`${ACTIVE_SERVICE.serviceType} · ${ACTIVE_SERVICE.vehicle} · Estimated ready ${ACTIVE_SERVICE.eta}`}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-6 sm:p-10"
            style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 16px 40px rgba(14,42,31,0.08)" }}
          >
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
              {/* base track */}
              <div
                className="absolute left-5 top-5 hidden h-[2px] sm:block"
                style={{ width: "calc(100% - 40px)", backgroundColor: `${C.gold}22` }}
              />
              <div
                className="absolute left-5 top-5 block w-[2px] sm:hidden"
                style={{ height: "calc(100% - 40px)", backgroundColor: `${C.gold}22` }}
              />
              {/* animated gold progress fill */}
              <motion.div
                className="absolute left-5 top-5 hidden h-[2px] sm:block"
                style={{ background: `linear-gradient(90deg, ${C.success}, ${C.gold})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `calc(${TIMELINE_PROGRESS}% - ${(TIMELINE_PROGRESS / 100) * 40}px)` }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
              />
              <motion.div
                className="absolute left-5 top-5 block w-[2px] sm:hidden"
                style={{ background: `linear-gradient(180deg, ${C.success}, ${C.gold})` }}
                initial={{ height: 0 }}
                whileInView={{ height: `calc(${TIMELINE_PROGRESS}% - ${(TIMELINE_PROGRESS / 100) * 40}px)` }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
              />
              {TIMELINE.map((step, i) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const color = isCompleted ? C.success : isActive ? C.gold : `${C.subtext}55`;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative z-10 flex flex-1 items-center gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center"
                  >
                    <motion.div
                      animate={isActive ? { boxShadow: [`0 0 0 0px ${C.gold}55`, `0 0 0 10px ${C.gold}00`] } : {}}
                      transition={isActive ? { duration: 1.6, repeat: Infinity } : {}}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                      style={{
                        backgroundColor: isCompleted || isActive ? color : C.card,
                        border: `2px solid ${color}`,
                        color: isCompleted || isActive ? C.card : C.subtext,
                      }}
                    >
                      {isActive ? (
                        <Loader2 size={18} className="animate-spin" style={{ color: C.card }} />
                      ) : (
                        <step.icon size={17} />
                      )}
                    </motion.div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isCompleted || isActive ? C.text : C.subtext }}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px]" style={{ color: C.subtext }}>
                        {step.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Service history                                             */}
        {/* ---------------------------------------------------------- */}
        <section id="history" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="Complete Record" title="Service History" subtitle="Full transparency on every visit to CrystoFix." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {SERVICE_HISTORY.map((s) => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="flex items-center justify-between gap-4 rounded-2xl p-5"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30`, boxShadow: "0 10px 26px rgba(14,42,31,0.06)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                  >
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                      {s.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: C.subtext }}>
                      {s.vehicle} · {s.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: C.darkGreen }}>
                    ₹{s.cost.toLocaleString("en-IN")}
                  </p>
                  <span
                    className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: `${C.success}1a`, color: "#1a8f5e" }}
                  >
                    {s.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Digital invoices                                            */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="Paperless" title="Digital Invoices" subtitle="Download or review every invoice, whenever you need it." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {INVOICES.map((inv) => (
              <motion.div
                key={inv.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-6"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.07)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                      {inv.number}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: C.subtext }}>
                      {inv.date}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{ backgroundColor: `${C.gold}1a`, color: C.gold }}
                  >
                    Paid
                  </span>
                </div>
                <p className="mt-5 text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                  ₹{inv.amount.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs" style={{ color: C.subtext }}>
                  {inv.vehicle}
                </p>
                <div className="mt-5 flex gap-2.5">
                  <motion.button
                    onClick={() => setInvoiceModal(inv)}
                    whileHover={{ scale: 1.03, boxShadow: `0 10px 24px rgba(14,42,31,0.28), 0 0 16px ${C.goldGlow}` }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold"
                    style={{ backgroundColor: C.darkGreen, color: C.goldLight, border: `1px solid ${C.gold}55` }}
                  >
                    <Eye size={14} /> View
                  </motion.button>
                  <motion.button
                    onClick={() => pushToast(`${inv.number} downloaded`)}
                    whileHover={{ scale: 1.03, boxShadow: `0 10px 24px rgba(200,160,58,0.35), 0 0 16px ${C.goldGlow}` }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                  >
                    <Download size={14} /> PDF
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Support                                                     */}
        {/* ---------------------------------------------------------- */}
        <section id="support" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="We're Here" title="Support Centre" subtitle="Luxury service means help is always within reach." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { title: "Call Garage", desc: "Speak with our advisors directly.", icon: Phone, action: () => (window.location.href = "tel:+918048123456") },
              { title: "WhatsApp Support", desc: "Chat with us for quick answers.", icon: MessageCircle, action: () => window.open("https://wa.me/918048123456", "_blank") },
              { title: "Emergency Assistance", desc: "24×7 roadside support, on call.", icon: ShieldAlert, action: () => setEmergencyOpen(true) },
              { title: "Track Pickup Driver", desc: "See your driver's live progress.", icon: Navigation, action: () => setTrackOpen(true) },
            ].map((c) => (
              <motion.button
                key={c.title}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  backgroundColor: C.hoverGreen,
                  boxShadow: `0 20px 45px rgba(14,42,31,0.3), 0 0 26px ${C.goldGlow}`,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={c.action}
                className="rounded-2xl p-6 text-left"
                style={{ backgroundColor: C.darkGreen, border: `1px solid ${C.gold}55`, boxShadow: "0 12px 30px rgba(14,42,31,0.18)" }}
              >
                <div
                  className="mb-4 grid h-11 w-11 place-items-center rounded-xl"
                  style={{ backgroundColor: `${C.goldLight}1f`, color: C.gold }}
                >
                  <c.icon size={19} />
                </div>
                <p className="text-sm font-semibold" style={{ color: C.cream }}>
                  {c.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: `${C.cream}99` }}>
                  {c.desc}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Profile footer strip                                       */}
        {/* ---------------------------------------------------------- */}
        <section id="profile" className="mt-20 scroll-mt-24 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-6 rounded-3xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}55` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="grid h-14 w-14 place-items-center rounded-full text-lg font-semibold"
                style={{ background: `linear-gradient(145deg, ${C.goldLight}, ${C.gold})`, color: C.darkGreen }}
              >
                AM
              </div>
              <div>
                <p className="text-lg" style={{ fontFamily: "var(--font-playfair)", color: C.goldLight }}>
                  {CUSTOMER.name}
                </p>
                <p className="text-xs" style={{ color: "#D8E4DC" }}>
                  {CUSTOMER.id} · {CUSTOMER.memberSince}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: `${C.goldLight}1f` }}>
              <Award size={16} style={{ color: C.goldLight }} />
              <span className="text-xs font-semibold" style={{ color: C.goldLight }}>
                {CUSTOMER.membership}
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/*  Bottom navigation                                           */}
      {/* ---------------------------------------------------------- */}
      <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div
          className="flex items-center gap-1 rounded-full px-2 py-2 backdrop-blur-2xl"
          style={{
            backgroundColor: `${C.darkGreen}d9`,
            border: `1px solid ${C.gold}66`,
            boxShadow: `0 20px 50px rgba(14,42,31,0.4), 0 0 28px ${C.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className="relative flex flex-col items-center gap-1 rounded-full px-4 py-2 transition"
              >
                {isActive ? (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: `${C.gold}26`, boxShadow: `0 0 0 1px ${C.gold}55, 0 0 16px ${C.goldGlow}` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <item.icon size={18} className="relative" style={{ color: isActive ? C.goldLight : "#9FB3A6" }} />
                <span
                  className="relative text-[10px] font-medium"
                  style={{ color: isActive ? C.goldLight : "#9FB3A6" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ---------------------------------------------------------- */}
      {/*  Toasts                                                      */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-lg"
              style={{ backgroundColor: C.darkGreen, color: C.goldLight, border: `1px solid ${C.gold}55` }}
            >
              <CheckCircle2 size={15} style={{ color: C.success }} />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Modals                                                      */}
      {/* ---------------------------------------------------------- */}

      <Modal open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} title="Add a Vehicle">
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Brand
            </label>
            <input
              required
              value={vehicleForm.brand}
              onChange={(e) => setVehicleForm((f) => ({ ...f, brand: e.target.value }))}
              placeholder="e.g. Maruti Suzuki"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Model
            </label>
            <input
              required
              value={vehicleForm.model}
              onChange={(e) => setVehicleForm((f) => ({ ...f, model: e.target.value }))}
              placeholder="e.g. Baleno"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Registration Number
            </label>
            <input
              required
              value={vehicleForm.regNumber}
              onChange={(e) => setVehicleForm((f) => ({ ...f, regNumber: e.target.value }))}
              placeholder="e.g. KA03 EF 9012"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
          >
            Add to My Garage
          </button>
        </form>
      </Modal>

      <Modal open={bookServiceOpen} onClose={() => setBookServiceOpen(false)} title="Book a Service">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBookServiceOpen(false);
            pushToast("Service booked — we'll confirm your slot shortly");
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Vehicle
            </label>
            <select
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            >
              {vehicles.map((v) => (
                <option key={v.id}>
                  {v.brand} {v.model} · {v.regNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Service Type
            </label>
            <select
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            >
              <option>Car Service</option>
              <option>Engine Repair</option>
              <option>Electrical Repair</option>
              <option>Denting</option>
              <option>Painting</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Preferred Date
            </label>
            <input
              required
              type="date"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
          >
            <Send size={15} /> Confirm Booking
          </button>
        </form>
      </Modal>

      <Modal open={pickupOpen} onClose={() => setPickupOpen(false)} title="Request Pickup & Drop">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPickupOpen(false);
            pushToast("Pickup requested — a driver will be assigned shortly");
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Pickup Address
            </label>
            <input
              required
              defaultValue={CUSTOMER.address}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: C.subtext }}>
              Preferred Time
            </label>
            <input
              required
              type="time"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: `${C.darkGreen}08`, border: `1px solid ${C.gold}30`, color: C.text }}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
          >
            Request Pickup
          </button>
        </form>
      </Modal>

      <Modal open={trackOpen} onClose={() => setTrackOpen(false)} title="Track Pickup Driver">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: `${C.darkGreen}08` }}>
            <div className="grid h-11 w-11 place-items-center rounded-full" style={{ backgroundColor: `${C.gold}22`, color: C.gold }}>
              <Truck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.text }}>
                Ravi Kumar
              </p>
              <p className="text-xs" style={{ color: C.subtext }}>
                Arriving in 12 minutes · 2.4 km away
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.subtext }}>
            <MapPin size={14} style={{ color: C.gold }} />
            Heading toward {CUSTOMER.address}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${C.gold}22` }}>
            <motion.div
              initial={{ width: "10%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }}
            />
          </div>
        </div>
      </Modal>

      <Modal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} title="Emergency Assistance">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: C.subtext }}>
            Our 24×7 roadside team is ready. Call now for immediate assistance, or share your location for a rescue vehicle.
          </p>
          <a
            href="tel:+918048129999"
            className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
            style={{ backgroundColor: C.error }}
          >
            <Phone size={15} /> Call Emergency Line
          </a>
          <button
            onClick={() => {
              setEmergencyOpen(false);
              pushToast("Your location has been shared with our rescue team");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition hover:scale-[1.01]"
            style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
          >
            <MapPin size={15} /> Share My Location
          </button>
        </div>
      </Modal>

      <Modal open={!!invoiceModal} onClose={() => setInvoiceModal(null)} title="Invoice Details">
        {invoiceModal ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: C.subtext }}>
                Invoice Number
              </span>
              <span className="text-sm font-semibold" style={{ color: C.text }}>
                {invoiceModal.number}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: C.subtext }}>
                Date
              </span>
              <span className="text-sm font-semibold" style={{ color: C.text }}>
                {invoiceModal.date}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: C.subtext }}>
                Vehicle
              </span>
              <span className="text-sm font-semibold" style={{ color: C.text }}>
                {invoiceModal.vehicle}
              </span>
            </div>
            <div
              className="flex items-center justify-between rounded-xl p-4"
              style={{ backgroundColor: `${C.gold}12` }}
            >
              <span className="text-sm font-semibold" style={{ color: C.darkGreen }}>
                Total Amount
              </span>
              <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                ₹{invoiceModal.amount.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={() => {
                pushToast(`${invoiceModal.number} downloaded`);
                setInvoiceModal(null);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
              style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
            >
              <Download size={15} /> Download PDF
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
