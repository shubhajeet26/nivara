import React from 'react';
import {
  Navigation,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Radio,
} from 'lucide-react';

interface MapControlsProps {
  onLocateMe: () => void;
  onResetSector: () => void;
  onFitBounds: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isWatchingLocation: boolean;
  onToggleWatchLocation: () => void;
  gpsStatus: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onLocateMe,
  onResetSector,
  onFitBounds,
  onZoomIn,
  onZoomOut,
  isFullscreen,
  onToggleFullscreen,
  isWatchingLocation,
  onToggleWatchLocation,
  gpsStatus,
}) => {
  return (
    <div
      id="map-floating-controls"
      className="absolute right-3 bottom-14 sm:bottom-6 z-10 flex flex-col gap-2 pointer-events-auto"
    >
      {/* Locate Me Button */}
      <button
        type="button"
        onClick={onLocateMe}
        className={`p-2.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
          gpsStatus === 'AVAILABLE'
            ? 'bg-[#0B101C]/95 text-sky-400 border-sky-500/40 hover:border-sky-400 hover:shadow-[0_0_16px_rgba(14,165,233,0.3)]'
            : 'bg-[#0B101C]/95 text-neutral-400 border-white/[0.1] hover:text-sky-300 hover:border-white/[0.2]'
        }`}
        title="Center on My Live Device Location"
      >
        <Navigation className="w-4 h-4" />
      </button>

      {/* Toggle Live GPS Tracking */}
      <button
        type="button"
        onClick={onToggleWatchLocation}
        className={`p-2.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${
          isWatchingLocation
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.35)] animate-pulse'
            : 'bg-[#0B101C]/95 text-neutral-400 border-white/[0.1] hover:text-emerald-300 hover:border-emerald-500/40'
        }`}
        title={isWatchingLocation ? 'Live GNSS Tracking Active (Click to Pause)' : 'Start Continuous GNSS Tracking'}
      >
        <Radio className="w-4 h-4" />
      </button>

      {/* Reset to Operational Sector */}
      <button
        type="button"
        onClick={onResetSector}
        className="p-2.5 rounded-2xl bg-[#0B101C]/95 backdrop-blur-xl border border-white/[0.1] text-neutral-300 hover:text-amber-300 hover:border-amber-500/40 hover:shadow-[0_0_14px_rgba(245,158,11,0.2)] transition-all duration-200 shadow-xl flex items-center justify-center cursor-pointer"
        title="Reset to Operational Sector Focus"
      >
        <Compass className="w-4 h-4" />
      </button>

      {/* Fit All Incident Bounds */}
      <button
        type="button"
        onClick={onFitBounds}
        className="p-2.5 rounded-2xl bg-[#0B101C]/95 backdrop-blur-xl border border-white/[0.1] text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 hover:shadow-[0_0_14px_rgba(245,158,11,0.2)] transition-all duration-200 shadow-xl flex items-center justify-center cursor-pointer"
        title="Fit All Active Incidents and Shelters in View"
      >
        <Crosshair className="w-4 h-4" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="p-2.5 rounded-2xl bg-[#0B101C]/95 backdrop-blur-xl border border-white/[0.1] text-neutral-300 hover:text-white hover:border-white/[0.25] transition-all duration-200 shadow-xl flex items-center justify-center cursor-pointer"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Tactical Mode'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Zoom In / Out Group */}
      <div className="flex flex-col bg-[#0B101C]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors border-b border-white/[0.08] flex items-center justify-center cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2.5 text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center justify-center cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
