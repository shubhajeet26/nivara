import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Phone,
  CheckCircle2,
  Navigation,
  Slash,
  Building,
  Info,
  Search,
  MapPin,
  Compass,
  ArrowRight,
  Radio,
  Zap,
  Droplets,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  Flame,
  Waves,
  Crosshair,
  Bed,
  Users,
  AlertOctagon,
  SlidersHorizontal,
  FileText,
  Ambulance,
  PhoneCall,
  CheckSquare,
  Square,
  ExternalLink,
  RotateCcw,
  X,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge } from '../components/common/Badge';
import { hazardService } from '../services/hazardService';
import { mapService } from '../services/mapService';
import { SafePlaceCategory, RiskLevel, SafePlaceItem, HazardItem } from '../types';

export const SafetyPage: React.FC = () => {
  const {
    activeScenario,
    scenarioData,
    userLocation,
    setSelectedMapItem,
    setActivePage,
    setIsScenarioModalOpen,
    customLocalData,
    triggerFlyTo,
    showToast,
  } = useApp();

  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState<SafePlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOpen24x7, setOnlyOpen24x7] = useState(false);
  const [onlyWithBeds, setOnlyWithBeds] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'capacity'>('distance');
  const [hazardSeverityFilter, setHazardSeverityFilter] = useState<RiskLevel | 'all'>('all');
  const [activeProtocolTab, setActiveProtocolTab] = useState<'immediate' | 'grabbag' | 'frequencies'>('immediate');

  // Interactive grab-bag checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    water: true,
    documents: true,
    torch: false,
    firstaid: true,
    powerbank: false,
    whistle: false,
  });

  const toggleCheckItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get active data (supporting custom local GPS simulations if activated)
  const activeHazards = hazardService.getActiveHazards(activeScenario, customLocalData?.hazards);
  const blockedRoads = hazardService.getBlockedRoads(activeScenario, customLocalData?.blockedRoads);
  const allSafePlaces = hazardService.getSafePlaces(customLocalData?.safePlaces);

  // Compute distances & sort facilities
  const processedSafePlaces = useMemo(() => {
    return allSafePlaces.map((sp) => {
      const distKm = mapService.calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        sp.location.lat,
        sp.location.lng
      );
      const bearing = mapService.calculateBearing(
        userLocation.lat,
        userLocation.lng,
        sp.location.lat,
        sp.location.lng
      );
      return {
        ...sp,
        calculatedDistanceKm: distKm,
        formattedDistance: mapService.formatDistance(distKm),
        bearingDegrees: bearing.degrees,
        bearingCompass: bearing.direction,
      };
    });
  }, [allSafePlaces, userLocation.lat, userLocation.lng]);

  // Filtered facilities
  const filteredSafePlaces = useMemo(() => {
    return processedSafePlaces
      .filter((sp) => {
        // Category filter
        if (categoryFilter !== 'all' && sp.category !== categoryFilter) {
          return false;
        }
        // 24/7 toggle
        if (onlyOpen24x7 && !sp.open24x7) {
          return false;
        }
        // Has beds toggle
        if (onlyWithBeds && (!sp.capacity || sp.capacity.max - sp.capacity.current <= 0)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = sp.name.toLowerCase().includes(q);
          const matchAddress = sp.location.address.toLowerCase().includes(q);
          const matchSupplies = sp.suppliesAvailable.some((s) => s.toLowerCase().includes(q));
          const matchCat = sp.category.toLowerCase().includes(q);
          if (!matchName && !matchAddress && !matchSupplies && !matchCat) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.calculatedDistanceKm - b.calculatedDistanceKm;
        }
        // Sort by available beds
        const availA = a.capacity ? a.capacity.max - a.capacity.current : 0;
        const availB = b.capacity ? b.capacity.max - b.capacity.current : 0;
        return availB - availA;
      });
  }, [processedSafePlaces, categoryFilter, onlyOpen24x7, onlyWithBeds, searchQuery, sortBy]);

  // Filtered hazards
  const filteredHazards = useMemo(() => {
    if (hazardSeverityFilter === 'all') return activeHazards;
    return activeHazards.filter((h) => h.severity === hazardSeverityFilter);
  }, [activeHazards, hazardSeverityFilter]);

  // Summary Metrics calculations
  const totalShelterCapacity = useMemo(() => {
    return allSafePlaces.reduce((acc, sp) => acc + (sp.capacity?.max || 0), 0);
  }, [allSafePlaces]);

  const totalOccupied = useMemo(() => {
    return allSafePlaces.reduce((acc, sp) => acc + (sp.capacity?.current || 0), 0);
  }, [allSafePlaces]);

  const availableBeds = Math.max(0, totalShelterCapacity - totalOccupied);
  const occupancyPercentage = totalShelterCapacity > 0 ? Math.round((totalOccupied / totalShelterCapacity) * 100) : 0;

  // Category counts for quick filter chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allSafePlaces.length,
      shelter: 0,
      hospital: 0,
      relief_camp: 0,
      police: 0,
      fire_station: 0,
    };
    allSafePlaces.forEach((sp) => {
      if (counts[sp.category] !== undefined) {
        counts[sp.category]++;
      }
    });
    return counts;
  }, [allSafePlaces]);

  const handleInspectFacility = (sp: SafePlaceItem) => {
    setSelectedMapItem(sp);
    triggerFlyTo(sp.location.lat, sp.location.lng, 15);
    setActivePage('map');
  };

  const handleInspectHazard = (hazard: HazardItem) => {
    setSelectedMapItem(hazard);
    triggerFlyTo(hazard.location.lat, hazard.location.lng, 15);
    setActivePage('map');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full font-sans antialiased text-neutral-100">
      {/* 1. TOP COMMAND BAR & LIVE INCIDENT BEACON */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
                </span>
                <span className="text-[11px] font-display font-bold uppercase tracking-wider">
                  Civil Defense Operations Grid
                </span>
              </div>
              <span className="text-xs font-display text-neutral-400 hidden sm:inline">•</span>
              <span className="text-xs font-display text-neutral-400">
                Sector: <strong className="text-neutral-200 font-bold">{scenarioData.affectedAreaName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
              Risk Assessment & Safe Sanctuaries
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed font-sans">
              Comprehensive threat perimeter telemetry, civil defense evacuation routes, and real-time medical & shelter capacity across the Kolkata Metropolitan Region.
            </p>
          </div>

          {/* Quick Simulation Selector Action */}
          <div className="shrink-0 flex items-center gap-2.5 self-start md:self-center">
            <button
              type="button"
              onClick={() => setIsScenarioModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/35 hover:border-amber-500/60 text-xs font-display font-bold text-amber-300 flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_16px_rgba(245,158,11,0.15)] hover:shadow-[0_0_24px_rgba(245,158,11,0.3)] active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">Simulation Mode</span>
                <span className="text-xs font-black text-white">{scenarioData.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 ml-1 shrink-0" />
            </button>
          </div>
        </div>

        {/* Rapid Emergency Hotline One-Touch Dispatch Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-display">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            Emergency Direct Dispatch:
          </span>
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-300 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>National 112</span>
          </a>
          <a
            href="tel:1077"
            className="px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Disaster Helpline 1077</span>
          </a>
          <a
            href="tel:102"
            className="px-3 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-bold text-sky-300 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(14,165,233,0.15)]"
          >
            <Ambulance className="w-3 h-3 text-sky-400" />
            <span>Ambulance 102</span>
          </a>
          <a
            href="tel:101"
            className="px-3 py-1.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-xs font-bold text-orange-300 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(249,115,22,0.15)]"
          >
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Fire Brigade 101</span>
          </a>
        </div>
      </div>

      {/* 2. REALISTIC TACTICAL RISK & EVACUATION BANNER */}
      <section
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 backdrop-blur-2xl border transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.6)] ${
          scenarioData.overallRisk === 'SAFE'
            ? 'bg-gradient-to-br from-[#0B1519]/90 via-[#071014]/95 to-[#04090C]/95 border-teal-500/30 shadow-[0_0_35px_rgba(20,184,166,0.12)]'
            : scenarioData.overallRisk === 'CAUTION'
            ? 'bg-gradient-to-br from-[#19150B]/90 via-[#141007]/95 to-[#0C0904]/95 border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)]'
            : scenarioData.overallRisk === 'WARNING'
            ? 'bg-gradient-to-br from-[#1A1208]/90 via-[#140E06]/95 to-[#0C0804]/95 border-orange-500/35 shadow-[0_0_35px_rgba(249,115,22,0.15)]'
            : 'bg-gradient-to-br from-[#1E0E12]/90 via-[#15090C]/95 to-[#0E0608]/95 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.18)]'
        }`}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row with Threat Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <Badge level={scenarioData.overallRisk} size="lg" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-display">
                  Threat Matrix Evaluation
                </h2>
                <div className="text-xs text-neutral-400 font-sans flex items-center gap-2">
                  <span>Sector Surveillance: <strong>Active</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-display font-medium">
                    <Radio className="w-3 h-3 animate-pulse" /> Telemetry Synced
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-display">
              <span className="text-xs text-neutral-400">Civil Alert Level:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border shadow-sm ${
                  scenarioData.overallRisk === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : scenarioData.overallRisk === 'WARNING'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                    : scenarioData.overallRisk === 'CAUTION'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                }`}
              >
                Code {scenarioData.overallRisk}
              </span>
            </div>
          </div>

          {/* Primary Assessment Summary */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
              {scenarioData.riskSummary}
            </p>
          </div>

          {/* Tactical Evacuation Advisory Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C14]/85 backdrop-blur-xl border border-amber-500/30 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2 text-xs font-display text-amber-300 font-bold tracking-wider uppercase">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Standard Operating Evacuation Advisory</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-display text-teal-300 font-bold">
                <Compass className="w-4 h-4 text-teal-400 shrink-0 animate-spin-slow" />
                <span>Vector: {scenarioData.evacuationInstruction}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {scenarioData.safetyRecommendation}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-display text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Primary Arteries Passable
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Low-Lying Underpasses Flooded
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('map')}
                className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Preview Safe Corridors on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4-Stat Live Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 font-display">
            {/* Active Threats */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-[#0A0F1D]/85 backdrop-blur-xl border border-white/[0.08] hover:border-rose-500/40 transition-colors shadow-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Active Hazards</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {activeHazards.length} <span className="text-xs font-bold text-neutral-400">Zones</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">
                {activeHazards.filter((h) => h.severity === 'CRITICAL').length} Critical • {activeHazards.filter((h) => h.severity === 'WARNING').length} Warning
              </div>
            </div>

            {/* Inaccessible Corridors */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-[#0A0F1D]/85 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 transition-colors shadow-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Blocked Corridors</span>
                <Slash className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {blockedRoads.length} <span className="text-xs font-bold text-neutral-400">Arteries</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">
                Waterlogged or Cordoned
              </div>
            </div>

            {/* Designated Sanctuaries */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-[#0A0F1D]/85 backdrop-blur-xl border border-white/[0.08] hover:border-teal-500/40 transition-colors shadow-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Facilities</span>
                <Shield className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-teal-300 mt-1">
                {allSafePlaces.length} <span className="text-xs font-bold text-neutral-400">Units</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">
                Shelters, Hospitals & Camps
              </div>
            </div>

            {/* Relief Bed Capacity */}
            <div className="relative overflow-hidden p-4 rounded-2xl bg-[#0A0F1D]/85 backdrop-blur-xl border border-white/[0.08] hover:border-sky-500/40 transition-colors shadow-md">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Shelter Occupancy</span>
                <Bed className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-sky-300 mt-1">
                {availableBeds.toLocaleString()} <span className="text-xs font-bold text-neutral-400">Beds Open</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-sans">
                {occupancyPercentage}% Total Occupancy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESIGNATED SHELTERS & EMERGENCY FACILITIES (SEARCH & FILTER DIRECTORY) */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-4 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                Designated Safe Sanctuaries & Facilities
              </h2>
              <span className="text-xs font-display font-bold px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300">
                {filteredSafePlaces.length} Ready
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 pl-4 font-sans">
              Municipal disaster shelters, trauma hospitals, and NDRF relief staging camps in Kolkata with verified power and water reserves.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 font-display text-xs self-start md:self-auto">
            <span className="text-neutral-400 font-medium">Sort By:</span>
            <button
              type="button"
              onClick={() => setSortBy('distance')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                sortBy === 'distance'
                  ? 'bg-teal-400 text-neutral-950 shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                  : 'bg-white/[0.05] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.09]'
              }`}
            >
              Closest First
            </button>
            <button
              type="button"
              onClick={() => setSortBy('capacity')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                sortBy === 'capacity'
                  ? 'bg-teal-400 text-neutral-950 shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                  : 'bg-white/[0.05] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.09]'
              }`}
            >
              Most Available Beds
            </button>
          </div>
        </div>

        {/* Search Bar & Smart Filters */}
        <div className="p-4 rounded-2xl bg-[#0B101C]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facility name, street address, supplies (e.g. 'SSKM', 'Oxygen', 'Generator')..."
                className="w-full bg-[#080C14]/90 border border-white/[0.1] text-xs sm:text-sm text-white placeholder-neutral-500 rounded-xl pl-10 pr-9 py-2.5 focus:outline-none focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Toggle Chips */}
            <div className="flex items-center gap-2 font-display text-xs shrink-0">
              <button
                type="button"
                onClick={() => setOnlyOpen24x7(!onlyOpen24x7)}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  onlyOpen24x7
                    ? 'bg-teal-500/20 text-teal-200 border-teal-500/50 shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-neutral-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>24/7 Access</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyWithBeds(!onlyWithBeds)}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  onlyWithBeds
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-neutral-200'
                }`}
              >
                <Bed className="w-3.5 h-3.5 text-sky-400" />
                <span>Beds Available</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-display text-xs">
            {(
              [
                { id: 'all', label: 'All Sanctuaries', icon: Building, color: 'text-neutral-300' },
                { id: 'shelter', label: 'Safe Shelters', icon: Shield, color: 'text-teal-400' },
                { id: 'hospital', label: 'Trauma & Hospitals', icon: HeartPulse, color: 'text-sky-400' },
                { id: 'relief_camp', label: 'Relief Camps', icon: Users, color: 'text-purple-400' },
                { id: 'police', label: 'Police Stations', icon: ShieldAlert, color: 'text-indigo-400' },
                { id: 'fire_station', label: 'Fire & Rescue', icon: Flame, color: 'text-rose-400' },
              ] as const
            ).map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.id] || 0;
              const isActive = categoryFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 flex items-center gap-2 border font-bold ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-neutral-950 border-teal-300 shadow-[0_0_14px_rgba(20,184,166,0.35)]'
                      : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : cat.color}`} />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-neutral-950 text-teal-300' : 'bg-white/[0.08] text-neutral-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Facilities Grid */}
        {filteredSafePlaces.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#0B101C]/60 backdrop-blur-xl border border-white/[0.08] text-center space-y-3">
            <Building className="w-10 h-10 text-neutral-500 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">No matching emergency facilities found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans leading-relaxed">
              Try adjusting your search terms, clearing the 24/7 or bed filters, or choosing "All Sanctuaries".
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
                setOnlyOpen24x7(false);
                setOnlyWithBeds(false);
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-display font-bold text-xs cursor-pointer border border-white/[0.1] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSafePlaces.map((sp) => {
              const isHospital = sp.category === 'hospital';
              const isReliefCamp = sp.category === 'relief_camp';
              const isShelter = sp.category === 'shelter';

              const occupancyRate = sp.capacity
                ? Math.min(100, Math.round((sp.capacity.current / sp.capacity.max) * 100))
                : 0;

              return (
                <div
                  key={sp.id}
                  className="group relative overflow-hidden p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/[0.08] hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  {/* Decorative top colored beam */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                      isHospital
                        ? 'bg-gradient-to-r from-transparent via-sky-400 to-transparent'
                        : isReliefCamp
                        ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-teal-400 to-transparent'
                    }`}
                  />

                  <div className="space-y-3">
                    {/* Top Row: Category Badge & Distance Vector */}
                    <div className="flex items-start justify-between gap-2 font-display">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider border shadow-xs ${
                            isHospital
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : isReliefCamp
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          }`}
                        >
                          {sp.category.replace('_', ' ')}
                        </span>
                        {sp.open24x7 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-bold">
                            24/7 OPEN
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2.5 py-0.5 rounded-full shadow-xs">
                        <Compass className="w-3 h-3 text-teal-400" />
                        <span>{sp.formattedDistance}</span>
                        <span className="text-neutral-400 text-[10px]">({sp.bearingCompass})</span>
                      </div>
                    </div>

                    {/* Facility Name & Street Address */}
                    <div>
                      <h3 className="text-base font-black text-white font-display leading-snug group-hover:text-teal-200 transition-colors">
                        {sp.name}
                      </h3>
                      <p className="text-xs text-neutral-300 mt-1 flex items-start gap-1.5 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{sp.location.address}</span>
                      </p>
                    </div>

                    {/* Live Bed Occupancy Progress Gauge */}
                    {sp.capacity && (
                      <div className="p-3 rounded-xl bg-[#080C14]/80 border border-white/[0.06] space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-display">
                          <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-sky-400" />
                            <span>Occupancy Rate</span>
                          </span>
                          <span className="font-extrabold text-white">
                            {sp.capacity.current} / {sp.capacity.max} beds ({occupancyRate}%)
                          </span>
                        </div>

                        {/* Progress segmented bar */}
                        <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              occupancyRate > 85
                                ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                : occupancyRate > 60
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                                : 'bg-gradient-to-r from-teal-400 to-emerald-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>

                        <div className="text-[10px] text-neutral-400 font-sans flex items-center justify-between pt-0.5">
                          <span>
                            Available:{' '}
                            <strong className="text-teal-300 font-bold">
                              {(sp.capacity.max - sp.capacity.current).toLocaleString()}
                            </strong>{' '}
                            spots
                          </span>
                          <span className="text-emerald-400 font-medium">Verified by NDRF</span>
                        </div>
                      </div>
                    )}

                    {/* Certified Supplies & Critical Infrastructure Badges */}
                    {sp.suppliesAvailable.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-bold">
                          Verified Provisions & Medical Assets:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sp.suppliesAvailable.map((sup, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-display font-medium px-2.5 py-0.5 rounded-full bg-white/[0.05] text-neutral-200 border border-white/[0.08]"
                            >
                              {sup}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Direct Route & Call */}
                  <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2 font-display">
                    {sp.contactPhone ? (
                      <a
                        href={`tel:${sp.contactPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{sp.contactPhone}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-sans">
                        Civil Defense Command Post
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleInspectFacility(sp)}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 hover:text-white border border-amber-500/40 font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:shadow-[0_0_18px_rgba(245,158,11,0.3)] active:scale-98"
                    >
                      <span>Locate on Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. ACTIVE HAZARDS IN THIS SECTOR */}
      <section className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-4 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                Active Threat Perimeters ({activeHazards.length})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 pl-4 font-sans">
              Real-time hazard zones detected by ground sensors and field reports. Cordoned buffer perimeters are strictly enforced.
            </p>
          </div>

          {/* Severity filter chips */}
          <div className="flex items-center gap-1.5 font-display text-xs">
            {(['all', 'CRITICAL', 'WARNING', 'CAUTION'] as const).map((sev) => {
              const isActive = hazardSeverityFilter === sev;
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setHazardSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                    isActive
                      ? sev === 'CRITICAL'
                        ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                        : sev === 'WARNING'
                        ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                        : sev === 'CAUTION'
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-white text-neutral-950 border-white'
                      : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {sev === 'all' ? 'All Threats' : sev}
                </button>
              );
            })}
          </div>
        </div>

        {filteredHazards.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D131F]/60 backdrop-blur-xl border border-white/[0.08] text-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto shadow-[0_0_16px_rgba(20,184,166,0.25)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">No active hazards in this filter</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-sans">
              The operational corridor is clear of high-severity alerts. You can test live disaster simulations using the scenario switcher above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHazards.map((hazard) => {
              const distKm = mapService.calculateDistanceKm(
                userLocation.lat,
                userLocation.lng,
                hazard.location.lat,
                hazard.location.lng
              );
              const formattedDist = mapService.formatDistance(distKm);

              return (
                <div
                  key={hazard.id}
                  className="p-5 rounded-2xl bg-[#0D1322]/85 backdrop-blur-xl border border-white/[0.08] space-y-3.5 hover:border-rose-500/40 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-display">
                        <Badge level={hazard.severity} size="sm" />
                        <span className="text-xs font-bold text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                          {formattedDist} away
                        </span>
                        <span className="text-[11px] text-neutral-400 font-sans hidden sm:inline">
                          Perimeter: {hazard.affectedRadiusMeters}m
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white font-display pt-1">
                        {hazard.title}
                      </h3>
                      <p className="text-xs text-neutral-400 flex items-center gap-1.5 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{hazard.location.address}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans bg-[#080C14]/70 p-3 rounded-xl border border-white/[0.06]">
                    {hazard.description}
                  </p>

                  <div className="text-xs font-display text-neutral-400 pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-sans">
                      <span>Reported: {hazard.reportedAt}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" /> Verified by Field Unit
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInspectHazard(hazard)}
                      className="text-amber-300 hover:text-amber-200 font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Locate on Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. INACCESSIBLE TRANSIT ARTERIES */}
      {blockedRoads.length > 0 && (
        <section className="space-y-3.5 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-4 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                Impassable Corridors & Road Barriers ({blockedRoads.length})
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-display hidden sm:inline">
              Avoid these thoroughfares during evacuation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blockedRoads.map((road) => (
              <div
                key={road.id}
                className="p-4 rounded-2xl bg-[#0D1322]/80 backdrop-blur-xl border border-white/[0.08] hover:border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-display">
                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <Slash className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-sm">{road.roadName}</span>
                    <Badge level={road.severity} size="sm" />
                  </div>
                  <p className="text-neutral-300 pl-8 leading-relaxed font-sans">{road.reason}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePage('map');
                    showToast(`Centering on ${road.roadName} corridor closure.`);
                  }}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 hover:text-white rounded-full font-display font-bold text-xs shrink-0 border border-white/[0.08] cursor-pointer transition-all hover:border-amber-500/40"
                >
                  Inspect on Map
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CIVIL DEFENSE PROTOCOLS & SURVIVAL READINESS (TABBED GUIDANCE) */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#090E1B]/90 backdrop-blur-2xl border border-white/[0.08] space-y-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-teal-400" />
              <h3 className="text-lg sm:text-xl font-black text-white font-display">
                Emergency Action Protocols & Civilian Readiness
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Official standard operating procedures advised by Kolkata Municipal Civil Defense & NDRF.
            </p>
          </div>

          {/* Protocol tab buttons */}
          <div className="flex items-center gap-1.5 font-display text-xs">
            <button
              type="button"
              onClick={() => setActiveProtocolTab('immediate')}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                activeProtocolTab === 'immediate'
                  ? 'bg-teal-400 text-neutral-950 border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              Immediate Action Drill
            </button>
            <button
              type="button"
              onClick={() => setActiveProtocolTab('grabbag')}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                activeProtocolTab === 'grabbag'
                  ? 'bg-teal-400 text-neutral-950 border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              Evacuation Grab-Bag
            </button>
            <button
              type="button"
              onClick={() => setActiveProtocolTab('frequencies')}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                activeProtocolTab === 'frequencies'
                  ? 'bg-teal-400 text-neutral-950 border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                  : 'bg-white/[0.04] text-neutral-300 border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              Emergency Frequencies
            </button>
          </div>
        </div>

        {/* Tab 1: Immediate Survival Actions */}
        {activeProtocolTab === 'immediate' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold">
                1
              </div>
              <h4 className="font-display font-bold text-white text-sm">Kill Main Electrical Breakers</h4>
              <p className="text-neutral-300 leading-relaxed">
                Before water enters premises or during tremors, switch off the primary circuit breaker to prevent fatal electrical arc flashovers and electrocution.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-display font-bold">
                2
              </div>
              <h4 className="font-display font-bold text-white text-sm">Secure Safe High Elevation</h4>
              <p className="text-neutral-300 leading-relaxed">
                Move occupants and pets to 2nd floor or designated high ground. Do not enter basements, underground parking lots, or underpass passages.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-display font-bold">
                3
              </div>
              <h4 className="font-display font-bold text-white text-sm">Do Not Wade In Flood Currents</h4>
              <p className="text-neutral-300 leading-relaxed">
                Just 6 inches of fast-moving water can knock an adult off their feet; 12 inches can sweep away small vehicles. Use poles to probe ground ahead.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Grab-Bag Checklist */}
        {activeProtocolTab === 'grabbag' && (
          <div className="space-y-3 font-sans">
            <div className="text-xs text-neutral-400">
              Check off your essential survival kit items below to verify evacuation readiness:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: 'water', label: 'Potable Drinking Water (3L/person) & ORS sachets', desc: 'Sufficient for 72 hours survival' },
                { id: 'documents', label: 'Waterproof Document Pouch', desc: 'Aadhaar, property deed, voter card, emergency cash' },
                { id: 'torch', label: 'High-Lumen Torch & Spare Batteries', desc: 'LED torch or hand-crank dynamo flashlight' },
                { id: 'firstaid', label: 'Sterile First Aid Kit & Prescriptions', desc: 'Bandages, antiseptic solution, chronic medicines' },
                { id: 'powerbank', label: 'Charged 20,000mAh Power Bank', desc: 'Keep phone in Low-Power mode with offline map' },
                { id: 'whistle', label: 'Emergency Rescue Whistle', desc: 'Sound travels 3x further than human shouting' },
              ].map((item) => {
                const checked = checkedItems[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      checked
                        ? 'bg-teal-500/15 border-teal-500/40 text-neutral-100 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
                        : 'bg-[#080C14]/70 border-white/[0.06] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-teal-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-display">{item.label}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Disaster Comms Frequencies */}
        {activeProtocolTab === 'frequencies' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-amber-300">AIR Kolkata FM</span>
                <Radio className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-black text-white font-display">100.1 MHz / 102.8 MHz</div>
              <p className="text-neutral-400 leading-relaxed">
                State disaster alert broadcasts and cyclone track updates broadcast every 15 minutes during code red weather events.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-teal-300">Ham Radio Disaster Net</span>
                <Zap className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-lg font-black text-white font-display">145.500 MHz (2m VHF)</div>
              <p className="text-neutral-400 leading-relaxed">
                West Bengal Radio Club volunteer relay network operating on emergency battery and solar banks when cell towers collapse.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080C14]/80 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sky-300">Cell Broadcast System (CAP)</span>
                <Radio className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-lg font-black text-white font-display">NDMA Cell Broadcast</div>
              <p className="text-neutral-400 leading-relaxed">
                Automated high-priority vibratory alarm broadcasted directly to all GSM handsets without requiring internet or active SIM data.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
