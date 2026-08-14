"use client";
import React, { useState } from "react";
import {
  Wrench,
  Car,
  ClipboardCheck,
  Truck,
  Phone,
  Receipt,
  ChevronRight,
  Bell,
  ShieldCheck,
  MapPin,
  Calendar,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

const ACTIONS = [
  {
    icon: Wrench,
    title: "Book a Service",
    desc: "Reserve a bay at your preferred centre, any day this week.",
  },
  {
    icon: Car,
    title: "My Garage",
    desc: "Every vehicle you own, its papers, and its story.",
  },
  {
    icon: ClipboardCheck,
    title: "Vehicle History",
    desc: "Full service record, inspections, and technician notes.",
  },
  {
    icon: Truck,
    title: "Pickup & Drop-off",
    desc: "We collect your vehicle and return it, door to door.",
  },
  {
    icon: Phone,
    title: "Concierge",
    desc: "Speak with your dedicated advisor, any hour.",
  },
  {
    icon: Receipt,
    title: "Invoices",
    desc: "Itemised billing for every visit, always on file.",
  },
];

const TIMELINE = [
  { label: "Picked Up", done: true },
  { label: "In Service", done: true, active: true },
  { label: "Quality Check", done: false },
  { label: "Ready for Delivery", done: false },
];

export default function VehicleCareDashboard() {
  const [pressed, setPressed] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap');

        :root{
          --bg:#08090B;
          --card:#111318;
          --card2:#151922;
          --text:#F5F5F5;
          --text2:#B8BCC7;
          --gold:#D4AF37;
          --gold-border:#C8A03A;
          --gold-hover:rgba(212,175,55,0.35);
          --gold-grad:linear-gradient(135deg,#F7D774 0%,#D4AF37 50%,#B8860B 100%);
          --green:#0F5C4D;
          --green-dark:#083D35;
          --emerald:#16A085;
          --green-grad:linear-gradient(135deg,#0F5C4D,#0B4A3F,#083D35);
        }
        .vcc-root{ background:var(--bg); color:var(--text); }
        .f-crest{ font-family:'Cinzel', serif; letter-spacing:0.18em; }
        .f-display{ font-family:'Cormorant Garamond', serif; }
        .f-body{ font-family:'Manrope', sans-serif; }
        .f-mono{ font-family:'IBM Plex Mono', monospace; }

        .vcc-card{
          background:var(--green-grad);
          border:1px solid rgba(200,160,58,0.35);
          transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease;
        }
        .vcc-card:hover{
          transform: translateY(-6px);
          border-color: var(--gold-border);
          box-shadow: 0 0 0 1px rgba(212,175,55,0.25), 0 20px 45px -15px rgba(212,175,55,0.30), 0 10px 30px -10px rgba(0,0,0,0.6);
        }
        .vcc-card:active{ transform: translateY(-2px) scale(0.99); }

        .vcc-btn-gold{
          background: var(--gold-grad);
          color:#1a1305;
          border:1px solid #E8C766;
          position:relative;
          overflow:hidden;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .vcc-btn-gold:hover{
          transform: translateY(-2px);
          box-shadow: 0 12px 30px -8px rgba(212,175,55,0.55);
        }
        .vcc-btn-gold::after{
          content:"";
          position:absolute; top:0; left:-60%;
          width:40%; height:100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: skewX(-20deg);
          transition: left .7s ease;
        }
        .vcc-btn-gold:hover::after{ left:130%; }

        .vcc-btn-ghost{
          background: rgba(212,175,55,0.06);
          border:1px solid var(--gold-border);
          color:var(--gold);
          transition: background .3s ease, transform .25s ease;
        }
        .vcc-btn-ghost:hover{ background: var(--gold-hover); transform: translateY(-2px); }

        .vcc-glow{
          animation: vccFloat 7s ease-in-out infinite;
        }
        @keyframes vccFloat{
          0%,100%{ opacity:0.55; transform: scale(1); }
          50%{ opacity:0.85; transform: scale(1.05); }
        }

        .vcc-frame::before{
          content:"";
          position:absolute; inset:0;
          background: linear-gradient(120deg, transparent 20%, rgba(212,175,55,0.18) 45%, transparent 70%);
          background-size: 250% 250%;
          background-position: 0% 0%;
          opacity:0;
          transition: opacity .4s ease;
          pointer-events:none;
        }
        .vcc-frame:hover::before{
          opacity:1;
          animation: vccShine 1.8s ease forwards;
        }
        @keyframes vccShine{
          0%{ background-position: 0% 0%; }
          100%{ background-position: 100% 100%; }
        }

        .vcc-corner{ position:absolute; width:22px; height:22px; border-color:var(--gold-border); opacity:0.85; }

        .vcc-dot-active{
          box-shadow: 0 0 0 4px rgba(212,175,55,0.18);
        }

        @media (prefers-reduced-motion: reduce){
          .vcc-card, .vcc-btn-gold, .vcc-btn-ghost, .vcc-glow, .vcc-frame::before{
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="vcc-root f-body min-h-screen w-full relative overflow-hidden">
        {/* ambient glows */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-24 w-[460px] h-[460px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #16A085 0%, transparent 70%)" }}
        />

        {/* header */}
        <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
            <div>
              <p className="f-crest text-lg" style={{ color: "var(--gold)" }}>
                CONCOURS
              </p>
              <p className="f-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text2)" }}>
                Vehicle Care Club
              </p>
            </div>

            <nav className="hidden md:flex items-center gap-8 f-body text-sm" style={{ color: "var(--text2)" }}>
              <a className="hover:text-[var(--gold)] transition-colors" href="#">Overview</a>
              <a className="hover:text-[var(--gold)] transition-colors" href="#">Garage</a>
              <a className="hover:text-[var(--gold)] transition-colors" href="#">Invoices</a>
              <a className="hover:text-[var(--gold)] transition-colors" href="#">Concierge</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full vcc-btn-ghost"
              >
                <Bell size={18} />
              </button>
              <div
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full f-crest text-sm"
                style={{ background: "var(--gold-grad)", color: "#1a1305" }}
              >
                RM
              </div>
              <button
                aria-label="Menu"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full vcc-btn-ghost"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden px-6 pb-5 flex flex-col gap-4 f-body text-sm" style={{ color: "var(--text2)" }}>
              <a href="#">Overview</a>
              <a href="#">Garage</a>
              <a href="#">Invoices</a>
              <a href="#">Concierge</a>
            </div>
          )}
        </header>

        {/* hero */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <p className="f-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "var(--gold)" }}>
              Good evening, Rohan
            </p>
            <h1 className="f-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] mb-5">
              Your vehicle is
              <br />
              <span className="italic" style={{ color: "var(--gold)" }}>
                in safe hands.
              </span>
            </h1>
            <p className="text-base max-w-md mb-8" style={{ color: "var(--text2)" }}>
              One place to book service, track history, and reach your
              personal advisor — with nothing technical about it.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-9">
              <span
                className="f-mono text-xs px-3 py-1.5 rounded-md border"
                style={{ borderColor: "rgba(200,160,58,0.4)", color: "var(--text2)", background: "rgba(255,255,255,0.02)" }}
              >
                KA 01 AB 4271
              </span>
              <span className="text-sm" style={{ color: "var(--text2)" }}>
                Grand Tourer · Obsidian Black
              </span>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--gold)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                In Service
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="vcc-btn-gold rounded-xl px-7 py-4 flex items-center gap-2 f-body font-semibold text-sm">
                <Wrench size={18} />
                Book a Service
                <ArrowUpRight size={16} />
              </button>
              <button className="vcc-btn-ghost rounded-xl px-7 py-4 flex items-center gap-2 f-body font-semibold text-sm">
                <Phone size={18} />
                Talk to Concierge
              </button>
            </div>
          </div>

          {/* hero frame */}
          <div className="relative">
            <div
              className="vcc-frame relative rounded-3xl p-8 lg:p-10 overflow-hidden"
              style={{
                background: "var(--card2)",
                border: "1px solid rgba(200,160,58,0.45)",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
              }}
            >
              <span className="vcc-corner border-t border-l rounded-tl-md" style={{ top: 14, left: 14 }} />
              <span className="vcc-corner border-t border-r rounded-tr-md" style={{ top: 14, right: 14 }} />
              <span className="vcc-corner border-b border-l rounded-bl-md" style={{ bottom: 14, left: 14 }} />
              <span className="vcc-corner border-b border-r rounded-br-md" style={{ bottom: 14, right: 14 }} />

              <div
                className="vcc-glow pointer-events-none absolute inset-0 m-auto w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(22,160,133,0.55) 0%, transparent 70%)" }}
              />

              <svg viewBox="0 0 440 190" className="relative w-full h-auto">
                <defs>
                  <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F7D774" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                  <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <ellipse cx="220" cy="150" rx="160" ry="14" fill="url(#groundGlow)" />

                <path
                  d="M40 140
                     C42 118 55 104 78 100
                     C88 74 122 50 168 42
                     C196 37 224 36 250 40
                     C286 46 318 60 344 80
                     C366 97 384 112 400 122
                     C404 125 404 132 398 136
                     L370 138
                     C366 122 348 110 330 110
                     C312 110 298 122 296 138
                     L168 138
                     C166 122 148 110 130 110
                     C112 110 96 122 94 138
                     L40 140 Z"
                  fill="none"
                  stroke="url(#goldLine)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                <path
                  d="M150 42 C168 33 200 31 226 34 C252 37 272 46 292 62"
                  fill="none"
                  stroke="url(#goldLine)"
                  strokeWidth="1.4"
                  opacity="0.85"
                />

                <path
                  d="M92 96 C160 88 260 88 342 100"
                  fill="none"
                  stroke="url(#goldLine)"
                  strokeWidth="1"
                  opacity="0.5"
                />

                <circle cx="130" cy="140" r="24" fill="none" stroke="url(#goldLine)" strokeWidth="2" />
                <circle cx="130" cy="140" r="9" fill="none" stroke="url(#goldLine)" strokeWidth="1.2" opacity="0.8" />
                <circle cx="330" cy="140" r="24" fill="none" stroke="url(#goldLine)" strokeWidth="2" />
                <circle cx="330" cy="140" r="9" fill="none" stroke="url(#goldLine)" strokeWidth="1.2" opacity="0.8" />
              </svg>

              <div className="mt-6 pt-5 flex items-center justify-between border-t" style={{ borderColor: "rgba(200,160,58,0.25)" }}>
                <p className="f-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--text2)" }}>
                  Vehicle Care Centre
                </p>
                <p className="f-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--gold)" }}>
                  Bay 03 · Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* actions */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-6">
          <p className="f-crest text-xs mb-3" style={{ color: "var(--gold)" }}>
            CONCIERGE SERVICES
          </p>
          <h2 className="f-display text-3xl sm:text-4xl mb-10">Everything your vehicle needs</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIONS.map(({ icon: Icon, title, desc }, i) => (
              <button
                key={title}
                onMouseDown={() => setPressed(i)}
                onMouseUp={() => setPressed(null)}
                onMouseLeave={() => setPressed(null)}
                className="vcc-card text-left rounded-2xl p-7 lg:p-8 flex flex-col gap-5"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(200,160,58,0.5)" }}
                >
                  <Icon size={26} style={{ color: "var(--gold)" }} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="f-display text-2xl mb-1.5" style={{ color: "var(--text)" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                    {desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm f-body font-semibold mt-1" style={{ color: "var(--gold)" }}>
                  Open
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* appointment / timeline */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-16">
          <div
            className="rounded-2xl p-8 lg:p-10"
            style={{ background: "var(--card)", border: "1px solid rgba(200,160,58,0.3)" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(200,160,58,0.5)" }}
                >
                  <Calendar size={22} style={{ color: "var(--gold)" }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="f-display text-2xl mb-1">Next Appointment</p>
                  <p className="f-mono text-sm mb-1" style={{ color: "var(--text2)" }}>
                    Tue, 18 Aug &nbsp;·&nbsp; 10:30 AM
                  </p>
                  <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text2)" }}>
                    <MapPin size={14} />
                    Concours Service Atelier, Indiranagar
                  </p>
                </div>
              </div>

              <button className="vcc-btn-ghost rounded-xl px-6 py-3 text-sm font-semibold self-start lg:self-auto">
                Reschedule
              </button>
            </div>

            <div className="mt-10 grid grid-cols-4 gap-2">
              {TIMELINE.map((step, i) => (
                <div key={step.label} className="flex flex-col items-center text-center">
                  <div className="flex items-center w-full mb-3">
                    <div
                      className="flex-1 h-px"
                      style={{ background: i === 0 ? "transparent" : "rgba(200,160,58,0.35)" }}
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${step.active ? "vcc-dot-active" : ""}`}
                      style={{
                        background: step.done ? "var(--gold-grad)" : "var(--card2)",
                        border: step.done ? "none" : "1px solid rgba(200,160,58,0.5)",
                      }}
                    />
                    <div
                      className="flex-1 h-px"
                      style={{ background: i === TIMELINE.length - 1 ? "transparent" : "rgba(200,160,58,0.35)" }}
                    />
                  </div>
                  <p
                    className="f-mono text-[10px] tracking-[0.15em] uppercase"
                    style={{ color: step.done ? "var(--gold)" : "var(--text2)" }}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* footer */}
        <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <div
            className="h-px w-full mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
          />
          <div className="flex flex-col items-center text-center gap-2">
            <p className="f-crest text-sm" style={{ color: "var(--gold)" }}>
              CONCOURS
            </p>
            <p className="f-display italic text-lg" style={{ color: "var(--text2)" }}>
              Your vehicle, in safe hands.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-sm" style={{ color: "var(--text2)" }}>
              <span className="f-mono">+91 80 4000 1234</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} style={{ color: "var(--gold)" }} />
                Fully Insured Care
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(200,160,58,0.5)", color: "var(--gold)" }}
              >
                Platinum Member
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
