"use client";

import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Award,
  BatteryCharging,
  Bell,
  Calendar,
  CarFront,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Cog,
  Download,
  Eye,
  FileText,
  Flag,
  Hammer,
  HelpCircle,
  History as HistoryIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  PackageCheck,
  Paintbrush,
  Phone,
  Plus,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users,
  Wallet,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Cormorant_Garamond, Inter, Manrope, Playfair_Display } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  Fonts — identical to the customer dashboard and booking wizard      */
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
/*  Palette — identical to the rest of the CrystoFix platform           */
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
  danger: "#F04438",
};

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface CustomerInfo {
  name: string;
  id: string;
  phone: string;
  address: string;
}

interface ServiceRequest {
  id: string;
  vehicleName: string;
  regNumber: string;
  customer: CustomerInfo;
  serviceType: string;
  pickupRequired: boolean;
  date: string;
}

type JobStatus = "received" | "inspection" | "repair" | "parts" | "quality" | "ready" | "completed";

interface UploadedPhoto {
  id: string;
  file: File;
  url: string;
}

interface InvoicePart {
  name: string;
  cost: number;
}

interface InvoiceInfo {
  parts: InvoicePart[];
  laborCost: number;
  taxRate: number;
  generated: boolean;
}

interface InspectionInfo {
  complaint: string;
  technicianNotes: string;
  recommendedRepairs: string;
  partsNeeded: string;
}

interface ActiveJob {
  id: string;
  vehicleName: string;
  regNumber: string;
  customer: CustomerInfo;
  serviceType: string;
  pickupRequired: boolean;
  status: JobStatus;
  eta: string;
  technician: string | null;
  driverAssigned: string | null;
  pickupTime: string | null;
  beforePhotos: UploadedPhoto[];
  afterPhotos: UploadedPhoto[];
  inspection: InspectionInfo;
  invoice: InvoiceInfo;
}

interface Technician {
  id: string;
  name: string;
  currentJob: string | null;
  status: "Busy" | "Available";
}

interface ToastItem {
  id: number;
  message: string;
}

interface BookingForm {
  customerName: string;
  vehicleName: string;
  regNumber: string;
  serviceType: string;
  pickupRequired: boolean;
  phone: string;
  address: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const SERVICE_TYPES = [
  "General Service",
  "Engine Repair",
  "Electrical Repair",
  "Denting",
  "Painting",
  "AC Repair",
  "Battery",
  "Other",
];

const DRIVERS = ["Ravi Kumar", "Manoj Singh", "Iqbal Ahmed"];

const JOB_STATUS_STEPS: { key: JobStatus; label: string; icon: typeof PackageCheck }[] = [
  { key: "received", label: "Vehicle Received", icon: PackageCheck },
  { key: "inspection", label: "Inspection", icon: ClipboardList },
  { key: "repair", label: "Repair", icon: Wrench },
  { key: "parts", label: "Parts Ordered", icon: Package },
  { key: "quality", label: "Quality Check", icon: ClipboardCheck },
  { key: "ready", label: "Ready", icon: CheckCircle2 },
  { key: "completed", label: "Completed", icon: Flag },
];

function statusIndex(status: JobStatus): number {
  return JOB_STATUS_STEPS.findIndex((s) => s.key === status);
}

function statusPillColor(status: JobStatus): string {
  if (status === "ready" || status === "completed") return C.success;
  if (status === "parts") return C.warning;
  return C.gold;
}

const NOTIFICATIONS = [
  { id: "n1", title: "New booking request", detail: "Divya Rao requested Denting for Baleno.", time: "12m ago" },
  { id: "n2", title: "Job due today", detail: "Honda City ZX · Engine Repair is due by 6:30 PM.", time: "1h ago" },
  { id: "n3", title: "Invoice generated", detail: "Kia Seltos invoice is ready to send.", time: "3h ago" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Sparkles },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "customers", label: "Customers", icon: Users },
  { id: "profile", label: "Profile", icon: Award },
] as const;

const REVENUE_CHART = [
  { day: "Mon", amount: 32000 },
  { day: "Tue", amount: 42500 },
  { day: "Wed", amount: 28000 },
  { day: "Thu", amount: 51000 },
  { day: "Fri", amount: 47500 },
  { day: "Sat", amount: 63500 },
  { day: "Sun", amount: 39000 },
];

/* ------------------------------------------------------------------ */
/*  Seed data                                                           */
/* ------------------------------------------------------------------ */

const INITIAL_TECHNICIANS: Technician[] = [
  { id: "t1", name: "Aamir Khan", currentJob: "Engine Repair", status: "Busy" },
  { id: "t2", name: "Rakesh Verma", currentJob: "General Service", status: "Busy" },
  { id: "t3", name: "Suresh Nair", currentJob: null, status: "Available" },
];

const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: "r1",
    vehicleName: "Maruti Suzuki Baleno",
    regNumber: "KA02 EF 4521",
    customer: { name: "Divya Rao", id: "CRY-2026-014", phone: "+91 98452 11223", address: "Koramangala, Bengaluru" },
    serviceType: "Denting",
    pickupRequired: true,
    date: "Today",
  },
  {
    id: "r2",
    vehicleName: "Toyota Innova Crysta",
    regNumber: "KA03 GH 7788",
    customer: { name: "Farhan Ali", id: "CRY-2026-022", phone: "+91 90080 33445", address: "Indiranagar, Bengaluru" },
    serviceType: "AC Repair",
    pickupRequired: false,
    date: "Today",
  },
];

const INITIAL_ACTIVE_JOBS: ActiveJob[] = [
  {
    id: "j1",
    vehicleName: "Honda City ZX",
    regNumber: "KA01 AB 1234",
    customer: { name: "Abdul Majid", id: "CRY-2026-001", phone: "+91 98450 12345", address: "HSR Layout, Bengaluru" },
    serviceType: "Engine Repair",
    pickupRequired: true,
    status: "repair",
    eta: "Today, 6:30 PM",
    technician: "Aamir Khan",
    driverAssigned: "Ravi Kumar",
    pickupTime: "9:00 AM",
    beforePhotos: [],
    afterPhotos: [],
    inspection: {
      complaint: "Engine making a rattling noise on acceleration.",
      technicianNotes: "Timing chain tensioner is worn beyond tolerance.",
      recommendedRepairs: "Replace tensioner and chain guide, flush oil.",
      partsNeeded: "Timing chain kit, engine oil",
    },
    invoice: { parts: [{ name: "Timing Chain Kit", cost: 4200 }], laborCost: 1800, taxRate: 18, generated: false },
  },
  {
    id: "j2",
    vehicleName: "Hyundai Creta",
    regNumber: "KA05 CD 5678",
    customer: { name: "Abdul Majid", id: "CRY-2026-001", phone: "+91 98450 12345", address: "HSR Layout, Bengaluru" },
    serviceType: "General Service",
    pickupRequired: false,
    status: "quality",
    eta: "Tomorrow, 11:00 AM",
    technician: "Rakesh Verma",
    driverAssigned: null,
    pickupTime: null,
    beforePhotos: [],
    afterPhotos: [],
    inspection: {
      complaint: "Routine service, customer also reported a soft brake pedal.",
      technicianNotes: "Brake fluid was low and slightly discoloured.",
      recommendedRepairs: "Full brake fluid flush and multi-point inspection.",
      partsNeeded: "Brake fluid DOT 4, oil filter",
    },
    invoice: { parts: [{ name: "Oil Filter", cost: 450 }, { name: "Engine Oil (4L)", cost: 2200 }], laborCost: 900, taxRate: 18, generated: false },
  },
  {
    id: "j3",
    vehicleName: "Kia Seltos",
    regNumber: "KA07 IJ 9012",
    customer: { name: "Neha Sharma", id: "CRY-2026-031", phone: "+91 99000 55667", address: "Whitefield, Bengaluru" },
    serviceType: "Painting",
    pickupRequired: false,
    status: "completed",
    eta: "Completed",
    technician: "Suresh Nair",
    driverAssigned: null,
    pickupTime: null,
    beforePhotos: [],
    afterPhotos: [],
    inspection: {
      complaint: "Scratches and a dent on the rear bumper.",
      technicianNotes: "Bumper repainted and buffed to factory finish.",
      recommendedRepairs: "None further required.",
      partsNeeded: "Paint & primer",
    },
    invoice: { parts: [{ name: "Paint & Primer", cost: 6000 }], laborCost: 3500, taxRate: 18, generated: true },
  },
];

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: C.gold }}>
      <span className="h-px w-6" style={{ backgroundColor: C.gold }} />
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-8 max-w-2xl"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
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

const inputStyle: React.CSSProperties = {
  backgroundColor: `${C.darkGreen}06`,
  border: `1px solid ${C.gold}30`,
  color: C.text,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide" style={{ color: C.subtext }}>
      {children}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal shell                                                         */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  title,
  wide,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  wide?: boolean;
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
            className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl ${wide ? "max-w-2xl" : "max-w-lg"}`}
            style={{ backgroundColor: C.card, border: `1px solid ${C.gold}55`, boxShadow: "0 30px 80px rgba(14,42,31,0.35)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5" style={{ backgroundColor: C.card, borderBottom: `1px solid ${C.gold}30` }}>
              <h3 className="text-xl" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
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
/*  Garage hero artwork — same bespoke gold line-art language           */
/* ------------------------------------------------------------------ */

function GarageHeroArtwork() {
  return (
    <svg viewBox="0 0 600 560" className="h-full w-full" role="img" aria-label="Illustration of the SMN Garage premium workshop">
      <defs>
        <radialGradient id="ggGlow" cx="50%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#E6C466" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E6C466" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ggFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E2A1F" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ggCar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C4A34" />
          <stop offset="100%" stopColor="#0E2A1F" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="600" height="560" fill="#0E2A1F" />
      <circle cx="300" cy="150" r="270" fill="url(#ggGlow)" />

      <text x="300" y="82" textAnchor="middle" fill="#E6C466" fillOpacity="0.28" fontSize="26" letterSpacing="9" style={{ fontFamily: "var(--font-playfair)" }}>
        SMN GARAGE
      </text>

      <path d="M110 500 V230 Q110 120 300 120 Q490 120 490 230 V500" fill="none" stroke="#E6C466" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M150 500 V245 Q150 155 300 155 Q450 155 450 245 V500" fill="none" stroke="#E6C466" strokeOpacity="0.2" strokeWidth="1.5" />

      {/* tool cabinet */}
      <g opacity="0.9">
        <rect x="52" y="326" width="58" height="98" rx="4" fill="#122E22" stroke="#E6C466" strokeOpacity="0.55" strokeWidth="1.3" />
        <line x1="52" y1="357" x2="110" y2="357" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="52" y1="388" x2="110" y2="388" stroke="#E6C466" strokeOpacity="0.4" strokeWidth="1" />
      </g>

      {/* pendant lamp */}
      <line x1="300" y1="60" x2="300" y2="150" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M282 150 L318 150 L308 174 L292 174 Z" fill="#E6C466" fillOpacity="0.85" />
      <circle cx="300" cy="190" r="46" fill="url(#ggGlow)" />

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

      <ellipse cx="300" cy="470" rx="190" ry="20" fill="url(#ggFloor)" />
      <line x1="60" y1="500" x2="540" y2="500" stroke="#E6C466" strokeOpacity="0.25" strokeWidth="1" />

      {/* hydraulic service lift */}
      <g opacity="0.8">
        <rect x="150" y="446" width="300" height="8" rx="3" fill="#122E22" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="205" y1="454" x2="205" y2="498" stroke="#E6C466" strokeOpacity="0.45" strokeWidth="5" />
        <line x1="395" y1="454" x2="395" y2="498" stroke="#E6C466" strokeOpacity="0.45" strokeWidth="5" />
        <rect x="188" y="496" width="34" height="8" rx="2" fill="#E6C466" fillOpacity="0.45" />
        <rect x="378" y="496" width="34" height="8" rx="2" fill="#E6C466" fillOpacity="0.45" />
      </g>

      <g opacity="0.25" stroke="#E6C466" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M140 90 l18 18 M158 90 l-18 18 M149 99 a10 10 0 1 1 0.1 0" />
        <path d="M460 470 l18 18 M478 470 l-18 18 M469 479 a10 10 0 1 1 0.1 0" />
      </g>

      {/* car body */}
      <path
        d="M90 400 Q90 372 122 366 L166 366 Q192 312 254 300 L372 300 Q424 312 452 366 L484 366 Q516 372 516 400 L516 420
           Q516 436 500 436 L468 436 Q463 462 436 462 Q409 462 404 436 L212 436 Q207 462 180 462 Q153 462 148 436 L110 436
           Q90 436 90 420 Z"
        fill="url(#ggCar)"
        stroke="#E6C466"
        strokeWidth="2.5"
      />
      <path d="M188 366 Q210 316 254 306 L372 306 Q412 316 432 366 Z" fill="none" stroke="#E6C466" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1="300" y1="308" x2="300" y2="366" stroke="#E6C466" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="486" y="378" width="20" height="10" rx="2" fill="#E6C466" fillOpacity="0.85" />
      <ellipse cx="500" cy="400" rx="9" ry="7" fill="#E6C466" fillOpacity="0.9" />
      <circle cx="180" cy="436" r="34" fill="#0E2A1F" stroke="#E6C466" strokeWidth="3" />
      <circle cx="180" cy="436" r="13" fill="none" stroke="#E6C466" strokeWidth="2" />
      <circle cx="436" cy="436" r="34" fill="#0E2A1F" stroke="#E6C466" strokeWidth="3" />
      <circle cx="436" cy="436" r="13" fill="none" stroke="#E6C466" strokeWidth="2" />

      <text x="300" y="530" textAnchor="middle" fill="#E6C466" fillOpacity="0.8" fontSize="12" letterSpacing="5" style={{ fontFamily: "var(--font-cormorant)" }}>
        CRYSTOFIX CERTIFIED PARTNER
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable photo upload zone (before / after repair)                  */
/* ------------------------------------------------------------------ */

function PhotoUploadZone({
  label,
  photos,
  onAdd,
  onRemove,
}: {
  label: string;
  photos: UploadedPhoto[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    onAdd(e.dataTransfer.files);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) onAdd(e.target.files);
    e.target.value = "";
  }

  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30` }}>
      <p className="mb-3 text-sm font-semibold" style={{ color: C.darkGreen }}>
        {label}
      </p>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
  e.preventDefault();
  setIsDragging(false);

  const files = Array.from(e.dataTransfer.files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (files.length > 0) {
    onAdd(files);
  }
}}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl px-4 py-8 text-center transition-colors"
        style={{ backgroundColor: isDragging ? `${C.gold}12` : `${C.darkGreen}05`, border: `2px dashed ${isDragging ? C.gold : `${C.gold}40`}` }}
      >
        <UploadCloud size={22} style={{ color: C.darkGreen }} />
        <p className="mt-2 text-xs font-medium" style={{ color: C.text }}>
          Drag &amp; drop or click to upload
        </p>
        <input id={inputId} type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />
      </label>

      {photos.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl" style={{ border: `1px solid ${C.gold}30` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={label} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: `${C.darkGreen}e6`, color: C.cream }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service tracker timeline                                            */
/* ------------------------------------------------------------------ */

function ServiceTracker({ status }: { status: JobStatus }) {
  const idx = statusIndex(status);
  const progress = Math.round((idx / (JOB_STATUS_STEPS.length - 1)) * 100);

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30` }}>
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-1">
        <div className="absolute left-4 top-4 hidden h-[2px] sm:block" style={{ width: "calc(100% - 32px)", backgroundColor: `${C.gold}22` }} />
        <motion.div
          className="absolute left-4 top-4 hidden h-[2px] sm:block"
          style={{ background: `linear-gradient(90deg, ${C.success}, ${C.gold})` }}
          initial={{ width: 0 }}
          animate={{ width: `calc(${progress}% - ${(progress / 100) * 32}px)` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute left-4 top-4 block w-[2px] sm:hidden" style={{ height: "calc(100% - 32px)", backgroundColor: `${C.gold}22` }} />
        <motion.div
          className="absolute left-4 top-4 block w-[2px] sm:hidden"
          style={{ background: `linear-gradient(180deg, ${C.success}, ${C.gold})` }}
          initial={{ height: 0 }}
          animate={{ height: `calc(${progress}% - ${(progress / 100) * 32}px)` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {JOB_STATUS_STEPS.map((step, i) => {
          const isCompleted = i < idx;
          const isActive = i === idx;
          const color = isCompleted ? C.success : isActive ? C.gold : `${C.subtext}55`;
          return (
            <div key={step.key} className="relative z-10 flex flex-1 items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
              <motion.div
                animate={isActive ? { boxShadow: [`0 0 0 0px ${C.goldGlow}`, `0 0 0 8px rgba(200,160,58,0)`] } : {}}
                transition={isActive ? { duration: 1.6, repeat: Infinity } : {}}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: isCompleted || isActive ? color : C.card, border: `2px solid ${color}`, color: isCompleted || isActive ? "#FFFDF8" : C.subtext }}
              >
                <step.icon size={15} />
              </motion.div>
              <p className="text-[11px] font-semibold leading-tight" style={{ color: isCompleted || isActive ? C.text : C.subtext }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                 */
/* ------------------------------------------------------------------ */
let crystoFixIdCounter = 0;

function createCrystoFixId(prefix: string) {
  crystoFixIdCounter += 1;
  return `${prefix}-${crystoFixIdCounter}`;
}

export default function GarageDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>(INITIAL_ACTIVE_JOBS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [todayLabel, setTodayLabel] = useState("");
  const [jobFilter, setJobFilter] = useState<"all" | "active" | "completed">("all");

  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    customerName: "",
    vehicleName: "",
    regNumber: "",
    serviceType: SERVICE_TYPES[0],
    pickupRequired: false,
    phone: "",
    address: "",
  });

  const [assignTechJobId, setAssignTechJobId] = useState<string | null>(null);
  const [trackDriverJobId, setTrackDriverJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "photos" | "inspection" | "invoice">("overview");
  const [partForm, setPartForm] = useState({ name: "", cost: "" });

 useEffect(() => {
  const timer = window.setTimeout(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, 0);

  return () => window.clearTimeout(timer);
}, []);

 function pushToast(message: string) {
  const id = toasts.length + 1;
  setToasts((prev) => [...prev, { id, message }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3200);
}

  function goTo(id: string) {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* -------------------------------------------------------------- */
  /*  Booking requests                                                */
  /* -------------------------------------------------------------- */

  function acceptRequest(reqId: string) {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    const newJob: ActiveJob = {
    id: createCrystoFixId("job"),
      vehicleName: req.vehicleName,
      regNumber: req.regNumber,
      customer: req.customer,
      serviceType: req.serviceType,
      pickupRequired: req.pickupRequired,
      status: "received",
      eta: "Pending schedule",
      technician: null,
      driverAssigned: null,
      pickupTime: null,
      beforePhotos: [],
      afterPhotos: [],
      inspection: { complaint: "", technicianNotes: "", recommendedRepairs: "", partsNeeded: "" },
      invoice: { parts: [], laborCost: 0, taxRate: 18, generated: false },
    };
    setActiveJobs((prev) => [newJob, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    pushToast(`${req.vehicleName} accepted — added to Active Jobs`);
  }

  function rejectRequest(reqId: string) {
    const req = requests.find((r) => r.id === reqId);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    if (req) pushToast(`${req.vehicleName} request declined`);
  }

  function handleCreateBooking(e: FormEvent) {
    e.preventDefault();
    if (!bookingForm.customerName || !bookingForm.vehicleName || !bookingForm.regNumber || !bookingForm.phone) return;
    const newReq: ServiceRequest = {
      id: `r-${Date.now()}`,
      vehicleName: bookingForm.vehicleName,
      regNumber: bookingForm.regNumber,
      customer: {
        name: bookingForm.customerName,
        id: `CRY-2026-${Math.floor(100 + Math.random() * 899)}`,
        phone: bookingForm.phone,
        address: bookingForm.address || "Not provided",
      },
      serviceType: bookingForm.serviceType,
      pickupRequired: bookingForm.pickupRequired,
      date: "Today",
    };
    setRequests((prev) => [newReq, ...prev]);
    pushToast("New booking request created");
    setCreateBookingOpen(false);
    setBookingForm({ customerName: "", vehicleName: "", regNumber: "", serviceType: SERVICE_TYPES[0], pickupRequired: false, phone: "", address: "" });
  }

  /* -------------------------------------------------------------- */
  /*  Active jobs                                                     */
  /* -------------------------------------------------------------- */

  function advanceStatus(jobId: string) {
    const job = activeJobs.find((j) => j.id === jobId);
    if (!job) return;
    const idx = statusIndex(job.status);
    if (idx >= JOB_STATUS_STEPS.length - 1) return;
    const next = JOB_STATUS_STEPS[idx + 1];
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: next.key } : j)));
    if (next.key === "completed" && job.technician) {
      const freedTech = job.technician;
      setTechnicians((prev) => prev.map((t) => (t.name === freedTech ? { ...t, status: "Available", currentJob: null } : t)));
    }
    pushToast(`${job.vehicleName} moved to ${next.label}`);
  }

  function confirmAssignTechnician(jobId: string, techId: string) {
    const job = activeJobs.find((j) => j.id === jobId);
    const tech = technicians.find((t) => t.id === techId);
    if (!job || !tech) return;
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === techId) return { ...t, status: "Busy", currentJob: job.serviceType };
        if (job.technician && t.name === job.technician) return { ...t, status: "Available", currentJob: null };
        return t;
      })
    );
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, technician: tech.name } : j)));
    pushToast(`${tech.name} assigned to ${job.vehicleName}`);
    setAssignTechJobId(null);
  }

  function assignDriver(jobId: string, driver: string) {
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, driverAssigned: driver, pickupTime: j.pickupTime || "Within 30 minutes" } : j)));
    pushToast(`${driver} assigned for pickup`);
  }

  function addPhotos(jobId: string, kind: "before" | "after", files: FileList | File[]) {
    const imgFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imgFiles.length === 0) return;
    setActiveJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const current = kind === "before" ? j.beforePhotos : j.afterPhotos;
        const room = Math.max(0, 6 - current.length);
        const toAdd: UploadedPhoto[] = imgFiles.slice(0, room).map((file) => ({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          url: URL.createObjectURL(file),
        }));
        return kind === "before" ? { ...j, beforePhotos: [...current, ...toAdd] } : { ...j, afterPhotos: [...current, ...toAdd] };
      })
    );
  }

  function removePhoto(jobId: string, kind: "before" | "after", photoId: string) {
    setActiveJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const arr = kind === "before" ? j.beforePhotos : j.afterPhotos;
        const target = arr.find((p) => p.id === photoId);
        if (target) URL.revokeObjectURL(target.url);
        const filtered = arr.filter((p) => p.id !== photoId);
        return kind === "before" ? { ...j, beforePhotos: filtered } : { ...j, afterPhotos: filtered };
      })
    );
  }

  function updateInspection(jobId: string, field: keyof InspectionInfo, value: string) {
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, inspection: { ...j.inspection, [field]: value } } : j)));
  }

  function updateLaborCost(jobId: string, value: number) {
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, invoice: { ...j.invoice, laborCost: value } } : j)));
  }

  function addInvoicePart(jobId: string) {
    const cost = Number(partForm.cost);
    if (!partForm.name.trim() || Number.isNaN(cost) || cost <= 0) return;
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, invoice: { ...j.invoice, parts: [...j.invoice.parts, { name: partForm.name.trim(), cost }] } } : j)));
    setPartForm({ name: "", cost: "" });
  }

  function removeInvoicePart(jobId: string, index: number) {
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, invoice: { ...j.invoice, parts: j.invoice.parts.filter((_, i) => i !== index) } } : j)));
  }

  function generateInvoice(jobId: string) {
    setActiveJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, invoice: { ...j.invoice, generated: true } } : j)));
    pushToast("Invoice generated successfully");
  }

  function viewJobDetails(jobId: string) {
    setSelectedJobId(jobId);
    setModalTab("overview");
  }

  /* -------------------------------------------------------------- */
  /*  Derived data                                                    */
  /* -------------------------------------------------------------- */

  const selectedJob = activeJobs.find((j) => j.id === selectedJobId) || null;
  const assignTechJob = activeJobs.find((j) => j.id === assignTechJobId) || null;
  const trackDriverJob = activeJobs.find((j) => j.id === trackDriverJobId) || null;

  const pendingJobs = requests.length;
  const inProgress = activeJobs.filter((j) => j.status !== "completed").length;
  const completedToday = activeJobs.filter((j) => j.status === "completed").length;
  const todaysBookings = requests.length + activeJobs.length;
  const revenueToday = activeJobs
    .filter((j) => j.invoice.generated)
    .reduce((sum, j) => {
      const partsSum = j.invoice.parts.reduce((s, p) => s + p.cost, 0);
      const subtotal = partsSum + j.invoice.laborCost;
      return sum + subtotal + (subtotal * j.invoice.taxRate) / 100;
    }, 0);
  const monthlyRevenue = 486200;
  const avgTicketSize = Math.round(monthlyRevenue / 210);
  const revenueWeek = REVENUE_CHART.reduce((sum, d) => sum + d.amount, 0);
  const maxRevenueDay = Math.max(...REVENUE_CHART.map((d) => d.amount));

  const pickupJobs = activeJobs.filter((j) => j.pickupRequired && j.status !== "completed");

  const customerDirectory = (() => {
    const map = new Map<string, { customer: CustomerInfo; vehicles: string[] }>();
    [...requests, ...activeJobs].forEach((item) => {
      const key = item.customer.id;
      const existing = map.get(key);
      if (existing) {
        if (!existing.vehicles.includes(item.vehicleName)) existing.vehicles.push(item.vehicleName);
      } else {
        map.set(key, { customer: item.customer, vehicles: [item.vehicleName] });
      }
    });
    return Array.from(map.values());
  })();

  const filteredJobs = activeJobs.filter((j) => {
    if (jobFilter === "active") return j.status !== "completed";
    if (jobFilter === "completed") return j.status === "completed";
    return true;
  });

  const stats = [
    { label: "Today's Bookings", value: String(todaysBookings), icon: ClipboardList },
    { label: "Pending Jobs", value: String(pendingJobs), icon: HistoryIcon },
    { label: "In Progress", value: String(inProgress), icon: Wrench },
    { label: "Completed Today", value: String(completedToday), icon: CheckCircle2 },
    { label: "Revenue Today", value: `₹${Math.round(revenueToday).toLocaleString("en-IN")}`, icon: Wallet },
    { label: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString("en-IN")}`, icon: TrendingUp },
  ];

  const quickActions = [
    { title: "Create Booking", icon: Plus, onClick: () => setCreateBookingOpen(true) },
    {
      title: "Assign Technician",
      icon: Users,
      onClick: () => {
        goTo("vehicles");
        pushToast("Tap Assign on any active job to assign a technician");
      },
    },
    {
      title: "Generate Invoice",
      icon: FileText,
      onClick: () => {
        goTo("vehicles");
        pushToast("Open a job and use its Invoice tab to generate a bill");
      },
    },
    {
      title: "Call Customer",
      icon: Phone,
      onClick: () => {
        goTo("customers");
        pushToast("Tap Call on any customer below");
      },
    },
    {
      title: "View History",
      icon: HistoryIcon,
      onClick: () => {
        setJobFilter("completed");
        goTo("vehicles");
      },
    },
  ];

  const SERVICE_ICON: Record<string, typeof Wrench> = {
    "General Service": Wrench,
    "Engine Repair": Cog,
    "Electrical Repair": Zap,
    Denting: Hammer,
    Painting: Paintbrush,
    "AC Repair": Wind,
    Battery: BatteryCharging,
    Other: HelpCircle,
  };

  return (
    <div
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${manrope.variable} relative min-h-screen overflow-x-hidden`}
      style={{ backgroundColor: C.cream, fontFamily: "var(--font-manrope)", color: C.text }}
    >
      {/* ---------------------------------------------------------- */}
      {/*  Ambient luxury background                                   */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: C.cream }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 620px at 10% -10%, rgba(200,160,58,0.18), transparent 60%), radial-gradient(900px 560px at 108% 6%, rgba(22,63,45,0.13), transparent 55%), radial-gradient(750px 520px at 50% 115%, rgba(200,160,58,0.14), transparent 60%), linear-gradient(180deg, #FFF8EE 0%, #F8F4EA 45%, #FFF8EE 100%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.045]" preserveAspectRatio="none">
          <defs>
            <pattern id="garageGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0 L0 0 0 64" fill="none" stroke={C.darkGreen} strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#garageGrid)" />
        </svg>
        <svg className="absolute -right-20 top-20 h-64 w-64 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke={C.gold} strokeWidth="1" />
          <circle cx="100" cy="100" r="70" stroke={C.gold} strokeWidth="1" />
        </svg>
        <svg className="absolute -left-14 bottom-24 h-56 w-56 opacity-[0.05]" viewBox="0 0 200 200" fill="none">
          <rect x="10" y="10" width="180" height="180" stroke={C.darkGreen} strokeWidth="1" />
        </svg>
        <svg className="absolute -right-10 bottom-0 h-[260px] w-[540px] opacity-[0.05]" viewBox="0 0 720 360" fill="none">
          <path
            d="M40 260 Q40 220 90 212 L150 212 Q190 140 270 122 L460 122 Q540 140 580 212 L630 212 Q680 220 680 260 L680 288 Q680 302 662 302 L610 302 Q604 336 566 336 Q528 336 522 302 L200 302 Q194 336 156 336 Q118 336 112 302 L58 302 Q40 302 40 288 Z"
            stroke={C.darkGreen}
            strokeWidth="1.5"
          />
          <circle cx="200" cy="302" r="44" stroke={C.darkGreen} strokeWidth="1.5" />
          <circle cx="524" cy="302" r="44" stroke={C.darkGreen} strokeWidth="1.5" />
        </svg>
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
      {/*  Header                                                       */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: `${C.cream}e0`, borderColor: `${C.gold}35` }}>
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
                SMN Garage
              </p>
              <p className="hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] sm:flex" style={{ color: C.subtext }}>
                <Calendar size={11} /> {todayLabel}
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
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: C.danger, boxShadow: `0 0 0 2px ${C.cream}` }} />
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
                SG
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-semibold" style={{ color: C.text }}>
                  SMN Garage
                </p>
                <p className="text-[10px]" style={{ color: C.gold }}>
                  Certified Partner
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
        <section id="dashboard" className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-2 lg:gap-16 lg:pt-20">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Eyebrow>Certified Partner Garage</Eyebrow>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.6rem]"
              style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}
            >
              Welcome Back,
              <br />
              <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: C.gold }}>SMN Garage</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: C.subtext }}>
              Manage bookings, track repairs and deliver premium customer experiences.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => goTo("bookings")}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
              >
                <ClipboardList size={16} /> {requests.length} New Requests
              </button>
              <button
                onClick={() => goTo("vehicles")}
                className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.03]"
                style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen, border: `1px solid ${C.gold}40` }}
              >
                <Wrench size={16} /> {inProgress} Jobs In Progress
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="group relative mx-auto aspect-[6/5.6] w-full max-w-lg overflow-hidden rounded-[2rem] p-2"
            style={{ border: `1.5px solid ${C.gold}`, boxShadow: `0 30px 70px rgba(14,42,31,0.25), 0 0 0 1px ${C.goldGlow}`, backgroundColor: C.darkGreen }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
              <GarageHeroArtwork />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 22%, transparent 40%)" }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 60px ${C.goldLight}55` }}
              />
            </div>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Stats                                                       */}
        {/* ---------------------------------------------------------- */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mt-20 grid grid-cols-2 gap-4 sm:mt-24 lg:grid-cols-3 xl:grid-cols-6 lg:gap-5"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: `0 20px 45px rgba(14,42,31,0.14), 0 0 0 1px ${C.goldGlow}` }}
              className="rounded-2xl p-5"
              style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.06)" }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}>
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide" style={{ color: C.subtext }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* ---------------------------------------------------------- */}
        {/*  Quick actions                                                */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="Move Fast" title="Quick Actions" />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {quickActions.map((a) => (
              <motion.button
                key={a.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.03, boxShadow: `0 22px 50px rgba(14,42,31,0.3), 0 0 26px ${C.goldGlow}` }}
                whileTap={{ scale: 0.98 }}
                onClick={a.onClick}
                className="flex flex-col items-start gap-4 rounded-2xl p-5 text-left"
                style={{ backgroundColor: C.darkGreen, border: `1px solid ${C.gold}`, boxShadow: "0 14px 36px rgba(14,42,31,0.2)" }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: `${C.goldLight}22`, color: C.gold }}>
                  <a.icon size={19} />
                </div>
                <p className="text-sm font-semibold" style={{ color: C.cream, fontFamily: "var(--font-playfair)" }}>
                  {a.title}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  New service requests                                        */}
        {/* ---------------------------------------------------------- */}
        <section id="bookings" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="Act Fast" title="New Service Requests" subtitle="Fresh bookings waiting for your approval." />
          {requests.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: C.card, border: `1px dashed ${C.gold}40` }}>
              <p className="text-sm" style={{ color: C.subtext }}>
                No new requests right now. New bookings will appear here.
              </p>
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="overflow-hidden rounded-3xl"
                  style={{ backgroundColor: C.card, border: `1.5px solid ${C.gold}45`, boxShadow: "0 16px 40px rgba(14,42,31,0.08)" }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
                          {r.vehicleName}
                        </p>
                        <p className="mt-0.5 text-xs font-medium tracking-wide" style={{ color: C.gold }}>
                          {r.regNumber}
                        </p>
                      </div>
                      <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${C.gold}18`, color: C.gold }}>
                        {r.date}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span style={{ color: C.subtext }}>Customer</span>
                        <span className="font-medium" style={{ color: C.text }}>
                          {r.customer.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: C.subtext }}>Service</span>
                        <span className="font-medium" style={{ color: C.text }}>
                          {r.serviceType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: C.subtext }}>Pickup</span>
                        <span className="font-medium" style={{ color: r.pickupRequired ? C.gold : C.subtext }}>
                          {r.pickupRequired ? "Required" : "Not Required"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => acceptRequest(r.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
                      >
                        <Check size={15} /> Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => rejectRequest(r.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-semibold"
                        style={{ backgroundColor: `${C.danger}12`, color: C.danger, border: `1px solid ${C.danger}35` }}
                      >
                        <X size={15} /> Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Active jobs                                                  */}
        {/* ---------------------------------------------------------- */}
        <section id="vehicles" className="mt-20 scroll-mt-24 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="In The Workshop" title="Active Jobs" subtitle="Every vehicle currently in your care." />
            <div className="mb-8 flex gap-2 rounded-full p-1" style={{ backgroundColor: `${C.darkGreen}0d` }}>
              {(
                [
                  { key: "all" as const, label: "All" },
                  { key: "active" as const, label: "In Progress" },
                  { key: "completed" as const, label: "Completed" },
                ]
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setJobFilter(f.key)}
                  className="rounded-full px-4 py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor: jobFilter === f.key ? C.darkGreen : "transparent",
                    color: jobFilter === f.key ? C.goldLight : C.subtext,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredJobs.map((j) => (
              <motion.div
                key={j.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-3xl p-6"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 16px 40px rgba(14,42,31,0.07)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
                      {j.vehicleName}
                    </p>
                    <p className="mt-0.5 text-xs font-medium tracking-wide" style={{ color: C.gold }}>
                      {j.regNumber} · {j.customer.name}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: `${statusPillColor(j.status)}1a`, color: statusPillColor(j.status) }}
                  >
                    {JOB_STATUS_STEPS[statusIndex(j.status)].label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs" style={{ color: C.subtext }}>
                  <span className="flex items-center gap-1.5">
                    {(() => {
                      const ServiceIcon = SERVICE_ICON[j.serviceType] ?? Wrench;
                      return <ServiceIcon size={12} />;
                    })()}
                    {j.serviceType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {j.eta}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={12} /> {j.technician ?? "Unassigned"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} /> {j.pickupRequired ? "Pickup requested" : "Self drop-off"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => viewJobDetails(j.id)}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:scale-105"
                    style={{ backgroundColor: C.darkGreen, color: C.goldLight, border: `1px solid ${C.gold}55` }}
                  >
                    <Eye size={13} /> View Details
                  </button>
                  <button
                    onClick={() => setAssignTechJobId(j.id)}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:scale-105"
                    style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                  >
                    <Users size={13} /> Assign
                  </button>
                  {j.status !== "completed" ? (
                    <button
                      onClick={() => advanceStatus(j.id)}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                    >
                      Advance <ChevronRight size={13} />
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Pickup & drop                                                */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="On The Move" title="Pickup &amp; Drop" subtitle="Vehicles awaiting collection or return." />
          {pickupJobs.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: C.card, border: `1px dashed ${C.gold}40` }}>
              <p className="text-sm" style={{ color: C.subtext }}>
                No pickup requests at the moment.
              </p>
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pickupJobs.map((j) => (
                <motion.div
                  key={j.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.06)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}>
                      <Navigation size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: C.text }}>
                        {j.vehicleName} · {j.regNumber}
                      </p>
                      <p className="text-xs" style={{ color: C.subtext }}>
                        {j.customer.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl p-3" style={{ backgroundColor: `${C.darkGreen}06` }}>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: C.subtext }}>
                        Driver
                      </p>
                      <p className="mt-0.5 font-semibold" style={{ color: C.text }}>
                        {j.driverAssigned ?? "Not assigned"}
                      </p>
                    </div>
                    <div className="rounded-xl p-3" style={{ backgroundColor: `${C.darkGreen}06` }}>
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: C.subtext }}>
                        Pickup Time
                      </p>
                      <p className="mt-0.5 font-semibold" style={{ color: C.text }}>
                        {j.pickupTime ?? "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2.5">
                    {j.driverAssigned ? (
                      <button
                        onClick={() => setTrackDriverJobId(j.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                      >
                        <Navigation size={13} /> Track Driver
                      </button>
                    ) : (
                      <div className="flex flex-1 gap-2">
                        {DRIVERS.slice(0, 1).map((d) => (
                          <button
                            key={d}
                            onClick={() => assignDriver(j.id, d)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold"
                            style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                          >
                            Assign Driver
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Technicians                                                  */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <SectionHeading eyebrow="Your Team" title="Technicians" subtitle="Who's working on what, right now." />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {technicians.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-5"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold"
                    style={{ background: `linear-gradient(145deg, ${C.goldLight}, ${C.gold})`, color: C.darkGreen }}
                  >
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: C.text }}>
                      {t.name}
                    </p>
                    <p className="truncate text-xs" style={{ color: C.subtext }}>
                      {t.currentJob ?? "No active job"}
                    </p>
                  </div>
                </div>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{
                    backgroundColor: t.status === "Available" ? `${C.success}1a` : `${C.gold}1a`,
                    color: t.status === "Available" ? "#1a8f5e" : C.gold,
                  }}
                >
                  {t.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Revenue                                                      */}
        {/* ---------------------------------------------------------- */}
        <section id="invoices" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="Business Health" title="Revenue" subtitle="Where your garage stands, at a glance." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid grid-cols-2 gap-4 lg:col-span-1"
            >
              {[
                { label: "Revenue Today", value: `₹${Math.round(revenueToday).toLocaleString("en-IN")}` },
                { label: "Revenue This Week", value: `₹${revenueWeek.toLocaleString("en-IN")}` },
                { label: "Revenue This Month", value: `₹${monthlyRevenue.toLocaleString("en-IN")}` },
                { label: "Avg. Ticket Size", value: `₹${avgTicketSize.toLocaleString("en-IN")}` },
              ].map((r) => (
                <motion.div key={r.label} variants={fadeUp} className="rounded-2xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30` }}>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                    {r.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide" style={{ color: C.subtext }}>
                    {r.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 lg:col-span-2"
              style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30` }}
            >
              <p className="mb-5 text-sm font-semibold" style={{ color: C.darkGreen }}>
                Last 7 Days
              </p>
              <div className="flex h-40 items-end justify-between gap-3">
                {REVENUE_CHART.map((d, i) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(d.amount / maxRevenueDay) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.06, ease: "easeOut" }}
                      className="w-full max-w-[36px] rounded-t-lg"
                      style={{ background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold})` }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: C.subtext }}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Customer directory                                          */}
        {/* ---------------------------------------------------------- */}
        <section id="customers" className="mt-20 scroll-mt-24 sm:mt-24">
          <SectionHeading eyebrow="Relationships" title="Customer Directory" subtitle="Everyone you're currently serving." />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customerDirectory.map(({ customer, vehicles }) => (
              <motion.div
                key={customer.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-5"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 12px 30px rgba(14,42,31,0.06)" }}
              >
                <p className="text-sm font-semibold" style={{ color: C.text }}>
                  {customer.name}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: C.gold }}>
                  {customer.id}
                </p>
                <p className="mt-3 text-xs" style={{ color: C.subtext }}>
                  {vehicles.join(" · ")}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${customer.phone.replace(/\s/g, "")}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold"
                    style={{ backgroundColor: C.darkGreen, color: C.goldLight }}
                  >
                    <Phone size={12} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${customer.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold"
                    style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Garage profile strip                                        */}
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
              <div className="grid h-14 w-14 place-items-center rounded-full text-lg font-semibold" style={{ background: `linear-gradient(145deg, ${C.goldLight}, ${C.gold})`, color: C.darkGreen }}>
                SG
              </div>
              <div>
                <p className="text-lg" style={{ fontFamily: "var(--font-playfair)", color: C.goldLight }}>
                  SMN Garage
                </p>
                <p className="text-xs" style={{ color: "#D8E4DC" }}>
                  Bengaluru, Karnataka · CrystoFix Certified Partner since 2024
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ backgroundColor: `${C.goldLight}1f` }}>
              <Sparkles size={16} style={{ color: C.goldLight }} />
              <span className="text-xs font-semibold" style={{ color: C.goldLight }}>
                4.8 Average Rating
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/*  Bottom navigation                                            */}
      {/* ---------------------------------------------------------- */}
      <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div
          className="flex items-center gap-1 overflow-x-auto rounded-full px-2 py-2 backdrop-blur-2xl"
          style={{ backgroundColor: `${C.darkGreen}d9`, border: `1px solid ${C.gold}66`, boxShadow: `0 20px 50px rgba(14,42,31,0.4), 0 0 28px ${C.goldGlow}, inset 0 1px 0 rgba(255,255,255,0.08)` }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => goTo(item.id)} className="relative flex shrink-0 flex-col items-center gap-1 rounded-full px-3.5 py-2 transition">
                {isActive ? (
                  <motion.div
                    layoutId="garage-nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: `${C.gold}26`, boxShadow: `0 0 0 1px ${C.gold}55, 0 0 16px ${C.goldGlow}` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <item.icon size={17} className="relative" style={{ color: isActive ? C.goldLight : "#9FB3A6" }} />
                <span className="relative text-[10px] font-medium" style={{ color: isActive ? C.goldLight : "#9FB3A6" }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ---------------------------------------------------------- */}
      {/*  Toasts                                                       */}
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
      {/*  Create booking modal                                        */}
      {/* ---------------------------------------------------------- */}
      <Modal open={createBookingOpen} onClose={() => setCreateBookingOpen(false)} title="Create a Booking">
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <FieldLabel>Customer Name</FieldLabel>
            <input
              required
              value={bookingForm.customerName}
              onChange={(e) => setBookingForm((f) => ({ ...f, customerName: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Vehicle</FieldLabel>
              <input
                required
                value={bookingForm.vehicleName}
                onChange={(e) => setBookingForm((f) => ({ ...f, vehicleName: e.target.value }))}
                placeholder="e.g. Tata Nexon"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Reg. Number</FieldLabel>
              <input
                required
                value={bookingForm.regNumber}
                onChange={(e) => setBookingForm((f) => ({ ...f, regNumber: e.target.value }))}
                placeholder="KA09 XY 4321"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Service Type</FieldLabel>
            <select
              value={bookingForm.serviceType}
              onChange={(e) => setBookingForm((f) => ({ ...f, serviceType: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle}
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Phone</FieldLabel>
              <input
                required
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Pickup Required?</FieldLabel>
              <div className="flex gap-2">
                {(
                  [
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setBookingForm((f) => ({ ...f, pickupRequired: opt.value }))}
                    className="flex-1 rounded-xl py-3 text-sm font-semibold"
                    style={{
                      backgroundColor: bookingForm.pickupRequired === opt.value ? C.darkGreen : `${C.darkGreen}06`,
                      color: bookingForm.pickupRequired === opt.value ? C.goldLight : C.text,
                      border: `1px solid ${C.gold}30`,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <FieldLabel>Address (optional)</FieldLabel>
            <input
              value={bookingForm.address}
              onChange={(e) => setBookingForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
          >
            Create Booking
          </button>
        </form>
      </Modal>

      {/* ---------------------------------------------------------- */}
      {/*  Assign technician modal                                     */}
      {/* ---------------------------------------------------------- */}
      <Modal open={!!assignTechJobId} onClose={() => setAssignTechJobId(null)} title="Assign Technician">
        {assignTechJob ? (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: C.subtext }}>
              Assigning for <span className="font-semibold" style={{ color: C.text }}>{assignTechJob.vehicleName}</span>
            </p>
            {technicians.map((t) => (
              <button
                key={t.id}
                onClick={() => confirmAssignTechnician(assignTechJob.id, t.id)}
                className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:scale-[1.01]"
                style={{
                  backgroundColor: assignTechJob.technician === t.name ? C.darkGreen : `${C.darkGreen}06`,
                  border: `1px solid ${C.gold}30`,
                }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: assignTechJob.technician === t.name ? C.goldLight : C.text }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: assignTechJob.technician === t.name ? `${C.cream}99` : C.subtext }}>
                    {t.status === "Busy" ? `Currently: ${t.currentJob}` : "Available now"}
                  </p>
                </div>
                {assignTechJob.technician === t.name ? <Check size={16} style={{ color: C.goldLight }} /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </Modal>

      {/* ---------------------------------------------------------- */}
      {/*  Track driver modal                                          */}
      {/* ---------------------------------------------------------- */}
      <Modal open={!!trackDriverJobId} onClose={() => setTrackDriverJobId(null)} title="Track Driver">
        {trackDriverJob ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl p-4" style={{ backgroundColor: `${C.darkGreen}08` }}>
              <div className="grid h-11 w-11 place-items-center rounded-full" style={{ backgroundColor: `${C.gold}22`, color: C.gold }}>
                <Navigation size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.text }}>
                  {trackDriverJob.driverAssigned}
                </p>
                <p className="text-xs" style={{ color: C.subtext }}>
                  Heading to {trackDriverJob.customer.address}
                </p>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${C.gold}22` }}>
              <motion.div
                initial={{ width: "10%" }}
                animate={{ width: "58%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }}
              />
            </div>
            <p className="text-xs" style={{ color: C.subtext }}>
              Estimated arrival: {trackDriverJob.pickupTime}
            </p>
          </div>
        ) : null}
      </Modal>

      {/* ---------------------------------------------------------- */}
      {/*  Job detail modal — tabbed                                   */}
      {/* ---------------------------------------------------------- */}
      <Modal open={!!selectedJobId} onClose={() => setSelectedJobId(null)} title={selectedJob ? `${selectedJob.vehicleName} · ${selectedJob.regNumber}` : "Job Details"} wide>
        {selectedJob ? (
          <div>
            <div className="mb-6 flex gap-2 overflow-x-auto rounded-full p-1" style={{ backgroundColor: `${C.darkGreen}0d` }}>
              {(
                [
                  { key: "overview" as const, label: "Overview" },
                  { key: "photos" as const, label: "Photos" },
                  { key: "inspection" as const, label: "Inspection" },
                  { key: "invoice" as const, label: "Invoice" },
                ]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setModalTab(tab.key)}
                  className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition"
                  style={{ backgroundColor: modalTab === tab.key ? C.darkGreen : "transparent", color: modalTab === tab.key ? C.goldLight : C.subtext }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {modalTab === "overview" ? (
              <div className="space-y-6">
                <ServiceTracker status={selectedJob.status} />

                {selectedJob.status !== "completed" ? (
                  <button
                    onClick={() => advanceStatus(selectedJob.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                  >
                    Advance to Next Stage <ChevronRight size={15} />
                  </button>
                ) : null}

                <div className="rounded-2xl p-5" style={{ backgroundColor: C.card, border: `1px solid ${C.gold}30` }}>
                  <p className="mb-4 text-sm font-semibold" style={{ color: C.darkGreen }}>
                    Customer Details
                  </p>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span style={{ color: C.subtext }}>Name</span>
                      <span className="font-medium" style={{ color: C.text }}>
                        {selectedJob.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: C.subtext }}>Customer ID</span>
                      <span className="font-medium" style={{ color: C.text }}>
                        {selectedJob.customer.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: C.subtext }}>Phone</span>
                      <span className="font-medium" style={{ color: C.text }}>
                        {selectedJob.customer.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: C.subtext }}>Address</span>
                      <span className="max-w-[60%] text-right font-medium" style={{ color: C.text }}>
                        {selectedJob.customer.address}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: C.subtext }}>Vehicle Number</span>
                      <span className="font-medium" style={{ color: C.text }}>
                        {selectedJob.regNumber}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <a
                      href={`tel:${selectedJob.customer.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: C.darkGreen }}
                    >
                      <Phone size={13} /> Call Customer
                    </a>
                    <a
                      href={`https://wa.me/${selectedJob.customer.phone.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
                      style={{ backgroundColor: `${C.success}18`, color: "#1a8f5e" }}
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.customer.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold"
                      style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                    >
                      <Navigation size={13} /> Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            {modalTab === "photos" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <PhotoUploadZone
                  label="Before Repair Photos"
                  photos={selectedJob.beforePhotos}
                  onAdd={(files) => addPhotos(selectedJob.id, "before", files)}
                  onRemove={(id) => removePhoto(selectedJob.id, "before", id)}
                />
                <PhotoUploadZone
                  label="After Repair Photos"
                  photos={selectedJob.afterPhotos}
                  onAdd={(files) => addPhotos(selectedJob.id, "after", files)}
                  onRemove={(id) => removePhoto(selectedJob.id, "after", id)}
                />
              </div>
            ) : null}

            {modalTab === "inspection" ? (
              <div className="space-y-4">
                <div>
                  <FieldLabel>Customer Complaint</FieldLabel>
                  <textarea
                    value={selectedJob.inspection.complaint}
                    onChange={(e) => updateInspection(selectedJob.id, "complaint", e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Technician Notes</FieldLabel>
                  <textarea
                    value={selectedJob.inspection.technicianNotes}
                    onChange={(e) => updateInspection(selectedJob.id, "technicianNotes", e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Recommended Repairs</FieldLabel>
                  <textarea
                    value={selectedJob.inspection.recommendedRepairs}
                    onChange={(e) => updateInspection(selectedJob.id, "recommendedRepairs", e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Parts Needed</FieldLabel>
                  <input
                    value={selectedJob.inspection.partsNeeded}
                    onChange={(e) => updateInspection(selectedJob.id, "partsNeeded", e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <button
                  onClick={() => pushToast("Inspection report saved")}
                  className="w-full rounded-full py-3.5 text-sm font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
                >
                  Save Inspection Report
                </button>
              </div>
            ) : null}

            {modalTab === "invoice" ? (
              (() => {
                const partsSum = selectedJob.invoice.parts.reduce((s, p) => s + p.cost, 0);
                const subtotal = partsSum + selectedJob.invoice.laborCost;
                const tax = Math.round((subtotal * selectedJob.invoice.taxRate) / 100);
                const total = subtotal + tax;
                return (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-2xl p-4" style={{ backgroundColor: `${C.gold}10` }}>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: C.subtext }}>
                          Invoice Number
                        </p>
                        <p className="text-sm font-semibold" style={{ color: C.darkGreen }}>
                          INV-{selectedJob.id.toUpperCase()}
                        </p>
                      </div>
                      {selectedJob.invoice.generated ? (
                        <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${C.success}1a`, color: "#1a8f5e" }}>
                          Generated
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: C.subtext }}>
                          Customer
                        </p>
                        <p className="font-medium" style={{ color: C.text }}>
                          {selectedJob.customer.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: C.subtext }}>
                          Vehicle
                        </p>
                        <p className="font-medium" style={{ color: C.text }}>
                          {selectedJob.vehicleName}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: C.subtext }}>
                          Service
                        </p>
                        <p className="font-medium" style={{ color: C.text }}>
                          {selectedJob.serviceType}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl p-4" style={{ border: `1px solid ${C.gold}30` }}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: C.subtext }}>
                        Parts
                      </p>
                      <div className="space-y-2">
                        {selectedJob.invoice.parts.map((p, i) => (
                          <div key={`${p.name}-${i}`} className="flex items-center justify-between text-sm">
                            <span style={{ color: C.text }}>{p.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium" style={{ color: C.text }}>
                                ₹{p.cost.toLocaleString("en-IN")}
                              </span>
                              <button onClick={() => removeInvoicePart(selectedJob.id, i)} style={{ color: C.danger }}>
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          value={partForm.name}
                          onChange={(e) => setPartForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Part name"
                          className="flex-1 rounded-xl px-3 py-2 text-xs outline-none"
                          style={inputStyle}
                        />
                        <input
                          value={partForm.cost}
                          onChange={(e) => setPartForm((f) => ({ ...f, cost: e.target.value }))}
                          placeholder="Cost"
                          type="number"
                          className="w-24 rounded-xl px-3 py-2 text-xs outline-none"
                          style={inputStyle}
                        />
                        <button
                          onClick={() => addInvoicePart(selectedJob.id)}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                          style={{ backgroundColor: C.darkGreen, color: C.goldLight }}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Labor Cost</FieldLabel>
                      <input
                        type="number"
                        value={selectedJob.invoice.laborCost}
                        onChange={(e) => updateLaborCost(selectedJob.id, Number(e.target.value) || 0)}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                        style={inputStyle}
                      />
                    </div>

                    <div className="space-y-2 rounded-2xl p-4 text-sm" style={{ backgroundColor: `${C.darkGreen}06` }}>
                      <div className="flex items-center justify-between">
                        <span style={{ color: C.subtext }}>Subtotal</span>
                        <span style={{ color: C.text }}>₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: C.subtext }}>Tax (GST {selectedJob.invoice.taxRate}%)</span>
                        <span style={{ color: C.text }}>₹{tax.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 text-base font-semibold" style={{ borderColor: `${C.gold}30` }}>
                        <span style={{ color: C.darkGreen }}>Total Amount</span>
                        <span style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => pushToast("Invoice preview ready")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-semibold"
                        style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                      >
                        <Eye size={13} /> Preview Invoice
                      </button>
                      <button
                        onClick={() => generateInvoice(selectedJob.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
                      >
                        <ClipboardCheck size={13} /> Generate Invoice
                      </button>
                      <button
                        onClick={() => pushToast(`INV-${selectedJob.id.toUpperCase()} downloaded`)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-xs font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
