import React, { useState } from 'react';
import { Navigation, Shield, WifiOff, MapPin, AlertCircle, Compass } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { Modal } from './Modal';
import { OPERATIONAL_SECTORS } from '../../services/mapService';

export const LocationPermissionModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    gpsStatus,
    requestGpsPermission,
    userLocation,
    setUserManualLocation,
    connectivity,
    activeSector,
    setActiveSector,
    triggerFlyTo,
    showToast,
  } = useApp();

  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');

  const handleApplyCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      showToast('Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }
    setUserManualLocation(lat, lng, `Manual Reference (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
    setIsLocationModalOpen(false);
  };

  const handleSelectSector = (sector: typeof OPERATIONAL_SECTORS[0]) => {
    setActiveSector(sector);
    setUserManualLocation(sector.center[0], sector.center[1], `${sector.name} HQ`);
    triggerFlyTo(sector.center[0], sector.center[1], sector.zoom);
    setIsLocationModalOpen(false);
  };

  return (
    <Modal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title="Location & GPS Diagnostics"
      subtitle="Privacy-first spatial positioning for disaster situational awareness"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
        <div className="p-4 bg-[#080C14]/80 border border-white/[0.08] rounded-xl flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white font-display">Why Nivara requests device location</h4>
            <p className="text-neutral-400 text-xs leading-relaxed font-sans">
              During an environmental emergency, real-time device coordinates enable Nivara to calculate your distance to active hazards, compute the nearest verified relief shelters, and flag blocked access corridors in your immediate proximity.
            </p>
          </div>
        </div>

        {/* Technical distinction card: GPS vs Internet */}
        <div className="p-4 bg-[#080C14]/80 border border-white/[0.08] rounded-xl space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-display">Hardware Independence:</span>
            <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-semibold">Civilian Safety Architecture</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed font-sans">
            Nivara separates GPS hardware from cellular internet:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-3 rounded-xl bg-[#0D131F]/80 border border-white/[0.08] flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-teal-400" />
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold">HARDWARE GPS</div>
                <div className="text-neutral-200 font-bold">{gpsStatus}</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D131F]/80 border border-white/[0.08] flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold">DATA NETWORK</div>
                <div className="text-neutral-200 font-bold">{connectivity}</div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1 leading-relaxed">
            * Even when internet connectivity is completely lost, your phone's built-in GNSS/GPS chip can continue locating you atop cached offline vector map packages.
          </p>
        </div>

        {/* Current Coordinates Status */}
        <div className="p-3.5 bg-[#080C14]/80 border border-white/[0.08] rounded-xl space-y-1 text-xs">
          <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px] uppercase font-semibold">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Active Operational Reference:</span>
          </div>
          <div className="font-mono text-neutral-100 text-xs pl-5 font-bold">
            {userLocation.placeName} ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
          </div>
          <div className="text-[11px] text-neutral-500 pl-5 font-mono">
            Source: <span className="uppercase text-neutral-300 font-semibold">{userLocation.source}</span>
            {userLocation.accuracyMeters ? ` • Accuracy: ±${userLocation.accuracyMeters}m` : ''}
          </div>
        </div>

        {/* Operational Sector Reference Presets */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Operational Sector Reference Points:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {OPERATIONAL_SECTORS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectSector(sec)}
                className={`p-2.5 rounded-xl border text-[11px] font-mono text-left transition-all cursor-pointer ${
                  activeSector.id === sec.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'bg-[#0D131F]/80 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.18]'
                }`}
              >
                <div className="font-bold truncate text-white">{sec.name.split(' ')[0]}</div>
                <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                  {sec.center[0].toFixed(2)}, {sec.center[1].toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Coordinates Option */}
        <form onSubmit={handleApplyCustomCoords} className="p-3.5 bg-[#080C14]/80 border border-white/[0.08] rounded-xl space-y-2.5">
          <div className="text-[11px] font-mono text-neutral-400 uppercase font-semibold">
            Custom GPS Coordinates Input:
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Latitude (e.g. 22.5726)"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              className="w-1/2 bg-[#0D131F]/90 border border-white/[0.1] text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
            />
            <input
              type="text"
              placeholder="Longitude (e.g. 88.3639)"
              value={customLng}
              onChange={(e) => setCustomLng(e.target.value)}
              className="w-1/2 bg-[#0D131F]/90 border border-white/[0.1] text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 text-xs font-mono rounded-xl transition-all cursor-pointer border border-white/[0.08]"
          >
            Apply Manual Reference Coordinates
          </button>
        </form>

        {gpsStatus === 'DENIED' && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Permission was denied in your browser settings.</span>
              <p className="text-rose-300/80 mt-0.5 text-[11px] leading-relaxed">
                To use live GPS, allow location permissions in your browser's site settings icon in the URL address bar. Nivara will continue using the active sector reference coordinates in the meantime.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/[0.08]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={async () => {
              await requestGpsPermission();
              setIsLocationModalOpen(false);
            }}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(20,184,166,0.3)] active:scale-98"
          >
            <Navigation className="w-3.5 h-3.5" />
            {gpsStatus === 'AVAILABLE' ? 'Refresh GPS Hardware Lock' : 'Request Real GPS Lock'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

