"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cog,
  Fuel,
  Hammer,
  HelpCircle,
  Home as HomeIcon,
  MessageSquare,
  Paintbrush,
  Pencil,
  Sparkles,
  Truck,
  UploadCloud,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Cormorant_Garamond, Inter, Manrope, Playfair_Display } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  Fonts — identical to the dashboard for visual continuity           */
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
/*  Palette — matches the CrystoFix dashboard exactly                  */
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
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  regNumber: string;
  color: string;
  fuelType: string;
  healthScore: number;
}

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: typeof Wrench;
}

interface UploadedPhoto {
  id: string;
  file: File;
  url: string;
}

type PickupDropOption = "yes" | "no" | null;

interface AddressInfo {
  pickupAddress: string;
  landmark: string;
  mobile: string;
}

/* ------------------------------------------------------------------ */
/*  Sample data                                                         */
/* ------------------------------------------------------------------ */

const VEHICLES: Vehicle[] = [
  { id: "v1", brand: "Honda", model: "City ZX", regNumber: "KA01 AB 1234", color: "White", fuelType: "Petrol", healthScore: 92 },
  { id: "v2", brand: "Hyundai", model: "Creta", regNumber: "KA05 CD 5678", color: "Grey", fuelType: "Diesel", healthScore: 87 },
];

const SERVICES: ServiceOption[] = [
  { id: "general", title: "General Service", description: "Complete checkup, oil change and multi-point inspection.", icon: Wrench },
  { id: "engine", title: "Engine Repair", description: "Diagnostics and repair for engine performance issues.", icon: Cog },
  { id: "electrical", title: "Electrical Repair", description: "Wiring, sensors, lighting and electronics fixes.", icon: Zap },
  { id: "denting", title: "Denting", description: "Precision dent removal and body panel restoration.", icon: Hammer },
  { id: "painting", title: "Painting", description: "Showroom-finish repainting and touch-ups.", icon: Paintbrush },
  { id: "ac", title: "AC Repair", description: "Cooling system diagnostics and gas refill.", icon: Wind },
  { id: "battery", title: "Battery", description: "Battery health check, jump-start or replacement.", icon: BatteryCharging },
  { id: "other", title: "Other", description: "Anything else — tell us what you need.", icon: HelpCircle },
];

const STEPS = [
  { id: 1, label: "Vehicle" },
  { id: 2, label: "Service" },
  { id: 3, label: "Problem" },
  { id: 4, label: "Photos" },
  { id: 5, label: "Pickup" },
  { id: 6, label: "Address" },
  { id: 7, label: "Summary" },
] as const;

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const stepVariants: Variants = {
  enter: { opacity: 0, x: 28 },
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -28, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Small helpers                                                       */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide" style={{ color: C.subtext }}>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: `${C.darkGreen}06`,
  border: `1px solid ${C.gold}30`,
  color: C.text,
};

/* ------------------------------------------------------------------ */
/*  Premium stepper                                                     */
/* ------------------------------------------------------------------ */

function Stepper({
  currentStep,
  maxStepReached,
  onStepClick,
}: {
  currentStep: number;
  maxStepReached: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isReachable = step.id <= maxStepReached;
          return (
            <div key={step.id} className="flex flex-1 items-center last:flex-initial">
              <button
                type="button"
                onClick={() => isReachable && onStepClick(step.id)}
                disabled={!isReachable}
                className="flex flex-col items-center gap-2"
                style={{ cursor: isReachable ? "pointer" : "default" }}
              >
                <motion.div
                  animate={
                    isCurrent
                      ? { boxShadow: [`0 0 0 0px ${C.goldGlow}`, `0 0 0 9px rgba(200,160,58,0)`] }
                      : {}
                  }
                  transition={isCurrent ? { duration: 1.8, repeat: Infinity } : {}}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold sm:h-11 sm:w-11 sm:text-sm"
                  style={{
                    backgroundColor: isCompleted ? C.success : isCurrent ? C.gold : C.card,
                    border: `2px solid ${isCompleted ? C.success : isCurrent ? C.gold : `${C.gold}35`}`,
                    color: isCompleted || isCurrent ? "#FFFDF8" : C.subtext,
                  }}
                >
                  {isCompleted ? <Check size={16} /> : step.id}
                </motion.div>
                <span
                  className="hidden text-[11px] font-semibold sm:block"
                  style={{ color: isCurrent ? C.darkGreen : isCompleted ? C.success : C.subtext }}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 ? (
                <div className="relative mx-1.5 h-[2px] flex-1 overflow-hidden rounded-full sm:mx-2" style={{ backgroundColor: `${C.gold}22` }}>
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: C.success }}
                    initial={false}
                    animate={{ width: step.id < currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 sm:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.gold }}>
          Step {currentStep} of {STEPS.length}
        </p>
        <p className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
          {STEPS[currentStep - 1].label}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function BookServicePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [problemDescription, setProblemDescription] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pickupDrop, setPickupDrop] = useState<PickupDropOption>(null);
  const [address, setAddress] = useState<AddressInfo>({ pickupAddress: "", landmark: "", mobile: "" });

  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<UploadedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const selectedVehicle = VEHICLES.find((v) => v.id === selectedVehicleId) || null;
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || null;

  function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setPhotos((prev) => {
      const room = Math.max(0, 6 - prev.length);
      const toAdd: UploadedPhoto[] = files.slice(0, room).map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  }

  function isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!selectedVehicleId;
      case 2:
        return !!selectedServiceId;
      case 3:
        return problemDescription.trim().length > 0;
      case 4:
        return true;
      case 5:
        return pickupDrop !== null;
      case 6: {
        const mobileOk = address.mobile.replace(/\D/g, "").length >= 10;
        if (pickupDrop === "yes") return mobileOk && address.pickupAddress.trim().length > 0;
        return mobileOk;
      }
      case 7:
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    if (!isStepValid(currentStep)) return;
    const next = Math.min(currentStep + 1, STEPS.length);
    setCurrentStep(next);
    setMaxStepReached((m) => Math.max(m, next));
  }

  function goBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function goToStep(step: number) {
    if (step <= maxStepReached) setCurrentStep(step);
  }

  function handleConfirm() {
    if (!isStepValid(6)) return;
    const id = `CRY-SR-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(id);
    setSubmitted(true);
  }

  function resetFlow() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setSelectedVehicleId(null);
    setSelectedServiceId(null);
    setProblemDescription("");
    setPhotos([]);
    setPickupDrop(null);
    setAddress({ pickupAddress: "", landmark: "", mobile: "" });
    setCurrentStep(1);
    setMaxStepReached(1);
    setSubmitted(false);
    setBookingId("");
  }

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
            <pattern id="bookGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0 L0 0 0 64" fill="none" stroke={C.darkGreen} strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bookGrid)" />
        </svg>
        <svg className="absolute -right-20 top-20 h-64 w-64 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke={C.gold} strokeWidth="1" />
          <circle cx="100" cy="100" r="70" stroke={C.gold} strokeWidth="1" />
        </svg>
        <svg className="absolute -left-14 bottom-24 h-56 w-56 opacity-[0.05]" viewBox="0 0 200 200" fill="none">
          <rect x="10" y="10" width="180" height="180" stroke={C.darkGreen} strokeWidth="1" />
        </svg>
        {[
          { top: "12%", left: "16%", size: 4, delay: 0 },
          { top: "68%", left: "6%", size: 3, delay: 0.6 },
          { top: "22%", left: "90%", size: 5, delay: 1.1 },
          { top: "80%", left: "86%", size: 3, delay: 1.7 },
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
      {/*  Minimal focused header                                      */}
      {/* ---------------------------------------------------------- */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ backgroundColor: `${C.cream}e0`, borderColor: `${C.gold}35` }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="grid h-9 w-9 place-items-center rounded-full sm:h-10 sm:w-10"
              style={{ background: `linear-gradient(145deg, ${C.green}, ${C.darkGreen})`, border: `1px solid ${C.gold}` }}
            >
              <span className="text-xs font-semibold sm:text-sm" style={{ color: C.goldLight, fontFamily: "var(--font-playfair)" }}>
                CF
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-sm sm:text-base" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                CrystoFix
              </p>
              <p className="hidden text-[10px] uppercase tracking-[0.2em] sm:block" style={{ color: C.subtext }}>
                Book a Service
              </p>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition hover:scale-105"
            style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-6 grid h-24 w-24 place-items-center rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`,
                  border: `1.5px solid ${C.gold}`,
                  boxShadow: `0 25px 60px rgba(14,42,31,0.3), 0 0 0 1px ${C.goldGlow}`,
                }}
              >
                <motion.div
                  animate={{ boxShadow: [`0 0 0 0px ${C.goldGlow}`, `0 0 0 16px rgba(200,160,58,0)`] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
                <Check size={40} style={{ color: C.goldLight }} strokeWidth={2.4} />
              </motion.div>

              <Eyebrow>Request Received</Eyebrow>
              <h1
                className="mt-4 text-3xl sm:text-4xl"
                style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}
              >
                Booking Confirmed
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: C.subtext }}>
                We&apos;ll contact you within 30 minutes to confirm the details. Keep your reference number handy.
              </p>

              <div
                className="mt-8 w-full max-w-sm rounded-3xl p-6 text-left"
                style={{ backgroundColor: C.card, border: `1px solid ${C.gold}45`, boxShadow: "0 20px 50px rgba(14,42,31,0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.subtext }}>
                    Reference Number
                  </span>
                  <Sparkles size={15} style={{ color: C.gold }} />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-wide" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
                  {bookingId}
                </p>
                <div className="mt-5 space-y-2.5 border-t pt-4 text-sm" style={{ borderColor: `${C.gold}25` }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.subtext }}>Vehicle</span>
                    <span className="font-medium" style={{ color: C.text }}>
                      {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.subtext }}>Service</span>
                    <span className="font-medium" style={{ color: C.text }}>
                      {selectedService?.title ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.subtext }}>Pickup &amp; Drop</span>
                    <span className="font-medium" style={{ color: C.text }}>
                      {pickupDrop === "yes" ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition hover:scale-[1.02]"
                  style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                >
                  <HomeIcon size={15} /> Back to Dashboard
                </Link>
                <button
                  onClick={resetFlow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, #B08D2E)` }}
                >
                  Book Another Service
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8 text-center sm:text-left">
                <Eyebrow>Premium Automotive Care</Eyebrow>
                <h1
                  className="mt-3 text-3xl sm:text-4xl"
                  style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}
                >
                  Book a Service
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.subtext }}>
                  Seven quick steps. Under a minute. Complete transparency.
                </p>
              </motion.div>

              <Stepper currentStep={currentStep} maxStepReached={maxStepReached} onStepClick={goToStep} />

              <AnimatePresence mode="wait">
                <motion.div key={currentStep} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  {/* ------------------------------------------------ */}
                  {/*  Step 1 — Vehicle                                  */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 1 ? (
                    <div>
                      <StepHeading title="Select Your Vehicle" subtitle="Which vehicle needs attention today?" />
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                      >
                        {VEHICLES.map((v) => {
                          const isSelected = selectedVehicleId === v.id;
                          return (
                            <motion.button
                              key={v.id}
                              type="button"
                              variants={fadeUp}
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setSelectedVehicleId(v.id)}
                              className="overflow-hidden rounded-3xl text-left transition-shadow"
                              style={{
                                backgroundColor: C.card,
                                border: `1.5px solid ${isSelected ? C.gold : `${C.gold}30`}`,
                                boxShadow: isSelected
                                  ? `0 20px 45px rgba(14,42,31,0.18), 0 0 0 3px ${C.goldGlow}`
                                  : "0 12px 30px rgba(14,42,31,0.06)",
                              }}
                            >
                              <div
                                className="relative flex h-28 items-center justify-center"
                                style={{ background: `linear-gradient(150deg, ${C.green}, ${C.darkGreen})` }}
                              >
                                <CarFront size={44} style={{ color: C.goldLight }} strokeWidth={1.3} />
                                {isSelected ? (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full"
                                    style={{ backgroundColor: C.gold }}
                                  >
                                    <Check size={14} style={{ color: C.darkGreen }} strokeWidth={3} />
                                  </motion.div>
                                ) : null}
                              </div>
                              <div className="p-5">
                                <p className="text-base font-semibold" style={{ fontFamily: "var(--font-playfair)", color: C.text }}>
                                  {v.brand} {v.model}
                                </p>
                                <p className="mt-0.5 text-xs font-medium tracking-wide" style={{ color: C.gold }}>
                                  {v.regNumber}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: C.subtext }}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.gold }} />
                                    {v.color}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Fuel size={12} /> {v.fuelType}
                                  </span>
                                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: C.success }}>
                                    {v.healthScore}% Health
                                  </span>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 2 — Service                                  */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 2 ? (
                    <div>
                      <StepHeading title="Select a Service" subtitle="Choose the care your vehicle needs." />
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                      >
                        {SERVICES.map((s) => {
                          const isSelected = selectedServiceId === s.id;
                          return (
                            <motion.button
                              key={s.id}
                              type="button"
                              variants={fadeUp}
                              whileHover={{ y: -4, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedServiceId(s.id)}
                              className="flex flex-col items-start gap-3 rounded-2xl p-5 text-left"
                              style={{
                                backgroundColor: isSelected ? C.darkGreen : C.card,
                                border: `1.5px solid ${isSelected ? C.gold : `${C.gold}30`}`,
                                boxShadow: isSelected
                                  ? `0 18px 40px rgba(14,42,31,0.28), 0 0 0 3px ${C.goldGlow}`
                                  : "0 10px 26px rgba(14,42,31,0.05)",
                              }}
                            >
                              <div
                                className="grid h-11 w-11 place-items-center rounded-xl"
                                style={{
                                  backgroundColor: isSelected ? `${C.goldLight}22` : `${C.darkGreen}0d`,
                                  color: isSelected ? C.goldLight : C.darkGreen,
                                }}
                              >
                                <s.icon size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: isSelected ? C.cream : C.text }}>
                                  {s.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed" style={{ color: isSelected ? `${C.cream}99` : C.subtext }}>
                                  {s.description}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 3 — Problem                                  */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 3 ? (
                    <div>
                      <StepHeading title="Describe the Issue" subtitle="A few details help our technicians prepare in advance." />
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl p-6"
                        style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 16px 40px rgba(14,42,31,0.06)" }}
                      >
                        <div className="mb-4 flex items-center gap-2.5">
                          <MessageSquare size={17} style={{ color: C.gold }} />
                          <p className="text-sm font-semibold" style={{ color: C.darkGreen }}>
                            Problem Description
                          </p>
                        </div>
                        <textarea
                          value={problemDescription}
                          onChange={(e) => setProblemDescription(e.target.value)}
                          placeholder="Describe your vehicle issue in detail..."
                          rows={8}
                          className="w-full resize-none rounded-2xl px-5 py-4 text-[15px] leading-relaxed outline-none"
                          style={inputStyle}
                        />
                        <p className="mt-2 text-right text-[11px]" style={{ color: C.subtext }}>
                          {problemDescription.trim().length} characters
                        </p>
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 4 — Photos                                   */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 4 ? (
                    <div>
                      <StepHeading title="Add Photos" subtitle="Optional, but it helps us diagnose faster. Up to 6 images." />
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                          }}
                          onDrop={onDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-3xl px-6 py-14 text-center transition-colors"
                          style={{
                            backgroundColor: isDragging ? `${C.gold}12` : C.card,
                            border: `2px dashed ${isDragging ? C.gold : `${C.gold}45`}`,
                          }}
                        >
                          <div
                            className="mb-4 grid h-16 w-16 place-items-center rounded-full"
                            style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                          >
                            <UploadCloud size={26} />
                          </div>
                          <p className="text-sm font-semibold" style={{ color: C.text }}>
                            Drag &amp; drop photos here
                          </p>
                          <p className="mt-1 text-xs" style={{ color: C.subtext }}>
                            or click to browse from your device
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={onFileInputChange}
                          />
                        </div>

                        {photos.length > 0 ? (
                          <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger}
                            className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4"
                          >
                            {photos.map((p) => (
                              <motion.div
                                key={p.id}
                                variants={fadeUp}
                                className="group relative aspect-square overflow-hidden rounded-2xl"
                                style={{ border: `1px solid ${C.gold}35` }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.url} alt="Uploaded vehicle issue" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(p.id)}
                                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                  style={{ backgroundColor: `${C.darkGreen}e6`, color: C.cream }}
                                >
                                  <X size={12} />
                                </button>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : null}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 5 — Pickup & Drop                            */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 5 ? (
                    <div>
                      <StepHeading title="Pickup &amp; Drop" subtitle="Would you like us to collect and return your vehicle?" />
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={stagger}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                      >
                        {(
                          [
                            { value: "yes" as const, title: "Yes, pick it up", desc: "We'll collect your vehicle and return it once ready.", icon: Truck },
                            { value: "no" as const, title: "No, I'll drop it off", desc: "I'll bring my vehicle to the garage myself.", icon: HomeIcon },
                          ]
                        ).map((opt) => {
                          const isSelected = pickupDrop === opt.value;
                          return (
                            <motion.button
                              key={opt.value}
                              type="button"
                              variants={fadeUp}
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => setPickupDrop(opt.value)}
                              className="flex flex-col items-start gap-4 rounded-3xl p-7 text-left"
                              style={{
                                backgroundColor: isSelected ? C.darkGreen : C.card,
                                border: `1.5px solid ${isSelected ? C.gold : `${C.gold}30`}`,
                                boxShadow: isSelected
                                  ? `0 20px 45px rgba(14,42,31,0.28), 0 0 0 3px ${C.goldGlow}`
                                  : "0 12px 30px rgba(14,42,31,0.06)",
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                <div
                                  className="grid h-12 w-12 place-items-center rounded-xl"
                                  style={{
                                    backgroundColor: isSelected ? `${C.goldLight}22` : `${C.darkGreen}0d`,
                                    color: isSelected ? C.goldLight : C.darkGreen,
                                  }}
                                >
                                  <opt.icon size={22} />
                                </div>
                                {isSelected ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="grid h-7 w-7 place-items-center rounded-full"
                                    style={{ backgroundColor: C.gold }}
                                  >
                                    <Check size={14} style={{ color: C.darkGreen }} strokeWidth={3} />
                                  </motion.div>
                                ) : null}
                              </div>
                              <div>
                                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: isSelected ? C.cream : C.text }}>
                                  {opt.title}
                                </p>
                                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: isSelected ? `${C.cream}b3` : C.subtext }}>
                                  {opt.desc}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 6 — Address                                  */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 6 ? (
                    <div>
                      <StepHeading
                        title="Contact & Address"
                        subtitle={pickupDrop === "yes" ? "Where should we collect your vehicle?" : "We just need a number to reach you."}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-5 rounded-3xl p-6"
                        style={{ backgroundColor: C.card, border: `1px solid ${C.gold}35`, boxShadow: "0 16px 40px rgba(14,42,31,0.06)" }}
                      >
                        {pickupDrop === "yes" ? (
                          <>
                            <div>
                              <FieldLabel>Pickup Address</FieldLabel>
                              <textarea
                                value={address.pickupAddress}
                                onChange={(e) => setAddress((a) => ({ ...a, pickupAddress: e.target.value }))}
                                placeholder="House / flat, street, area, city"
                                rows={3}
                                className="w-full resize-none rounded-2xl px-5 py-4 text-[15px] outline-none"
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <FieldLabel>Landmark (optional)</FieldLabel>
                              <input
                                value={address.landmark}
                                onChange={(e) => setAddress((a) => ({ ...a, landmark: e.target.value }))}
                                placeholder="e.g. Opposite City Mall"
                                className="w-full rounded-2xl px-5 py-4 text-[15px] outline-none"
                                style={inputStyle}
                              />
                            </div>
                          </>
                        ) : null}
                        <div>
                          <FieldLabel>Mobile Number</FieldLabel>
                          <input
                            type="tel"
                            value={address.mobile}
                            onChange={(e) => setAddress((a) => ({ ...a, mobile: e.target.value }))}
                            placeholder="+91 98450 12345"
                            className="w-full rounded-2xl px-5 py-4 text-[15px] outline-none"
                            style={inputStyle}
                          />
                        </div>
                      </motion.div>
                    </div>
                  ) : null}

                  {/* ------------------------------------------------ */}
                  {/*  Step 7 — Summary                                  */}
                  {/* ------------------------------------------------ */}
                  {currentStep === 7 ? (
                    <div>
                      <StepHeading title="Booking Summary" subtitle="Please review the details before confirming." />
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.green} 100%)`,
                          border: `1px solid ${C.gold}`,
                          boxShadow: `0 25px 60px rgba(14,42,31,0.3), 0 0 0 1px ${C.goldGlow}`,
                        }}
                      >
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.gold}30` }}>
                          <div className="flex items-center gap-2.5">
                            <ClipboardCheck size={17} style={{ color: C.goldLight }} />
                            <p className="text-sm font-semibold" style={{ color: C.goldLight }}>
                              Review Your Request
                            </p>
                          </div>
                          <Sparkles size={15} style={{ color: C.goldLight }} />
                        </div>

                        <div className="divide-y" style={{ borderColor: `${C.gold}20` } as React.CSSProperties}>
                          <SummaryRow
                            label="Vehicle"
                            value={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model} · ${selectedVehicle.regNumber}` : "Not selected"}
                            onEdit={() => goToStep(1)}
                          />
                          <SummaryRow label="Service" value={selectedService?.title ?? "Not selected"} onEdit={() => goToStep(2)} />
                          <SummaryRow
                            label="Problem"
                            value={problemDescription.trim() || "No description provided"}
                            onEdit={() => goToStep(3)}
                            multiline
                          />
                          <SummaryRow
                            label="Photos"
                            value={photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""} attached` : "No photos attached"}
                            onEdit={() => goToStep(4)}
                          />
                          <SummaryRow label="Pickup & Drop" value={pickupDrop === "yes" ? "Yes — collect and return" : "No — self drop-off"} onEdit={() => goToStep(5)} />
                          <SummaryRow
                            label="Address"
                            value={
                              pickupDrop === "yes"
                                ? [address.pickupAddress, address.landmark].filter(Boolean).join(" · ") || "Not provided"
                                : "Self drop-off at garage"
                            }
                            onEdit={() => goToStep(6)}
                          />
                          <SummaryRow label="Phone Number" value={address.mobile || "Not provided"} onEdit={() => goToStep(6)} />
                        </div>
                      </motion.div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* ------------------------------------------------ */}
              {/*  Navigation                                        */}
              {/* ------------------------------------------------ */}
              <div className="mt-10 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                    style={{ backgroundColor: `${C.darkGreen}0d`, color: C.darkGreen }}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < STEPS.length ? (
                  <motion.button
                    type="button"
                    onClick={goNext}
                    disabled={!isStepValid(currentStep)}
                    whileHover={isStepValid(currentStep) ? { scale: 1.03, boxShadow: `0 16px 40px rgba(14,42,31,0.3), 0 0 22px ${C.goldGlow}` } : {}}
                    whileTap={isStepValid(currentStep) ? { scale: 0.98 } : {}}
                    className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                    style={{
                      background: isStepValid(currentStep) ? `linear-gradient(135deg, ${C.green}, ${C.darkGreen})` : `${C.darkGreen}33`,
                      border: `1px solid ${isStepValid(currentStep) ? C.gold : "transparent"}`,
                      cursor: isStepValid(currentStep) ? "pointer" : "not-allowed",
                    }}
                  >
                    Continue <ChevronRight size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleConfirm}
                    whileHover={{ scale: 1.03, boxShadow: `0 20px 50px rgba(14,42,31,0.35), 0 0 30px ${C.goldGlow}` }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white sm:text-base"
                    style={{
                      background: `linear-gradient(135deg, ${C.green}, ${C.darkGreen})`,
                      border: `1.5px solid ${C.gold}`,
                      boxShadow: `0 16px 40px rgba(14,42,31,0.3), 0 0 20px ${C.goldGlow}`,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: C.goldLight }} />
                    Confirm Service Request
                  </motion.button>
                )}
              </div>
              {currentStep < STEPS.length && !isStepValid(currentStep) ? (
                <p className="mt-3 text-center text-xs sm:text-right" style={{ color: C.subtext }}>
                  {stepHint(currentStep)}
                </p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared presentational pieces                                       */
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

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold sm:text-3xl" style={{ fontFamily: "var(--font-playfair)", color: C.darkGreen }}>
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: C.subtext }}>
        {subtitle}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
  multiline,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${C.goldLight}aa` }}>
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-medium ${multiline ? "line-clamp-2" : "truncate"}`}
          style={{ color: C.cream }}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
        style={{ backgroundColor: `${C.goldLight}1f`, color: C.goldLight }}
      >
        <Pencil size={11} /> Edit
      </button>
    </div>
  );
}

function stepHint(step: number): string {
  switch (step) {
    case 1:
      return "Select a vehicle to continue.";
    case 2:
      return "Choose a service to continue.";
    case 3:
      return "Add a short description to continue.";
    case 5:
      return "Choose a pickup option to continue.";
    case 6:
      return "Enter a valid mobile number to continue.";
    default:
      return "";
  }
}
