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
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Badge level={scenarioData.overallRisk} size="lg" />
              <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                SECTOR THREAT ASSESSMENT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {scenarioData.overallRisk === 'SAFE'
                ? 'Your Current Sector Has No Active Severe Hazards'
                : `${scenarioData.name}: Active Threat Warning`}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed font-sans">
              {scenarioData.riskSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1.5 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-200 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Sector: {userLocation.placeName}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Synchronized: Live</span>
              </div>
              <div className="text-amber-300 font-semibold text-[11px] bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                DEMO PROFILE ACTIVE
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setActivePage('safety')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.2] text-xs font-mono font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-98"
            >
              <span>View Safety Protocols</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              type="button"
              onClick={() => setIsScenarioModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-500/50 text-xs font-mono font-semibold text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)] active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Scenario</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL TELEMETRY MATRIX */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Location / GPS Status */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer space-y-2.5 group shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="tracking-wider uppercase text-[10px] font-semibold">POSITIONING</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
              <Navigation className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-xl font-bold text-white font-mono">{gpsStatus}</div>
          <p className="text-[11px] text-neutral-400 truncate">
            {userLocation.source === 'gps' ? 'Live GNSS Hardware Fix' : 'Kolkata Reference Point'}
          </p>
        </div>

        {/* Connectivity Status */}
        <div
          onClick={toggleConnectivityMode}
          className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer space-y-2.5 group shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          title="Click to toggle network state"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="tracking-wider uppercase text-[10px] font-semibold">NETWORK TELEMETRY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
              <Wifi className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-xl font-bold text-white font-mono">{connectivity}</div>
          <p className="text-[11px] text-neutral-400">
            {connectivity === 'OFFLINE'
              ? 'Local cache active (Zero network required)'
              : 'Live sync verified'}
          </p>
        </div>

        {/* Offline Safety Package */}
        <div
          onClick={() => setIsOfflineModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer space-y-2.5 group shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="tracking-wider uppercase text-[10px] font-semibold">OFFLINE PACKAGE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
              <HardDrive className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-xl font-bold text-teal-300 font-mono">
            {offlinePackage.status}
          </div>
          <p className="text-[11px] text-neutral-400">
            {offlinePackage.sizeMb} MB stored • {offlinePackage.regionName}
          </p>
        </div>

        {/* Active Threat Count */}
        <div
          onClick={() => setActivePage('map')}
          className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer space-y-2.5 group shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="tracking-wider uppercase text-[10px] font-semibold">ACTIVE HAZARDS</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {activeHazards.length} Zones ({blockedRoads.length} Blocked)
          </div>
          <p className="text-[11px] text-neutral-400">Click to view on interactive tactical map</p>
        </div>
      </section>

      {/* 3. QUICK ACTIONS BAR */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
          <span className="w-1 h-3 rounded-full bg-amber-400" />
          <span>Rapid Operational Actions</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActivePage('map')}
            className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.4)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-2.5 shadow-[0_0_12px_rgba(14,165,233,0.18)] group-hover:bg-sky-500/25 transition-all">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white font-display">Open Safety Map</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Explore full tactical view</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMapItem(nearestShelter);
              setActivePage('map');
            }}
            className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.4)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-2.5 shadow-[0_0_12px_rgba(20,184,166,0.18)] group-hover:bg-teal-500/25 transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white font-display">Find Safe Place</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Nearest: {nearestShelter.name.split(' ')[0]}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActivePage('emergency')}
            className="p-4 rounded-2xl bg-rose-950/30 backdrop-blur-xl border border-rose-500/35 hover:border-rose-500/60 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(244,63,94,0.25)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-2.5 shadow-[0_0_14px_rgba(244,63,94,0.25)] group-hover:bg-rose-500/30 transition-all">
              <AlertOctagon className="w-4 h-4 animate-pulse" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-rose-100 font-display">Emergency Mode</div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">Distress protocols & contacts</div>
          </button>

          <button
            type="button"
            onClick={() => setActivePage('reports')}
            className="p-4 rounded-2xl bg-[#0E1524]/65 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.4)] text-left transition-all duration-200 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5 shadow-[0_0_12px_rgba(245,158,11,0.18)] group-hover:bg-amber-500/25 transition-all">
              <FilePlus className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs sm:text-sm text-white font-display">Report Hazard</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Community ground feedback</div>
          </button>
        </div>
      </section>

      {/* 4. MAP OVERVIEW & NEARBY SAFETY INFORMATION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactical Map Card Preview */}
        <div className="lg:col-span-2 bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-[380px] sm:h-[440px] shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]/80">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-amber-400 shrink-0" />
              <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
                Live Tactical Map
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-amber-300 border border-amber-500/30">
                OPS FEED
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('map')}
              className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-2.5 py-1 rounded-lg transition-all"
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
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                <span className="w-1 h-3 rounded-full bg-teal-400" />
                <span>Nearby Safe Places ({safePlaces.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('safety')}
                className="text-xs font-mono text-amber-300 hover:text-amber-200 cursor-pointer"
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
                    className="p-3 rounded-xl bg-[#090D15]/80 border border-white/[0.07] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-1.5 shadow-sm"
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
                        <h4 className="text-xs font-bold text-white truncate max-w-[170px] font-display">
                          {place.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">{dist}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{place.location.address}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                      <span>{place.open24x7 ? 'Open 24/7' : 'Standard hours'}</span>
                      <span className="text-teal-300 font-semibold">Verified Hub</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blocked Roads snippet */}
          {blockedRoads.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs shadow-[0_0_15px_rgba(245,158,11,0.12)]">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Slash className="w-3.5 h-3.5 text-amber-400" />
                <span>{blockedRoads.length} Blocked Route Identified</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {blockedRoads[0].roadName}: {blockedRoads[0].reason}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
