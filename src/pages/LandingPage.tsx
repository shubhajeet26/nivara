import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  Map,
  Navigation,
  Compass,
  WifiOff,
  Radio,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Layers,
  Activity,
  PhoneCall,
  Flame,
  Zap,
  Lock,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useApp } from '../state/AppContext';

export const LandingPage: React.FC = () => {
  const { navigateToApp } = useApp();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-neutral-100 selection:bg-amber-500/25 selection:text-amber-200 overflow-x-hidden font-sans relative">
      {/* Background Mesh Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-command-mesh opacity-60" />

      {/* Atmospheric Ambient Glows */}
      <div className="fixed top-[-15%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[500px] bg-teal-500/8 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ─── Sticky Header Navigation ─── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080C14]/80 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-neutral-950 flex items-center justify-center font-bold tracking-tighter text-lg font-royal shadow-[0_0_18px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all">
                N
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-bold tracking-[0.22em] text-lg sm:text-xl text-white font-royal uppercase transition-colors group-hover:text-amber-200">
                    NIVARA
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-amber-200/85 font-royal-sub italic tracking-[0.06em] hidden sm:block font-medium leading-tight">
                  Civilian Disaster Resilience
                </div>
              </div>
            </button>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <button
              type="button"
              onClick={() => scrollToSection('problem')}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-display font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            >
              The Problem
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-display font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-display font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('live-preview')}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-display font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            >
              Live Preview
            </button>
          </nav>

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-sans text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kolkata Sector Ready</span>
            </div>

            <button
              type="button"
              onClick={() => navigateToApp('overview')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 text-xs sm:text-[13px] font-bold font-display tracking-tight shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_26px_rgba(245,158,11,0.5)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── 1. Hero Section ─── */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Tactical Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-mono text-neutral-300 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 font-semibold tracking-wider uppercase text-[11px]">
              CIVILIAN ZERO-NETWORK ARCHITECTURE
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 hidden sm:inline text-[11px]">PHASE 2 DEPLOYED</span>
          </div>

          {/* Bold Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.1] max-w-4xl mx-auto">
            Stay Safe. Stay Connected.{' '}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-teal-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]">
              Even Offline.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-sans">
            When severe floods, coastal cyclones, and landslides wipe out power grids and cellular towers, Nivara guides you to safety. Navigate directly to verified emergency shelters using 100% on-device offline vector maps and real-time satellite GNSS positioning — <span className="text-amber-300 font-semibold">even with zero network signal.</span>
          </p>

          {/* Actions: Primary CTA + How it Works Ghost */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => navigateToApp('overview')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold font-display text-sm tracking-tight shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/[0.2] text-neutral-200 hover:text-white font-medium font-display text-sm tracking-normal transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>How It Works</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Fast telemetry status pill bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
              <Radio className="w-3.5 h-3.5 text-teal-400" />
              <span>Raw GNSS Satellite Lock: <strong className="text-neutral-200">Autonomous</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Pre-Cached Offline Tiles: <strong className="text-neutral-200">124.6 MB</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Shelter Registry: <strong className="text-neutral-200">Pre-Audited</strong></span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 2. Problem / Solution Strip ─── */}
      <section id="problem" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              CRITICAL VULNERABILITY ANALYSIS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              The Reality of Environmental Disasters
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-sans">
              Modern mobile applications assume permanent broadband. In true emergencies, the physical infrastructure collapses.
            </p>
          </div>

          {/* Two-Column Problem vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* The Problem */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0D131F]/90 border border-rose-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider">
                      FAILURE MODE
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">The Problem</h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  SYSTEM BREAKDOWN
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed font-sans font-medium">
                Networks fail exactly when you need them most. During major floods, cyclones, and landslides, commercial communication grids experience immediate catastrophic drops:
              </p>

              <ul className="space-y-3.5 text-xs text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong className="text-white">Blank Maps & Endless Spinners:</strong> Cloud-dependent navigation apps stall on empty grey grids when cellular towers lose generator power.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong className="text-white">Severed Distress Channels:</strong> Local telecom switches become saturated or severed, causing emergency 112/100 calls to fail.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong className="text-white">Deadly Bottlenecks:</strong> Unverified social media rumors direct fleeing citizens into submerged underpasses and structural landslide zones.
                  </span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0D131F]/90 border border-teal-500/30 shadow-[0_12px_40px_rgba(20,184,166,0.1)] space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-teal-500/25 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider">
                      AUTONOMOUS ENGINE
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">The Solution</h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  ZERO-SIGNAL RESILIENCE
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed font-sans font-medium">
                Nivara is architected strictly for disconnected survival. Every map geometry, facility database, and safety algorithm runs directly inside your device's browser memory:
              </p>

              <ul className="space-y-3.5 text-xs text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Fully Offline Vector Cartography:</strong> High-definition roads, river corridors, and terrain contours remain 100% interactive without transmitting a single byte over the web.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Autonomous Satellite GNSS:</strong> Phones communicate directly with overhead GPS satellites; positioning continues accurately during complete internet blackout.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Pre-Audited Safe Shelters:</strong> Instant turn-by-turn routing to stadiums, universities, and hospitals with verified generator power and water reserves.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 3. Features Grid ─── */}
      <section id="features" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-semibold">
              CORE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              Engineered For Disaster Conditions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-sans">
              Four fundamental architectural pillars providing unbreakable orientation when civilian communication ceases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] hover:border-teal-500/40 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.25)] group-hover:scale-105 transition-transform">
                <Map className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">Offline Maps & Navigation</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Complete vector cartography of roads, waterways, and transit corridors rendered directly from local storage with zero network dependency.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] hover:border-sky-500/40 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.25)] group-hover:scale-105 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">Live Location, No Signal Needed</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Direct orbital GNSS lock tracks your real-time coordinates, bearing, and altitude even when airplane mode or cellular blackouts occur.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">Verified Safe Shelters</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Pre-indexed registry of community centers, stadiums, and hospitals with verified water, power generator, and medical triage status.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display">Real-Time Hazard Alerts</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Dynamic warning perimeters for flash flood inundations, blocked bridges, and landslide corridors with distance telemetry.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 4. How It Works (3-step horizontal timeline) ─── */}
      <section id="how-it-works" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              OPERATIONAL WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              How Nivara Protects You
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-sans">
              Simple, reliable protocol designed to be understood and operated in high-stress disaster situations.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-500/40 via-amber-400/50 to-teal-500/40 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-[#0D131F]/90 border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.4)] space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono font-black text-lg flex items-center justify-center shadow-[0_0_18px_rgba(20,184,166,0.3)]">
                    01
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    PREPARATION
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-display">
                    1. Download your area's offline package
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    One-click stores your regional cartography, shelters, and hospital records in IndexedDB device storage before storms make landfall.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                  <span>Size: 124.6 MB • Zero sync latency</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-[#0D131F]/90 border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.4)] space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-lg flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.3)]">
                    02
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    EARLY WARNING
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-display">
                    2. Get notified of active hazards
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Nivara instantly calculates your distance to flood surges, collapsed bridges, and fallen power trees with automated proximity warnings.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Calculated locally in &lt; 50ms</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-[#0D131F]/90 border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.4)] space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-lg flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.3)]">
                    03
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    SAFE PASSAGE
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-display">
                    3. Navigate safely to the nearest shelter
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Follow verified evacuation corridors that steer safely clear of active hazard perimeters straight to high-ground relief centers.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6 Verified High-Ground Shelters</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 5. Live Preview Section (Mockup Frame) ─── */}
      <section id="live-preview" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-center"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-semibold">
              INTERFACE SPECIFICATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
              Tactical Civilian Command Console
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-sans">
              High-contrast, low-battery dark theme designed for blinding sunlight or pitch-black emergency conditions.
            </p>
          </div>

          {/* Browser / Workstation Mockup Frame */}
          <div className="relative mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#0A0E17] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top Frame Window Bar */}
            <div className="h-10 sm:h-12 bg-[#0F1626] border-b border-white/[0.08] px-4 flex items-center justify-between text-xs font-mono select-none">
              {/* Window Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* URL Pill */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-lg bg-black/40 border border-white/[0.08] text-neutral-400 text-[11px]">
                <Lock className="w-3 h-3 text-teal-400" />
                <span>nivara.ops/command-center</span>
                <span className="text-teal-400 ml-1">● OFFLINE SECURED</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="hidden sm:inline font-semibold">GNSS LOCKED</span>
              </div>
            </div>

            {/* Simulated Dashboard Interface */}
            <div className="p-4 sm:p-6 bg-command-mesh space-y-4 text-left">
              {/* Telemetry Bar in Mockup */}
              <div className="p-3 rounded-xl bg-[#0D131F]/90 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-sm font-display">
                    N
                  </div>
                  <div>
                    <span className="text-white font-bold tracking-wider">NIVARA COMMAND CENTER</span>
                    <span className="text-neutral-500 block text-[10px]">Kolkata Central Sector (22.5726° N, 88.3639° E)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                    GPS LOCK: ±3m
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    OFFLINE CACHED
                  </span>
                </div>
              </div>

              {/* Split Content in Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Simulated Tactical Map View */}
                <div className="lg:col-span-2 h-64 sm:h-80 rounded-xl bg-[#080C14] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                  {/* Subtle decorative grid and waterway representation */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Stylized river */}
                      <path d="M 50 -10 Q 140 120, 220 180 T 400 350" fill="none" stroke="#0ea5e9" strokeWidth="18" opacity="0.35" />
                    </svg>
                  </div>

                  {/* Hazard Zone Overlay */}
                  <div className="absolute top-16 left-24 sm:left-32 p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.35)] backdrop-blur-md max-w-[200px] sm:max-w-xs space-y-1 z-10 animate-pulse">
                    <div className="flex items-center gap-1.5 text-rose-300 text-[11px] font-mono font-bold">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>Strand Road Inundation</span>
                    </div>
                    <p className="text-[10px] text-rose-200/80 font-sans">
                      Water depth 1.4m. Impassable corridor.
                    </p>
                  </div>

                  {/* Safe Shelter Marker */}
                  <div className="absolute bottom-8 right-12 sm:right-20 p-3 rounded-xl bg-teal-950/80 border border-teal-500/60 shadow-[0_0_25px_rgba(20,184,166,0.35)] backdrop-blur-md max-w-[220px] space-y-1 z-10">
                    <div className="flex items-center gap-1.5 text-teal-300 text-[11px] font-mono font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Netaji Indoor Stadium Shelter</span>
                    </div>
                    <p className="text-[10px] text-teal-200/80 font-sans">
                      Verified Safe • 350 Capacity • Power Generator Active
                    </p>
                  </div>

                  {/* User Location Node */}
                  <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-amber-400 ring-4 ring-amber-400/30 flex items-center justify-center text-neutral-950 font-black text-[9px] shadow-[0_0_15px_rgba(245,158,11,0.8)]">
                      YOU
                    </div>
                    <span className="text-[9px] font-mono text-amber-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded border border-amber-400/30">
                      Live GNSS Lock
                    </span>
                  </div>

                  {/* Map corner legend */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <div className="bg-black/70 px-2 py-1 rounded border border-white/[0.08]">
                      SECTOR: KOLKATA METRO
                    </div>
                    <div className="bg-black/70 px-2 py-1 rounded border border-white/[0.08] text-teal-400">
                      VECTOR TILES: 60 FPS
                    </div>
                  </div>
                </div>

                {/* Simulated Right Briefing Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#0D131F]/80 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">DISASTER SCENARIO</span>
                      <span className="text-amber-400 font-bold">CYCLONE DANA</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      High-tide storm surge active. Coastal & riverside roads flagged high risk.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0D131F]/80 border border-teal-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-teal-400 font-bold">CLOSEST EVACUATION</span>
                      <span className="text-white font-mono">0.8 KM</span>
                    </div>
                    <p className="text-[11px] text-neutral-200 font-semibold">
                      Netaji Indoor Stadium Relief Shelter
                    </p>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Est. walking time: 11 mins via BBD Bagh Corridor
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToApp('overview')}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  >
                    <span>Launch Live Interactive Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white font-display">
              "Your command center, ready when it matters."
            </p>
            <p className="text-xs text-neutral-400 font-sans">
              Instant load time. Zero account friction. Operates in deep cellular dead zones.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── 6. Stats / Trust Bar ─── */}
      <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-center"
        >
          {/* Stat 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 border border-white/[0.08] space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              124.6 MB
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Offline Package Size
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 border border-white/[0.08] space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
              6 Verified
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Active Safe Shelters
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 border border-white/[0.08] space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
              24/7
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Zero-Signal Availability
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 border border-white/[0.08] space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
              0 KB
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              Cellular Data Needed
            </div>
          </div>

          {/* Stat 5 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 border border-white/[0.08] space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.3)] col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              100%
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              On-Device Privacy
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 7. Final CTA Section ─── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-[#080C14]/95 border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden"
        >
          {/* Radial Ambient Backlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>BE PREPARED BEFORE CELLULAR COLLAPSE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display tracking-tight leading-tight">
            Set up before disaster strikes.
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed font-sans">
            Waiting until power cuts disable cellular towers is too late. Launch the command center now, cache your offline regional map package, and identify your closest emergency shelter route.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigateToApp('overview')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold font-display text-sm tracking-tight shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Enter Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 border-t border-white/[0.06]">
            <span>✓ No account required</span>
            <span>•</span>
            <span>✓ Zero remote tracking</span>
            <span>•</span>
            <span>✓ 100% Free Civilian Architecture</span>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#05080E] py-12 px-4 sm:px-6 lg:px-8 text-neutral-400 text-xs font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs font-royal">
                N
              </div>
              <span className="text-white font-bold tracking-[0.2em] text-sm font-royal uppercase">
                NIVARA
              </span>
            </div>
            <p className="text-neutral-400 text-xs font-sans leading-relaxed">
              Resilient civilian spatial intelligence and emergency evacuation platform engineered for severe disaster blackouts.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <div className="text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
              Platform Navigation
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => navigateToApp('overview')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Overview Command Center →
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToApp('map')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Interactive Safety Map →
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToApp('safety')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Verified Safe Shelters →
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateToApp('settings')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Offline Package Manager →
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-2">
            <div className="text-rose-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Disaster Hotlines (India)</span>
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><strong className="text-neutral-200">NDRF Helpline:</strong> 1078 / 011-24363260</li>
              <li><strong className="text-neutral-200">State Disaster (SEOC):</strong> 1070</li>
              <li><strong className="text-neutral-200">Ambulance / Medical:</strong> 108 / 102</li>
              <li><strong className="text-neutral-200">Police Emergency:</strong> 100 / 112</li>
            </ul>
          </div>

          {/* Privacy & Principles */}
          <div className="space-y-2">
            <div className="text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
              Privacy By Design
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              Positions are computed strictly on-device using hardware GNSS. Zero coordinate logs are transmitted to any central database without explicit reporting action.
            </p>
            <div className="text-[10px] text-teal-400 pt-1">
              Phase 2 Active • Open Standards
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Nivara Resilience Project. Built for civilian humanitarian safety.
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </footer>
    </div>
  );
};
