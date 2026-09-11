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
        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-xl transition-all flex items-center justify-center cursor-pointer ${
          gpsStatus === 'AVAILABLE'
            ? 'bg-neutral-900/90 text-sky-400 border-neutral-700/80 hover:bg-sky-950/40 hover:border-sky-500'
            : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:text-sky-300'
        }`}
        title="Center on My Live Device Location"
      >
        <Navigation className="w-4 h-4" />
      </button>

      {/* Toggle Live GPS Tracking */}
      <button
        type="button"
        onClick={onToggleWatchLocation}
        className={`p-2.5 rounded-xl border backdrop-blur-md shadow-xl transition-all flex items-center justify-center cursor-pointer ${
          isWatchingLocation
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600 animate-pulse'
            : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:text-emerald-300 hover:bg-neutral-800'
        }`}
        title={isWatchingLocation ? 'Live GNSS Tracking Active (Click to Pause)' : 'Start Continuous GNSS Tracking'}
      >
        <Radio className="w-4 h-4" />
      </button>

      {/* Reset to Operational Sector */}
      <button
        type="button"
        onClick={onResetSector}
        className="p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center cursor-pointer"
        title="Reset to Operational Sector Focus"
      >
        <Compass className="w-4 h-4" />
      </button>

      {/* Fit All Incident Bounds */}
      <button
        type="button"
        onClick={onFitBounds}
        className="p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center cursor-pointer"
        title="Fit All Active Incidents and Shelters in View"
      >
        <Crosshair className="w-4 h-4" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center cursor-pointer"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Tactical Mode'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      {/* Zoom In / Out Group */}
      <div className="flex flex-col bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border-b border-neutral-800 flex items-center justify-center cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
