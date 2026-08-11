"use client";

/**
 * CrystoFix — Landing Page
 * -----------------------------------------------------------------------
 * Stack: Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion
 *
 * Design system (see design notes at bottom of file):
 * - Palette:  #000000 (bg) · #0A0A0A/#0F0F0F (elevated surfaces) · #FFFFFF (fg)
 *             #F97316 (ignition orange — used as a single accent, like a
 *             dashboard warning/status light, never as a wash)
 * - Type:     Inter (UI/body) + JetBrains Mono (technical/data — stats,
 *             eyebrows, VIN-style labels) — the mono face is the thread that
 *             ties the page to an instrument cluster, used deliberately and
 *             sparingly, never as body copy.
 * - Motif:    "Live instrument cluster" — status dots instead of numbered
 *             steps, count-up telemetry, glass panels that read like a
 *             dashboard readout rather than a generic SaaS card.
 * -----------------------------------------------------------------------
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Share2, Briefcase, MessageCircle } from 'lucide-react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Gauge,
  Camera,
  History,
  RadioTower,
  Wrench,
  Cog,
  Zap,
  Paintbrush,
  SprayCan,
  Truck,
  Star,
  CheckCircle2,
  MapPin,
  Smartphone,
  Apple,
  ChevronRight,
  Phone,
  Mail,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* -------------------------------------------------------------------------
 * Shared motion variants
 * ---------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/* -------------------------------------------------------------------------
 * Small utility: count-up telemetry number
 * ---------------------------------------------------------------------- */

function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 1.8,
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * Status dot — the recurring "instrument cluster" structural device
 * ---------------------------------------------------------------------- */

function StatusEyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
      </span>
      {label}
    </div>
  );
}

/* =========================================================================
 * NAVBAR
 * ====================================================================== */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Garages", href: "#garages" },
    { label: "About", href: "#why" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-gradient-to-br from-white/10 to-transparent">
            <span className="absolute inset-0 rounded-md bg-orange-500/20 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Gauge className="relative h-4 w-4 text-orange-500" strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">
            Crysto<span className="text-orange-500">Fix</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="text-[13.5px] font-medium text-white/70 transition-colors hover:text-white">
            Login
          </button>
          <Button className="h-9 rounded-full bg-orange-500 px-5 text-[13px] font-semibold text-black shadow-[0_0_0_1px_rgba(249,115,22,0.4)] hover:bg-orange-400">
            Book Service
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                <Button variant="outline" className="h-10 w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white/5">
                  Login
                </Button>
                <Button className="h-10 w-full rounded-full bg-orange-500 font-semibold text-black hover:bg-orange-400">
                  Book Service
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* =========================================================================
 * HERO
 * ====================================================================== */

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-full max-w-xl"
    >
      {/* ambient glow */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-orange-500/10 blur-[80px]" />

      {/* main panel */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
              Vehicle Health · KA-01-AB-4521
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/30">v2.4</span>
        </div>

        {/* gauge */}
        <div className="flex items-center gap-6 py-6">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#F97316"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.94) }}
                transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white">94</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                Health Score
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {[
              { label: "Engine", value: 96, ok: true },
              { label: "Brakes", value: 88, ok: true },
              { label: "Battery", value: 91, ok: true },
            ].map((row, i) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/40">
                  <span>{row.label}</span>
                  <span className="text-white/60">{row.value}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${row.value}%` }}
                    transition={{ duration: 1.2, delay: 1.1 + i * 0.15, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer row */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            OTP Verified · Job Complete
          </div>
          <div className="font-mono text-[10px] text-white/30">Updated 2 min ago</div>
        </div>
      </div>

      {/* floating trust cards */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-8 -top-6 hidden w-44 rounded-2xl border border-white/10 bg-black/70 p-3.5 shadow-2xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-orange-500" />
          <span className="text-[11px] font-semibold text-white">Verified Garage</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-white/40">GST · License · Insurance</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-8 -right-6 hidden w-48 rounded-2xl border border-white/10 bg-black/70 p-3.5 shadow-2xl backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-orange-500" />
          <span className="text-[11px] font-semibold text-white">Before / After Photos</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <div className="h-8 flex-1 rounded-md bg-gradient-to-br from-white/15 to-white/5" />
          <div className="h-8 flex-1 rounded-md bg-gradient-to-br from-orange-500/30 to-white/5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 md:pt-32"
    >
      {/* backdrop gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-orange-600/[0.12] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:36px_36px] opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <motion.div style={{ opacity, y }} className="mx-auto grid w-full max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <motion.div initial="hidden" animate="show" variants={staggerParent}>
          <motion.div variants={fadeUp} custom={0}>
            <StatusEyebrow label="Live across 40+ cities in India" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-6 text-[13vw] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl md:text-[64px] lg:text-[68px]"
          >
            Vehicle ownership,
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              finally transparent.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/55 md:text-lg"
          >
            CrystoFix connects you to verified garages, transparent pricing, and a
            complete digital history for every car you own — from the first
            service to the last resale.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button className="h-13 group rounded-full bg-orange-500 px-7 py-3.5 text-[15px] font-semibold text-black hover:bg-orange-400">
              Book a Service
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="h-13 rounded-full border-white/15 bg-white/[0.02] px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              Become a Partner Garage
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6"
          >
            {[
              ["4.8/5", "Customer Rating"],
              ["12,000+", "Verified Garages"],
              ["2.4M+", "Cars Serviced"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-mono text-lg font-semibold text-white">{value}</div>
                <div className="text-[11px] text-white/40">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <DashboardMockup />
      </motion.div>
    </section>
  );
}

/* =========================================================================
 * TRUST METRICS
 * ====================================================================== */

function TrustMetrics() {
  const stats = [
    { icon: Truck, value: 2.4, suffix: "M+", decimals: 1, label: "Cars Serviced" },
    { icon: ShieldCheck, value: 12000, suffix: "+", decimals: 0, label: "Verified Garages" },
    { icon: Star, value: 4.8, suffix: "/5", decimals: 1, label: "Customer Rating" },
    { icon: History, value: 5.1, suffix: "M+", decimals: 1, label: "Digital Invoices" },
  ];

  return (
    <section className="relative border-y border-white/10 bg-[#050505] py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30"
            >
              <s.icon className="mb-4 h-5 w-5 text-orange-500" strokeWidth={1.75} />
              <div className="font-mono text-3xl font-semibold text-white md:text-4xl">
                <CountUp target={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-1.5 text-[13px] text-white/45">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
 * SERVICES
 * ====================================================================== */

function Services() {
  const services = [
    { icon: Wrench, title: "Car Service", desc: "Periodic maintenance, oil changes, and multi-point inspections." },
    { icon: Cog, title: "Engine Repair", desc: "Diagnostics and repair from certified master technicians." },
    { icon: Zap, title: "Electrical Repair", desc: "Wiring, battery, ECU, and sensor diagnostics done right." },
    { icon: Paintbrush, title: "Denting", desc: "Panel beating and dent removal with factory-match precision." },
    { icon: SprayCan, title: "Painting", desc: "Booth-cured paint jobs with a lifetime colour-match guarantee." },
    { icon: Truck, title: "Pickup & Drop", desc: "Free doorstep pickup and drop for every scheduled service." },
  ];

  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerParent}
          className="mb-16 max-w-2xl"
        >
          <motion.div variants={fadeUp} custom={0}>
            <StatusEyebrow label="Full-service coverage" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-5 text-4xl font-semibold tracking-[-0.02em] text-white md:text-5xl"
          >
            Everything your car needs, under one roof.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent p-7 transition-colors duration-300 hover:border-orange-500/40"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-500/0 blur-2xl transition-colors duration-500 group-hover:bg-orange-500/20" />
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-orange-500/40">
                <s.icon className="h-5 w-5 text-orange-500" strokeWidth={1.75} />
              </div>
              <h3 className="text-[17px] font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/45">{s.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-[12.5px] font-medium text-white/30 transition-colors group-hover:text-orange-400">
                Explore
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
 * WHY CRYSTOFIX
 * ====================================================================== */

function WhyCrystoFix() {
  const features = [
    {
      icon: Gauge,
      title: "Transparent Pricing",
      desc: "See upfront, itemised quotes before any work begins — no surprise line items at pickup.",
    },
    {
      icon: ShieldCheck,
      title: "OTP Job Completion",
      desc: "Every job closes only after you confirm with a one-time password. No sign-off, no release.",
    },
    {
      icon: Camera,
      title: "Before & After Photos",
      desc: "Timestamped photo proof of every repair, uploaded straight from the garage floor.",
    },
    {
      icon: History,
      title: "Digital Service History",
      desc: "A permanent, portable record of every service — valuable the day you sell your car.",
    },
    {
      icon: RadioTower,
      title: "Real-Time Updates",
      desc: "Track your vehicle's status live, from drop-off to the final quality check.",
    },
  ];

  return (
    <section id="why" className="relative border-t border-white/10 bg-[#050505] py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerParent}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <motion.div variants={fadeUp} custom={0}>
              <StatusEyebrow label="Why CrystoFix" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl"
            >
              Trust, engineered
              <br /> into every job.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-5 max-w-md text-[15px] leading-relaxed text-white/45">
              We built the layer of accountability that vehicle servicing in
              India has always been missing — for owners, and for the garages
              that earn their trust.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerParent}
            className="space-y-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="group flex items-start gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30 hover:bg-white/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                  <f.icon className="h-4.5 w-4.5 text-orange-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[15.5px] font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-white/45">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
 * GARAGE PARTNER SECTION
 * ====================================================================== */

function GaragePartner() {
  const perks = [
    "Zero onboarding cost for verified garages",
    "Steady lead flow from nearby car owners",
    "Get paid within 24 hours of job completion",
    "Free listing on the CrystoFix garage network",
  ];

  return (
    <section id="garages" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerParent}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-black to-black p-10 md:p-16"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-orange-500/[0.06] blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.div variants={fadeUp} custom={0}>
                <StatusEyebrow label="For garage owners" />
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-white md:text-[44px] md:leading-[1.05]"
              >
                Grow your garage with a platform built on trust.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/50">
                Join 12,000+ verified garages across India getting a steady
                stream of qualified customers — without spending a rupee on
                marketing.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8">
                <Button className="h-12 rounded-full bg-orange-500 px-7 font-semibold text-black hover:bg-orange-400">
                  Partner With Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <motion.ul variants={staggerParent} className="space-y-4">
              {perks.map((p, i) => (
                <motion.li
                  key={p}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-500" />
                  <span className="text-[14px] text-white/75">{p}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
 * TESTIMONIALS
 * ====================================================================== */

function Testimonials() {
  const reviews = [
    {
      name: "Arjun Mehta",
      role: "Car Owner · Bengaluru",
      text: "The before-and-after photos changed how I trust garages. I can finally see exactly what was done to my car, every time.",
    },
    {
      name: "Priya Raghavan",
      role: "Fleet Operator · Chennai",
      text: "Managing service history for 40 delivery vehicles used to be chaos. CrystoFix turned it into a single, searchable dashboard.",
    },
    {
      name: "Suresh Kulkarni",
      role: "Garage Owner · Pune",
      text: "Our bookings tripled in four months. The OTP completion flow also cut disputes with customers down to almost zero.",
    },
  ];

  return (
    <section className="relative border-t border-white/10 bg-[#050505] py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerParent}
          className="mb-16 max-w-2xl"
        >
          <motion.div variants={fadeUp} custom={0}>
            <StatusEyebrow label="Trusted nationwide" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-5 text-4xl font-semibold tracking-[-0.02em] text-white md:text-5xl"
          >
            What the road is saying.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent}
          className="grid gap-4 md:grid-cols-3"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              variants={fadeUp}
              custom={i}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7"
            >
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="mt-5 text-[14.5px] leading-relaxed text-white/70">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/40 to-white/10 font-mono text-[11px] font-semibold text-white">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{r.name}</div>
                  <div className="text-[11.5px] text-white/40">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
 * DOWNLOAD APP CTA
 * ====================================================================== */

function DownloadApp() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600/[0.10] blur-[140px]" />
      </div>

      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerParent}
        >
          <motion.div variants={fadeUp} custom={0} className="flex justify-center">
            <StatusEyebrow label="Now on iOS & Android" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.02em] text-white md:text-6xl md:leading-[1.02]"
          >
            Your cars whole story, in your pocket.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mx-auto mt-5 max-w-md text-[15px] text-white/50">
            Book services, track jobs live, and access your full digital
            history — anywhere, anytime.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button className="h-13 flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-black hover:bg-white/90">
              <Apple className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[9px] text-black/60">Download on the</span>
                <span className="block text-[14px] font-semibold">App Store</span>
              </span>
            </Button>
            <Button className="h-13 flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-black hover:bg-white/90">
              <Smartphone className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[9px] text-black/60">Get it on</span>
                <span className="block text-[14px] font-semibold">Google Play</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================================
 * FOOTER
 * ====================================================================== */

function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["Car Service", "Garage Network", "Fleet Solutions", "Pricing"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"],
    },
  ];

  return (
    <footer id="footer" className="relative border-t border-white/10 bg-black pt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 pb-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/5">
                <Gauge className="h-4 w-4 text-orange-500" strokeWidth={2.5} />
              </span>
              <span className="text-[17px] font-semibold tracking-tight text-white">
                Crysto<span className="text-orange-500">Fix</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/40">
              Making vehicle ownership easier, safer, and more transparent —
              for every car owner, garage, and fleet in India.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Share2, Briefcase, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-orange-500/40 hover:text-orange-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13.5px] text-white/55 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[12.5px] text-white/35 md:flex-row md:items-center md:justify-between">
          <span>© 2026 CrystoFix Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Bengaluru, India
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> +91 80000 00000
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> hello@crystofix.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
 * PAGE
 * ====================================================================== */

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-black font-sans text-white antialiased">
      <Navbar />
      <Hero />
      <TrustMetrics />
      <Services />
      <WhyCrystoFix />
      <GaragePartner />
      <Testimonials />
      <DownloadApp />
      <Footer />
    </main>
  );
}

/**
 * -----------------------------------------------------------------------
 * Setup notes
 * -----------------------------------------------------------------------
 * 1. This file assumes a Next.js 16 App Router project with Tailwind v4
 *    and shadcn/ui already initialised (`npx shadcn@latest init`), with
 *    the `button` and `badge` components added:
 *      npx shadcn@latest add button badge
 *
 * 2. Install additional dependencies:
 *      npm install framer-motion lucide-react
 *
 * 3. In app/layout.tsx, load the two type roles used here — Inter for UI/
 *    body copy, JetBrains Mono for technical/telemetry labels — via
 *    next/font/google, and expose them as font-sans / font-mono through
 *    Tailwind theme tokens (or simply set them as CSS variables on <body>
 *    and map `--font-sans` / `--font-mono` in your Tailwind v4 @theme block).
 *
 * 4. globals.css should define the base surface as pure black (#000) with
 *    white foreground; no additional theme changes are required since all
 *    colour decisions in this file are made with explicit Tailwind utility
 *    classes (orange-500 as the sole accent).
 * -----------------------------------------------------------------------
 */
