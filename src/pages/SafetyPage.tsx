import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Phone,
  CheckCircle2,
  Navigation,
  Slash,
  HelpCircle,
  FileCheck,
  Building,
  Info,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge } from '../components/common/Badge';
import { hazardService } from '../services/hazardService';
import { mapService } from '../services/mapService';
import { SafePlaceCategory } from '../types';

export const SafetyPage: React.FC = () => {
  const {
    activeScenario,
    scenarioData,
    userLocation,
    setSelectedMapItem,
    setActivePage,
    setIsScenarioModalOpen,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<SafePlaceCategory | 'all'>('all');

  const activeHazards = hazardService.getActiveHazards(activeScenario);
  const blockedRoads = hazardService.getBlockedRoads(activeScenario);
  const allSafePlaces = hazardService.getSafePlaces();

  const filteredSafePlaces = allSafePlaces.filter((sp) => {
    if (categoryFilter === 'all') return true;
    return sp.category === categoryFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 rounded-full bg-amber-400 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
              Safety Assessment & Facilities
            </h1>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-amber-300 border border-amber-500/30">
              OPS AUDIT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 pl-4 font-sans">
            Real-time hazard zones, designated civil defense shelters, and emergency protocols in Kolkata.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsScenarioModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-amber-300 self-start sm:self-auto cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
        >
          <span className="text-neutral-400">Simulation:</span>
          <span className="font-bold underline">{scenarioData.name}</span>
        </button>
      </div>

      {/* 1. CURRENT RISK BREAKDOWN CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <Badge level={scenarioData.overallRisk} size="lg" />
            <span className="text-sm font-bold text-white font-display">Risk Level Breakdown</span>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
            Sector: <span className="text-neutral-200 font-semibold">{scenarioData.affectedAreaName}</span>
          </span>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed font-sans">{scenarioData.riskSummary}</p>

        {/* Tactical Recommendation Box */}
        <div className="p-4 rounded-xl bg-[#080C14]/80 border border-amber-500/25 space-y-2 shadow-[0_0_16px_rgba(245,158,11,0.06)]">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold tracking-wider">
            <Info className="w-4 h-4 text-amber-400" />
            <span>PRIMARY SAFETY ADVISORY</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{scenarioData.safetyRecommendation}</p>
          <div className="text-xs text-teal-300 pt-1 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Evacuation Direction: {scenarioData.evacuationInstruction}</span>
          </div>
        </div>

        {/* Key Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-[#080C14]/60 border border-white/[0.07]">
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Active Hazards</div>
            <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
              {activeHazards.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080C14]/60 border border-white/[0.07]">
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Blocked Corridors</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {blockedRoads.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080C14]/60 border border-white/[0.07]">
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Verified Shelters</div>
            <div className="text-xl font-bold text-teal-300 font-mono mt-0.5">
              {allSafePlaces.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#080C14]/60 border border-white/[0.07]">
            <div className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Relief Capacity</div>
            <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">16,300 Pax</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE HAZARDS IN THIS SECTOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-rose-400" />
            <span>Active Hazard Perimeters ({activeHazards.length})</span>
          </div>
          <span className="text-[11px] text-neutral-500 normal-case font-mono">Incident vector telemetry</span>
        </div>

        {activeHazards.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D131F]/60 backdrop-blur-xl border border-white/[0.08] text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">No active hazards reported</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              All primary corridors in Kolkata are clear in the baseline scenario. You can test active disasters via the Simulation Switcher.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeHazards.map((hazard) => {
              const dist = mapService.formatDistance(
                mapService.calculateDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  hazard.location.lat,
                  hazard.location.lng
                )
              );

              return (
                <div
                  key={hazard.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 backdrop-blur-xl border border-white/[0.08] space-y-3 hover:border-amber-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge level={hazard.severity} size="sm" />
                        <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">{dist} away</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-2 font-display">{hazard.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">{hazard.description}</p>

                  <div className="text-[11px] font-mono text-neutral-400 pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <span>Radius: {hazard.affectedRadiusMeters}m</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapItem(hazard);
                        setActivePage('map');
                      }}
                      className="text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
                    >
                      Locate on Map →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. BLOCKED CORRIDORS */}
      {blockedRoads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
            <span className="w-1 h-3 rounded-full bg-amber-400" />
            <span>Inaccessible Transit Arteries ({blockedRoads.length})</span>
          </div>
          <div className="space-y-2">
            {blockedRoads.map((road) => (
              <div
                key={road.id}
                className="p-3.5 rounded-xl bg-[#0D131F]/75 backdrop-blur-xl border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Slash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-white font-display">{road.roadName}</span>
                    <Badge level={road.severity} size="sm" />
                  </div>
                  <p className="text-neutral-400 pl-5 leading-relaxed">{road.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('map')}
                  className="self-start sm:self-auto px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 rounded-lg font-mono text-[11px] shrink-0 border border-white/[0.08] cursor-pointer transition-all"
                >
                  View Closure on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VERIFIED SAFE PLACES & EMERGENCY FACILITIES */}
      <div className="space-y-3.5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
            <span className="w-1 h-3 rounded-full bg-teal-400" />
            <span>Designated Safe Facilities ({filteredSafePlaces.length})</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            {(['all', 'shelter', 'hospital', 'relief_camp', 'police', 'fire_station'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer capitalize font-mono text-xs ${
                    categoryFilter === cat
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  {cat === 'all' ? 'All Types' : cat.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSafePlaces.map((sp) => {
            const isHospital = sp.category === 'hospital';
            const dist = mapService.formatDistance(
              mapService.calculateDistanceKm(
                userLocation.lat,
                userLocation.lng,
                sp.location.lat,
                sp.location.lng
              )
            );

            return (
              <div
                key={sp.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/75 backdrop-blur-xl border border-white/[0.08] space-y-3 flex flex-col justify-between hover:border-teal-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-all duration-200"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 border border-white/[0.08] uppercase font-semibold">
                      {sp.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-teal-300 font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md">{dist}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug font-display">{sp.name}</h3>
                  <p className="text-xs text-neutral-400">{sp.location.address}</p>

                  {sp.capacity && (
                    <div className="text-[11px] font-mono text-neutral-300 flex items-center justify-between pt-1">
                      <span className="text-neutral-400">Occupancy:</span>
                      <span className="font-semibold">
                        {sp.capacity.current} / {sp.capacity.max} beds
                      </span>
                    </div>
                  )}

                  {sp.suppliesAvailable.length > 0 && (
                    <div className="pt-1">
                      <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1 font-semibold">
                        Critical Supplies:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sp.suppliesAvailable.slice(0, 3).map((sup, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#080C14]/80 text-neutral-300 border border-white/[0.07]"
                          >
                            {sup}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  {sp.contactPhone ? (
                    <a
                      href={`tel:${sp.contactPhone}`}
                      className="text-xs font-mono text-teal-300 hover:text-teal-200 flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{sp.contactPhone}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-mono">Civic Defense Unit</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMapItem(sp);
                      setActivePage('map');
                    }}
                    className="text-xs font-mono text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
                  >
                    View on Map →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
