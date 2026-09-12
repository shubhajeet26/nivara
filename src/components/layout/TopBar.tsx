import React from 'react';
import { Shield, Radio, MapPin, HardDrive, AlertOctagon, Home } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { StatusPill } from '../common/StatusPill';

export const TopBar: React.FC = () => {
  const {
    connectivity,
    gpsStatus,
    userLocation,
    offlinePackage,
    setIsLocationModalOpen,
    setIsOfflineModalOpen,
    toggleConnectivityMode,
    activePage,
    setActivePage,
    navigateToLanding,
  } = useApp();

  return (
    <header className="h-14 bg-[#0B101A]/85 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-5 flex items-center justify-between gap-2 z-20 shrink-0 select-none shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActivePage('overview')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-neutral-950 flex items-center justify-center font-bold tracking-tighter text-base font-royal shadow-[0_0_16px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.45)] transition-all">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-[0.2em] text-sm text-white font-royal uppercase transition-colors group-hover:text-amber-200">
                NIVARA
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 border border-white/[0.1] tracking-wider">
                OPS • P1
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-amber-200/80 font-royal-sub italic tracking-[0.05em] hidden sm:block font-medium leading-tight">
              Resilience • Spatial Intelligence
            </div>
          </div>
        </button>
      </div>

      {/* Operational Telemetry Indicators */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-1">
        {/* Location / GPS Indicator */}
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-neutral-300 text-xs font-mono transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(14,165,233,0.15)]"
          title="Click to view GPS & Location Diagnostics"
        >
          <div className="w-4 h-4 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-2.5 h-2.5 text-sky-400" />
          </div>
          <span className="truncate max-w-[120px] sm:max-w-[170px] text-neutral-200">
            {userLocation.placeName.split(',')[0]}
          </span>
        </button>

        {/* GPS Hardware Status */}
        <StatusPill
          type="gps"
          gpsStatus={gpsStatus}
          interactive
          onClick={() => setIsLocationModalOpen(true)}
        />

        {/* Network Connectivity Status */}
        <StatusPill
          type="connectivity"
          connectivityStatus={connectivity}
          interactive
          onClick={toggleConnectivityMode}
        />

        {/* Offline Package Status */}
        <button
          type="button"
          onClick={() => setIsOfflineModalOpen(true)}
          className="hidden md:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-xs font-mono text-neutral-300 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(20,184,166,0.15)]"
          title="Manage Offline Safety Package"
        >
          <div className="w-4 h-4 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <HardDrive className="w-2.5 h-2.5 text-teal-400" />
          </div>
          <span className="text-neutral-400 text-[11px]">CACHE:</span>
          <span className="text-teal-300 font-semibold">{offlinePackage.status}</span>
        </button>

        {/* Home / Landing Page Quick Return */}
        <button
          type="button"
          onClick={navigateToLanding}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-neutral-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-xs"
          title="Return to Home / Landing Showcase"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Emergency Mode Quick Action */}
        <button
          type="button"
          onClick={() => setActivePage('emergency')}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
            activePage === 'emergency'
              ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.45)] border border-rose-400'
              : 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-800/60 hover:border-rose-600/70 shadow-[0_0_14px_rgba(225,29,72,0.18)]'
          }`}
          title="Activate Emergency Mode"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="hidden xs:inline">EMERGENCY</span>
        </button>
      </div>
    </header>
  );
};
