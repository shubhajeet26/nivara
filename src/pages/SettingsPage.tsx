import React from 'react';
import {
  Settings as SettingsIcon,
  HardDrive,
  Navigation,
  Sparkles,
  Shield,
  FileCode,
  CheckCircle2,
  Database,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../state/AppContext';

export const SettingsPage: React.FC = () => {
  const {
    offlinePackage,
    setIsOfflineModalOpen,
    setIsLocationModalOpen,
    setIsScenarioModalOpen,
    activeScenario,
    scenarioData,
    gpsStatus,
    connectivity,
    toggleConnectivityMode,
  } = useApp();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-4 rounded-full bg-amber-400 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
            System Settings & Platform Architecture
          </h1>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-amber-300 border border-amber-500/30">
            TELEMETRY & STORAGE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 pl-4 font-sans">
          Local caching configuration, hardware positioning, simulated disaster testing, and platform roadmap.
        </p>
      </div>

      {/* 1. Offline Storage & Caching */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white font-display">Offline Resilience Package</h2>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/30 font-bold shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            {offlinePackage.status}
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          Nivara stores map vector data, shelter lists, and emergency contacts in local device storage so you remain oriented during full cellular blackouts.
        </p>

        <div className="p-3.5 bg-[#080C14]/80 rounded-xl border border-white/[0.07] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block text-[10px] font-semibold">PACKAGE REGION</span>
            <span className="text-neutral-200">{offlinePackage.regionName}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] font-semibold">LOCAL STORAGE</span>
            <span className="text-neutral-200">{offlinePackage.sizeMb} MB</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] font-semibold">LAST VERIFIED</span>
            <span className="text-neutral-200">{offlinePackage.lastSynchronized}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOfflineModalOpen(true)}
          className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-neutral-200 text-xs font-mono rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
        >
          <span>Manage Offline Package & Verify Checksums</span>
          <span>→</span>
        </button>
      </section>

      {/* 2. Positioning & Hardware Diagnostics */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <Navigation className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white font-display">Location & Hardware GPS</h2>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/30 font-bold shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            {gpsStatus}
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          Positioning is strictly processed on-device. Coordinate telemetry is never uploaded to remote servers without user reporting consent.
        </p>

        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-neutral-200 text-xs font-mono rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
        >
          <span>Open Location Diagnostics & Permission Flow</span>
          <span>→</span>
        </button>
      </section>

      {/* 3. Demo Scenario Controller */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white font-display">Simulation Scenario Engine</h2>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            {activeScenario}
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          For presentation and operational training, simulate diverse disaster states across Kolkata (Flood, Cyclone, Landslide, Earthquake, Wildfire).
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)]"
          >
            Switch Simulation Model ({scenarioData.name})
          </button>
          <button
            type="button"
            onClick={toggleConnectivityMode}
            className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-neutral-300 text-xs font-mono rounded-xl transition-all cursor-pointer"
          >
            Cycle Simulated Network ({connectivity})
          </button>
        </div>
      </section>

      {/* 4. Architectural Roadmap (Phase 1 to Phase 12) */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-neutral-300">
            <FileCode className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white font-display">Nivara Multi-Phase Development Roadmap</h2>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          Active build is operational on <span className="text-teal-300 font-semibold">Phase 2: Interactive Real Map & Location</span>. Future releases will expand the mesh network:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080C14]/90 border border-teal-500/40 text-teal-300 flex items-center justify-between shadow-[0_0_12px_rgba(20,184,166,0.15)]">
            <span className="font-semibold">Phase 1: Architecture & Theme</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/90 border border-teal-500/40 text-teal-300 flex items-center justify-between shadow-[0_0_12px_rgba(20,184,166,0.15)]">
            <span className="font-semibold">Phase 2: Interactive Map & GNSS</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 3: Hazard Intelligence Engine</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 4: Facilities & Relief Inventory</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 5: Safest Evacuation Routing</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 6: Real Offline Map Packages</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 7: Offline-First DB & Sync</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/60 border border-white/[0.06] text-neutral-400 flex items-center justify-between">
            <span>Phase 8: SOS & Distress Protocol</span>
            <span className="text-[10px] text-neutral-600">Upcoming</span>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Data Transparency */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/70 backdrop-blur-xl border border-white/[0.08] space-y-2 text-xs text-neutral-400 shadow-md">
        <div className="flex items-center gap-2 text-white font-semibold font-display">
          <Shield className="w-4 h-4 text-teal-400" />
          <span>Privacy-by-Design Principles</span>
        </div>
        <p className="leading-relaxed font-sans">
          Nivara does not track background locations when the application is idle. In Phase 1 and 2, all reports and scenario states are maintained purely in client-side memory. Detailed documentation files (PRIVACY.md, SECURITY.md, ARCHITECTURE.md, OFFLINE_MODE.md) are available at the root of the repository.
        </p>
      </section>
    </div>
  );
};
