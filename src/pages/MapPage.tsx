import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  HeartPulse,
  Home,
  Slash,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  RotateCcw,
  Navigation,
  Compass,
} from 'lucide-react';
import { NivaraMap } from '../components/map/NivaraMap';
import { useApp } from '../state/AppContext';
import { hazardService } from '../services/hazardService';
import { mapService } from '../services/mapService';
import { MapInspectionItem } from '../types';

export const MapPage: React.FC = () => {
  const {
    activeScenario,
    customLocalData,
    generateLocalSimulation,
    clearLocalSimulation,
    userLocation,
    setSelectedMapItem,
    triggerFlyTo,
    activeSector,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'hazards' | 'shelters' | 'blocked'>('all');

  const hazards = useMemo(() => {
    return hazardService.getActiveHazards(activeScenario, customLocalData?.hazards);
  }, [activeScenario, customLocalData]);

  const safePlaces = useMemo(() => {
    return hazardService.getSafePlaces(customLocalData?.safePlaces);
  }, [customLocalData]);

  const blockedRoads = useMemo(() => {
    return hazardService.getBlockedRoads(activeScenario, customLocalData?.blockedRoads);
  }, [activeScenario, customLocalData]);

  // Unified directory items list with computed distances
  const directoryItems = useMemo(() => {
    const list: {
      id: string;
      title: string;
      category: 'hazard' | 'shelter' | 'hospital' | 'relief_camp' | 'blocked';
      address: string;
      distanceKm: number;
      bearingStr: string;
      lat: number;
      lng: number;
      item: MapInspectionItem;
    }[] = [];

    // Hazards
    if (filterTab === 'all' || filterTab === 'hazards') {
      hazards.forEach((h) => {
        const dist = mapService.calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          h.location.lat,
          h.location.lng
        );
        const b = mapService.calculateBearing(
          userLocation.lat,
          userLocation.lng,
          h.location.lat,
          h.location.lng
        );
        list.push({
          id: h.id,
          title: h.title,
          category: 'hazard',
          address: h.location.address,
          distanceKm: dist,
          bearingStr: b.formatted,
          lat: h.location.lat,
          lng: h.location.lng,
          item: h,
        });
      });
    }

    // Shelters & Medical
    if (filterTab === 'all' || filterTab === 'shelters') {
      safePlaces.forEach((sp) => {
        const dist = mapService.calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          sp.location.lat,
          sp.location.lng
        );
        const b = mapService.calculateBearing(
          userLocation.lat,
          userLocation.lng,
          sp.location.lat,
          sp.location.lng
        );
        list.push({
          id: sp.id,
          title: sp.name,
          category: sp.category,
          address: sp.location.address,
          distanceKm: dist,
          bearingStr: b.formatted,
          lat: sp.location.lat,
          lng: sp.location.lng,
          item: sp,
        });
      });
    }

    // Blocked Roads
    if (filterTab === 'all' || filterTab === 'blocked') {
      blockedRoads.forEach((br) => {
        const coord = br.coordinates[0];
        const dist = mapService.calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          coord[0],
          coord[1]
        );
        const b = mapService.calculateBearing(
          userLocation.lat,
          userLocation.lng,
          coord[0],
          coord[1]
        );
        list.push({
          id: br.id,
          title: br.roadName,
          category: 'blocked',
          address: br.reason,
          distanceKm: dist,
          bearingStr: b.formatted,
          lat: coord[0],
          lng: coord[1],
          item: br,
        });
      });
    }

    // Sort by proximity to user
    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [hazards, safePlaces, blockedRoads, filterTab, userLocation]);

  const handleItemClick = (entry: (typeof directoryItems)[0]) => {
    setSelectedMapItem(entry.item);
    triggerFlyTo(entry.lat, entry.lng, 15);
  };

  return (
    <div id="safety-map-page-root" className="flex-1 h-full w-full relative flex overflow-hidden">
      {/* Collapsible Tactical Directory Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-[#070B12]/95 backdrop-blur-2xl border-r border-white/[0.08] transition-all duration-300 z-10 shrink-0 shadow-[8px_0_32px_rgba(0,0,0,0.6)] relative overflow-hidden ${
          isSidebarOpen ? 'w-80 lg:w-96' : 'w-0 border-r-0 overflow-hidden'
        }`}
      >
        {/* Subtle Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/50 via-sky-400/60 to-teal-400/50 z-20" />

        {/* Sidebar Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.08] space-y-3 bg-gradient-to-b from-[#0F1626]/90 via-[#0B101C]/95 to-[#080C14]/95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-600/10 border border-amber-500/35 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-black text-xs sm:text-[13px] text-white uppercase tracking-wider">
                  Tactical Directory
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Sector Feed</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              </span>
              <span className="text-[10px] font-display font-bold text-amber-300 bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.15)] uppercase tracking-wider">
                {customLocalData ? 'LOCAL DRILL' : `${activeSector.name.split(' ')[0]} GRID`}
              </span>
            </div>
          </div>

          {/* Localized Drill Trigger (if user has real GPS or manual coordinates) */}
          <div>
            {customLocalData ? (
              <button
                type="button"
                onClick={clearLocalSimulation}
                className="relative overflow-hidden group w-full py-2 px-3 rounded-xl bg-gradient-to-r from-neutral-800/90 to-neutral-850/90 hover:from-neutral-750 hover:to-neutral-800 border border-white/[0.12] hover:border-white/[0.25] text-neutral-200 font-display font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Reset to Standard Sector Grid</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateLocalSimulation}
                className="relative overflow-hidden group w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500/20 via-cyan-500/15 to-sky-600/25 hover:from-sky-500/30 hover:via-cyan-500/25 hover:to-sky-600/35 border border-sky-500/40 hover:border-sky-400/70 text-sky-200 font-display font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(14,165,233,0.2)] hover:shadow-[0_0_26px_rgba(14,165,233,0.35)] active:scale-[0.98]"
              >
                <div className="w-5 h-5 rounded-lg bg-sky-500/25 border border-sky-500/40 flex items-center justify-center text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="tracking-tight">Generate Drill Near My Coordinates</span>
              </button>
            )}
          </div>

          {/* Modern Tactile Segmented Filter Pills */}
          <div className="p-1 bg-[#060910]/90 rounded-xl border border-white/[0.08] grid grid-cols-4 gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`py-1.5 px-1 rounded-lg text-center font-display font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center ${
                filterTab === 'all'
                  ? 'bg-gradient-to-b from-white/[0.15] to-white/[0.06] text-white border border-white/[0.18] shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>All</span>
              <span className="text-[10px] opacity-75">
                ({hazards.length + safePlaces.length + blockedRoads.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('hazards')}
              className={`py-1.5 px-1 rounded-lg text-center font-display font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center ${
                filterTab === 'hazards'
                  ? 'bg-gradient-to-b from-rose-500/30 to-rose-600/15 text-rose-200 border border-rose-500/50 shadow-[0_0_14px_rgba(244,63,94,0.3)]'
                  : 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <span>Hazards</span>
              <span className="text-[10px] opacity-75">({hazards.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('shelters')}
              className={`py-1.5 px-1 rounded-lg text-center font-display font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center ${
                filterTab === 'shelters'
                  ? 'bg-gradient-to-b from-teal-500/30 to-emerald-600/15 text-teal-200 border border-teal-500/50 shadow-[0_0_14px_rgba(20,184,166,0.3)]'
                  : 'text-teal-400/80 hover:text-teal-300 hover:bg-teal-500/10'
              }`}
            >
              <span>Safe</span>
              <span className="text-[10px] opacity-75">({safePlaces.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('blocked')}
              className={`py-1.5 px-1 rounded-lg text-center font-display font-bold text-[11px] transition-all cursor-pointer flex flex-col items-center justify-center ${
                filterTab === 'blocked'
                  ? 'bg-gradient-to-b from-amber-500/30 to-orange-600/15 text-amber-200 border border-amber-500/50 shadow-[0_0_14px_rgba(245,158,11,0.3)]'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <span>Blocked</span>
              <span className="text-[10px] opacity-75">({blockedRoads.length})</span>
            </button>
          </div>
        </div>

        {/* Directory List Items */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5">
          {directoryItems.map((entry) => {
            const isHazard = entry.category === 'hazard';
            const isHospital = entry.category === 'hospital';
            const isBlocked = entry.category === 'blocked';
            const isReliefCamp = entry.category === 'relief_camp';

            return (
              <div
                key={entry.id}
                onClick={() => handleItemClick(entry)}
                className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-b from-[#0E1523]/85 via-[#0A0F1B]/90 to-[#070A12]/95 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.24] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,0.55)] transition-all duration-200 cursor-pointer space-y-2 group"
              >
                {/* Dynamic Category Accent Bar */}
                <div
                  className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full ${
                    isHazard
                      ? 'bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                      : isHospital
                      ? 'bg-gradient-to-b from-sky-400 to-blue-500 shadow-[0_0_10px_rgba(14,165,233,0.6)]'
                      : isReliefCamp
                      ? 'bg-gradient-to-b from-purple-400 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                      : isBlocked
                      ? 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                      : 'bg-gradient-to-b from-teal-400 to-emerald-500 shadow-[0_0_10px_rgba(20,184,166,0.6)]'
                  }`}
                />

                {/* Top Row: Icon Capsule + Title + Category Subtitle + Distance Pill */}
                <div className="flex items-start justify-between gap-2.5 pl-1.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                        isHazard
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/35 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                          : isHospital
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/35 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
                          : isReliefCamp
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/35 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                          : isBlocked
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-teal-500/20 text-teal-400 border border-teal-500/35 shadow-[0_0_10px_rgba(20,184,166,0.2)]'
                      }`}
                    >
                      {isHazard ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : isHospital ? (
                        <HeartPulse className="w-3.5 h-3.5" />
                      ) : isReliefCamp ? (
                        <Home className="w-3.5 h-3.5" />
                      ) : isBlocked ? (
                        <Slash className="w-3.5 h-3.5" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-[13px] font-display font-bold text-white group-hover:text-amber-200 transition-colors truncate tracking-tight">
                        {entry.title}
                      </h3>
                      <div className="text-[9px] sm:text-[10px] font-display font-medium text-neutral-400 uppercase tracking-wider">
                        {isHazard
                          ? 'ACTIVE HAZARD ZONE'
                          : isHospital
                          ? 'MEDICAL CARE'
                          : isReliefCamp
                          ? 'RELIEF & STAGING'
                          : isBlocked
                          ? 'BLOCKED ROUTE'
                          : 'SAFE SHELTER'}
                      </div>
                    </div>
                  </div>

                  {/* Distance pill */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[11px] font-display font-black text-sky-300 bg-sky-500/10 border border-sky-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.15)] group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-colors">
                      {mapService.formatDistance(entry.distanceKm)}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Address + Bearing Radar Pill + Navigation Chevron */}
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/[0.05] pl-1.5 text-[11px]">
                  <span className="text-neutral-400 group-hover:text-neutral-300 truncate font-sans text-[11px]">
                    {entry.address}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-display font-bold text-amber-300/90 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full">
                      <Navigation className="w-2.5 h-2.5 text-amber-400 -rotate-45" />
                      <span>{entry.bearingStr}</span>
                    </span>
                    <div className="w-5 h-5 rounded-full bg-white/[0.03] group-hover:bg-amber-400/20 text-neutral-500 group-hover:text-amber-300 flex items-center justify-center transition-all">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {directoryItems.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Compass className="w-6 h-6 text-neutral-600 mx-auto" />
              <p className="text-xs font-display font-medium text-neutral-400">
                No assets found in active filter category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button (Desktop) */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex absolute top-16 left-0 z-20 p-2 rounded-r-xl bg-[#0B101C]/95 backdrop-blur-xl border border-l-0 border-white/[0.12] hover:border-amber-500/50 text-neutral-300 hover:text-amber-300 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        title={isSidebarOpen ? 'Collapse Directory Sidebar' : 'Expand Directory Sidebar'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Full-Bleed Interactive Nivara Tactical Map */}
      <div className="flex-1 h-full w-full relative">
        <NivaraMap className="w-full h-full" initialZoom={13} />
      </div>
    </div>
  );
};
