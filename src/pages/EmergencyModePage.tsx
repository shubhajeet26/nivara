import React from 'react';
import {
  AlertOctagon,
  MapPin,
  Shield,
  Phone,
  ArrowLeft,
  Navigation,
  Wifi,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge } from '../components/common/Badge';
import { emergencyService } from '../services/emergencyService';
import { hazardService } from '../services/hazardService';
import { mapService } from '../services/mapService';

export const EmergencyModePage: React.FC = () => {
  const {
    userLocation,
    gpsStatus,
    connectivity,
    scenarioData,
    setActivePage,
    setSelectedMapItem,
    showToast,
  } = useApp();

  const emergencyContacts = emergencyService.getStaticEmergencyContacts();
  const safePlaces = hazardService.getSafePlaces();
  const nearestPlace = safePlaces[0];

  const handleTriggerBuzzer = () => {
    emergencyService.triggerLocalSignal();
    showToast('Local emergency screen beacon & device vibration pulse triggered.');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full select-none">
      {/* Top Exit Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
        <button
          type="button"
          onClick={() => setActivePage('overview')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Emergency Mode</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            EMERGENCY PROTOCOL
          </span>
        </div>
      </div>

      {/* 1. CURRENT SAFETY STATUS (Large, unambiguous) */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#160B12]/80 backdrop-blur-xl border border-rose-500/40 space-y-3.5 shadow-[0_12px_36px_rgba(244,63,94,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <Badge level={scenarioData.overallRisk} size="lg" />
            <span className="text-xs font-mono uppercase text-neutral-400 font-bold">STATUS</span>
          </div>
          <button
            type="button"
            onClick={handleTriggerBuzzer}
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono text-neutral-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Signal Beacon</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display relative z-10">
          {scenarioData.overallRisk === 'SAFE'
            ? 'NO IMMEDIATE THREAT DETECTED'
            : `${scenarioData.badge}: EVACUATION ADVISORY`}
        </h1>

        <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans font-medium relative z-10">
          {scenarioData.safetyRecommendation}
        </p>
      </section>

      {/* 2. CURRENT LOCATION & HARDWARE HEALTH */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
        <div className="text-xs font-mono uppercase text-neutral-300 font-bold tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 rounded-full bg-teal-400" />
          <span>Your Current Position</span>
        </div>
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold text-white font-display">{userLocation.placeName}</div>
            <div className="text-xs font-mono text-neutral-400">
              Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.08] text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080C14]/70 border border-white/[0.07] flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-teal-400" />
            <div>
              <span className="text-neutral-500 block text-[10px] font-semibold">GPS HARDWARE</span>
              <span className="text-white font-semibold">{gpsStatus}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#080C14]/70 border border-white/[0.07] flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-neutral-500 block text-[10px] font-semibold">INTERNET DATA</span>
              <span className="text-white font-semibold">{connectivity}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEAREST SAFE PLACE */}
      <section className="p-5 sm:p-6 rounded-2xl bg-[#0B1516]/85 backdrop-blur-xl border border-teal-500/40 space-y-4 shadow-[0_12px_36px_rgba(20,184,166,0.12)]">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase text-teal-300 font-bold tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>Designated Safe Refuge</span>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/15 px-2.5 py-1 rounded-lg border border-teal-500/30 font-bold shadow-[0_0_10px_rgba(20,184,166,0.2)]">
            {mapService.formatDistance(
              mapService.calculateDistanceKm(
                userLocation.lat,
                userLocation.lng,
                nearestPlace.location.lat,
                nearestPlace.location.lng
              )
            )}{' '}
            Distance
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">{nearestPlace.name}</h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-sans">{nearestPlace.location.address}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setSelectedMapItem(nearestPlace);
              setActivePage('map');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 active:scale-98 text-neutral-950 font-bold text-xs font-mono tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            <Navigation className="w-4 h-4" />
            <span>Navigate to Shelter (Map)</span>
          </button>

          {nearestPlace.contactPhone && (
            <a
              href={`tel:${nearestPlace.contactPhone}`}
              className="py-3 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-98 text-white font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-white/[0.08]"
            >
              <Phone className="w-4 h-4 text-teal-300" />
              <span>Call Facility</span>
            </a>
          )}
        </div>
      </section>

      {/* 4. EMERGENCY VOICE CONTACTS (Available offline on any cell tower) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-rose-400" />
            <span>Direct Emergency Telephony (Always Dialable)</span>
          </div>
          <span className="text-[11px] font-mono text-teal-300 font-bold">Offline Cellular Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.phone}`}
              className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/75 backdrop-blur-xl border border-white/[0.08] hover:border-rose-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-all duration-200 flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-white font-display group-hover:text-rose-200 transition-colors">{contact.name}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{contact.role}</div>
              </div>
              <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-sm bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/25 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 transition-all shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>{contact.phone}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. DATA HONESTY SOS DISCLAIMER (Explicit Requirement) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/70 backdrop-blur-xl border border-white/[0.08] text-xs text-neutral-400 space-y-1.5 shadow-md">
        <div className="font-bold text-neutral-200 font-display">
          Emergency Authority Communication Architecture:
        </div>
        <p className="leading-relaxed text-[11px] font-sans text-neutral-400">
          {emergencyService.getDisclaimer()} Direct emergency voice calls (112 / 1078) above connect immediately via your mobile network hardware without requiring internet data.
        </p>
      </section>
    </div>
  );
};
