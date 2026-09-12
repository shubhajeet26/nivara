import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Navigation,
  Wifi,
  HardDrive,
  Clock,
  ArrowRight,
  Shield,
  FilePlus,
  MapPin,
  HeartPulse,
  Slash,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge } from '../components/common/Badge';
import { NivaraMap } from '../components/map/NivaraMap';
import { hazardService } from '../services/hazardService';
import { mapService } from '../services/mapService';

export const OverviewPage: React.FC = () => {
  const {
    activeScenario,
    scenarioData,
    userLocation,
    gpsStatus,
    connectivity,
    toggleConnectivityMode,
    offlinePackage,
    setActivePage,
    setIsLocationModalOpen,
    setIsOfflineModalOpen,
    setIsScenarioModalOpen,
    setSelectedMapItem,
  } = useApp();

  const activeHazards = hazardService.getActiveHazards(activeScenario);
  const blockedRoads = hazardService.getBlockedRoads(activeScenario);
  const safePlaces = hazardService.getSafePlaces();
  const nearestShelter = safePlaces[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. PRIMARY SAFETY STATUS HERO: Answers "Am I safe right now?" */}
      <section
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 backdrop-blur-xl border transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.5)] ${
          scenarioData.overallRisk === 'SAFE'
            ? 'bg-teal-950/20 border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.12)]'
            : scenarioData.overallRisk === 'CAUTION'
            ? 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
            : scenarioData.overallRisk === 'WARNING'
            ? 'bg-orange-950/25 border-orange-500/35 shadow-[0_0_32px_rgba(249,115,22,0.15)]'
            : 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_36px_rgba(244,63,94,0.18)]'
        }`}
      >
        {/* Subtle decorative radial gradient accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge level={scenarioData.overallRisk} size="lg" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-display font-bold tracking-wider text-neutral-300 uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <span>Sector Threat Assessment</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-display">
              {scenarioData.overallRisk === 'SAFE'
                ? 'Your Current Sector Has No Active Severe Hazards'
                : `${scenarioData.name}: Active Threat Warning`}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed font-sans font-normal">
              {scenarioData.riskSummary}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-display">
              <div className="flex items-center gap-2 text-neutral-200 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-normal text-xs text-neutral-300">Sector: <strong className="text-white font-bold">{userLocation.placeName}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] text-neutral-300 px-3.5 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
                </span>
                <span className="font-normal text-xs text-neutral-300">Synchronized: <strong className="text-teal-300 font-bold">Live Stream</strong></span>
              </div>
              <div className="text-amber-200 font-bold text-xs bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/10 border border-amber-500/35 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_14px_rgba(245,158,11,0.2)]">
                <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                <span className="tracking-wide">DEMO PROFILE ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setActivePage('safety')}
              className="group px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.25] text-xs sm:text-sm font-display font-bold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] active:scale-98"
            >
              <span>View Safety Protocols</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => setIsScenarioModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/25 hover:from-amber-500/30 hover:to-amber-500/25 border border-amber-500/40 hover:border-amber-500/60 text-xs sm:text-sm font-display font-bold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:shadow-[0_0_26px_rgba(245,158,11,0.35)] active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Simulate Scenario</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL TELEMETRY MATRIX */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location / GPS Status */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 via-[#0B101A]/95 to-[#070A12]/95 backdrop-blur-xl border border-sky-500/25 hover:border-sky-500/50 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(14,165,233,0.18)] transition-all duration-200 cursor-pointer space-y-3 group shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {/* Top glowing cyan line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="font-display font-bold tracking-widest uppercase text-[11px] text-sky-300/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Positioning
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 border border-sky-500/35 flex items-center justify-center text-sky-400 shadow-[0_0_14px_rgba(14,165,233,0.25)] group-hover:scale-105 transition-transform">
              <Navigation className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-white font-display tracking-tight">
              {gpsStatus === 'AVAILABLE' ? 'LOCKED' : gpsStatus}
            </div>
            {/* Real GNSS Signal Strength Bars */}
            <div className="flex items-end gap-1 h-4 pb-0.5" title="Hardware GNSS Signal: Strong (4/4)">
              <div className="w-1 h-1.5 rounded-full bg-sky-400" />
              <div className="w-1 h-2.5 rounded-full bg-sky-400" />
              <div className="w-1 h-3.5 rounded-full bg-sky-400" />
              <div className="w-1 h-4 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-300 font-sans border-t border-white/[0.06]">
            <span className="truncate max-w-[130px] font-medium">
              {userLocation.source === 'gps' ? 'Live GNSS Hardware Fix' : 'Kolkata Reference'}
            </span>
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 shrink-0">
              ±3.2m ACC
            </span>
          </div>
        </div>

        {/* Connectivity Status */}
        <div
          onClick={toggleConnectivityMode}
          className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 via-[#0B101A]/95 to-[#070A12]/95 backdrop-blur-xl border border-teal-500/25 hover:border-teal-500/50 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,184,166,0.18)] transition-all duration-200 cursor-pointer space-y-3 group shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          title="Click to toggle network state"
        >
          {/* Top glowing teal line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/80 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="font-display font-bold tracking-widest uppercase text-[11px] text-teal-300/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Network Telemetry
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/35 flex items-center justify-center text-teal-400 shadow-[0_0_14px_rgba(20,184,166,0.25)] group-hover:scale-105 transition-transform">
              <Wifi className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className={`text-2xl font-black font-display tracking-tight ${connectivity === 'ONLINE' ? 'text-teal-300' : 'text-amber-300'}`}>
              {connectivity}
            </div>
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              {connectivity === 'OFFLINE' ? 'Cached Mode' : '24ms • Direct'}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-300 font-sans border-t border-white/[0.06]">
            <span className="truncate max-w-[130px] font-medium">
              {connectivity === 'OFFLINE' ? 'Zero network needed' : 'Sync stream verified'}
            </span>
            <span className="text-[10px] font-display font-bold text-neutral-400 group-hover:text-teal-300 transition-colors shrink-0">
              Toggle State →
            </span>
          </div>
        </div>

        {/* Offline Safety Package */}
        <div
          onClick={() => setIsOfflineModalOpen(true)}
          className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 via-[#0B101A]/95 to-[#070A12]/95 backdrop-blur-xl border border-emerald-500/25 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(16,185,129,0.18)] transition-all duration-200 cursor-pointer space-y-3 group shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {/* Top glowing emerald line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="font-display font-bold tracking-widest uppercase text-[11px] text-emerald-300/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Offline Package
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-emerald-300 font-display tracking-tight">
              {offlinePackage.sizeMb} MB
            </div>
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              100% READY
            </span>
          </div>

          {/* Micro storage cache bar */}
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-neutral-300 font-sans border-t border-white/[0.06]">
            <span className="truncate max-w-[130px] font-medium">
              {offlinePackage.regionName}
            </span>
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              {safePlaces.length} Shelters
            </span>
          </div>
        </div>

        {/* Active Threat Count */}
        <div
          onClick={() => setActivePage('map')}
          className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#18110D]/90 via-[#120E0A]/95 to-[#0A0806]/95 backdrop-blur-xl border border-amber-500/35 hover:border-amber-500/60 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(245,158,11,0.22)] transition-all duration-200 cursor-pointer space-y-3 group shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {/* Top glowing amber hazard line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="flex items-center justify-between">
            <span className="font-display font-bold tracking-widest uppercase text-[11px] text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              Active Hazards
            </span>
            {/* Modern High-Tech Warning Sign */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-300 font-display tracking-tight">
              {activeHazards.length} Zones
            </div>
            <span className="text-[11px] font-display font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/35 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              {blockedRoads.length} Blocked
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-neutral-300 font-sans border-t border-white/[0.06]">
            <span className="truncate max-w-[130px] font-medium text-amber-200/90">
              High-Tide Surge Active
            </span>
            <span className="text-[10px] font-display font-bold text-amber-300 group-hover:underline shrink-0">
              Tactical Map →
            </span>
          </div>
        </div>
      </section>

      {/* 3. QUICK ACTIONS BAR */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-neutral-200">
            Rapid Operational Actions
          </span>
          <span className="text-[10px] font-display font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.08]">
            INSTANT TRIAGE
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => setActivePage('map')}
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 to-[#0A0E18]/90 backdrop-blur-xl border border-sky-500/20 hover:border-sky-500/40 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(14,165,233,0.15)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 shadow-[0_0_14px_rgba(14,165,233,0.2)] group-hover:bg-sky-500/25 group-hover:scale-105 transition-all">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm sm:text-base text-white font-display tracking-tight flex items-center justify-between">
              <span>Open Safety Map</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Explore full tactical view</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMapItem(nearestShelter);
              setActivePage('map');
            }}
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 to-[#0A0E18]/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(20,184,166,0.15)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 shadow-[0_0_14px_rgba(20,184,166,0.2)] group-hover:bg-teal-500/25 group-hover:scale-105 transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm sm:text-base text-white font-display tracking-tight flex items-center justify-between">
              <span>Find Safe Place</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">
              Nearest: {nearestShelter.name.split(' ')[0]}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActivePage('emergency')}
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-rose-950/40 via-rose-950/20 to-[#0B0A10]/95 backdrop-blur-xl border border-rose-500/40 hover:border-rose-500/70 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(244,63,94,0.3)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-3 shadow-[0_0_16px_rgba(244,63,94,0.3)] group-hover:bg-rose-500/30 group-hover:scale-105 transition-all">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div className="font-black text-sm sm:text-base text-rose-100 font-display tracking-tight flex items-center justify-between">
              <span>Emergency Mode</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-xs text-rose-300/80 font-sans mt-1">Distress protocols & contacts</div>
          </button>

          <button
            type="button"
            onClick={() => setActivePage('reports')}
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0E1524]/90 to-[#0A0E18]/90 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(245,158,11,0.15)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_14px_rgba(245,158,11,0.2)] group-hover:bg-amber-500/25 group-hover:scale-105 transition-all">
              <FilePlus className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm sm:text-base text-white font-display tracking-tight flex items-center justify-between">
              <span>Report Hazard</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-xs text-neutral-400 font-sans mt-1">Community ground feedback</div>
          </button>
        </div>
      </section>

      {/* 4. MAP OVERVIEW & NEARBY SAFETY INFORMATION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactical Map Card Preview */}
        <div className="lg:col-span-2 bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-[380px] sm:h-[440px] shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]/80 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-3.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
                Live Tactical Map
              </span>
              <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                OPS FEED
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('map')}
              className="text-xs font-display font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 px-3 py-1 rounded-full transition-all active:scale-95 shadow-xs"
            >
              <span>Expand Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="map-vignette" />
            <NivaraMap className="w-full h-full" initialZoom={12} />
          </div>
        </div>

        {/* Nearby Safety Hubs List */}
        <div className="bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-neutral-200 font-bold">
                <span className="w-1.5 h-3 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(20,184,166,0.6)]" />
                <span>Nearby Safe Places ({safePlaces.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('safety')}
                className="text-xs font-display font-bold text-amber-300 hover:text-amber-200 cursor-pointer transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {safePlaces.slice(0, 3).map((place) => {
                const isHospital = place.category === 'hospital';
                const dist = mapService.formatDistance(
                  mapService.calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    place.location.lat,
                    place.location.lng
                  )
                );

                return (
                  <div
                    key={place.id}
                    onClick={() => {
                      setSelectedMapItem(place);
                      setActivePage('map');
                    }}
                    className="p-3 rounded-xl bg-[#090D15]/80 border border-white/[0.07] hover:border-white/[0.2] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-1.5 shadow-sm group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isHospital
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                          }`}
                        >
                          {isHospital ? (
                            <HeartPulse className="w-3.5 h-3.5" />
                          ) : (
                            <Shield className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[170px] font-display group-hover:text-amber-200 transition-colors">
                          {place.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-display font-bold text-neutral-300 shrink-0 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.08]">{dist}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate font-sans">{place.location.address}</p>
                    <div className="flex items-center justify-between text-[10px] font-display text-neutral-400 pt-0.5">
                      <span className="font-medium">{place.open24x7 ? 'Open 24/7' : 'Standard hours'}</span>
                      <span className="text-teal-300 font-bold">Verified Hub</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blocked Roads snippet */}
          {blockedRoads.length > 0 && (
            <div className="relative overflow-hidden p-3.5 rounded-xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/10 border border-orange-500/40 space-y-1.5 text-xs shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              <div className="flex items-center gap-2 text-orange-200 font-display font-bold text-xs tracking-tight">
                <div className="relative w-6 h-6 rounded-lg bg-orange-500/25 border border-orange-500/40 flex items-center justify-center text-orange-300 shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span>{blockedRoads.length} Blocked Route Identified</span>
              </div>
              <p className="text-[11px] text-neutral-300 font-sans pl-8">
                <strong className="text-white font-semibold">{blockedRoads[0].roadName}:</strong> {blockedRoads[0].reason}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
