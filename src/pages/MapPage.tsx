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
        className={`hidden md:flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all duration-300 z-10 shrink-0 ${
          isSidebarOpen ? 'w-80 lg:w-96' : 'w-0 border-r-0 overflow-hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-neutral-800 space-y-2 bg-neutral-900/60">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Tactical Directory
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
              {customLocalData ? 'LOCAL SIMULATION' : `${activeSector.name.split(' ')[0]} GRID`}
            </span>
          </div>

          {/* Localized Drill Trigger (if user has real GPS or manual coordinates) */}
          <div className="pt-1">
            {customLocalData ? (
              <button
                type="button"
                onClick={clearLocalSimulation}
                className="w-full py-1.5 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Reset to Standard Sector Grid</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateLocalSimulation}
                className="w-full py-1.5 px-2.5 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800 text-sky-300 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Generate Drill Near My Coordinates</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-4 gap-1 pt-1 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({hazards.length + safePlaces.length + blockedRoads.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('hazards')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                filterTab === 'hazards'
                  ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              Hazards ({hazards.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('shelters')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                filterTab === 'shelters'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              Safe ({safePlaces.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('blocked')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                filterTab === 'blocked'
                  ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              Blocked ({blockedRoads.length})
            </button>
          </div>
        </div>

        {/* Directory List Items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {directoryItems.map((entry) => {
            const isHazard = entry.category === 'hazard';
            const isHospital = entry.category === 'hospital';
            const isBlocked = entry.category === 'blocked';
            const isReliefCamp = entry.category === 'relief_camp';

            return (
              <div
                key={entry.id}
                onClick={() => handleItemClick(entry)}
                className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/90 hover:border-neutral-700 transition-all cursor-pointer space-y-1 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isHazard ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    ) : isHospital ? (
                      <HeartPulse className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : isReliefCamp ? (
                      <Home className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    ) : isBlocked ? (
                      <Slash className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                      {entry.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-sky-400 shrink-0">
                    {mapService.formatDistance(entry.distanceKm)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                  <span className="truncate max-w-[190px]">{entry.address}</span>
                  <span className="text-amber-400/90 shrink-0">{entry.bearingStr}</span>
                </div>
              </div>
            );
          })}

          {directoryItems.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              No assets in active filter.
            </div>
          )}
        </div>
      </div>

      {/* Toggle Sidebar Button (Desktop) */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex absolute top-16 left-0 z-20 p-1.5 rounded-r-lg bg-neutral-900/95 border border-l-0 border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer shadow-lg"
        title={isSidebarOpen ? 'Collapse Directory Sidebar' : 'Expand Directory Sidebar'}
      >
        {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Full-Bleed Interactive Nivara Tactical Map */}
      <div className="flex-1 h-full w-full relative">
        <NivaraMap className="w-full h-full" initialZoom={13} />
      </div>
    </div>
  );
};
