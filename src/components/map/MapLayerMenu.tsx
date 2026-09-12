import React from 'react';
import {
  Layers,
  X,
  AlertTriangle,
  Shield,
  HeartPulse,
  Slash,
  Home,
  Crosshair,
  Map as MapIcon,
  Globe,
} from 'lucide-react';
import { MapLayerId, MapTileStyle, OperationalSector } from '../../types';
import { mapService } from '../../services/mapService';

interface MapLayerMenuProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  activeLayers: Record<MapLayerId, boolean>;
  onToggleLayer: (id: MapLayerId) => void;
  tileStyle: MapTileStyle;
  onChangeTileStyle: (style: MapTileStyle) => void;
  sectors: OperationalSector[];
  activeSector: OperationalSector;
  onSelectSector: (sector: OperationalSector) => void;
  counts: {
    hazards: number;
    shelters: number;
    hospitals: number;
    blockedRoads: number;
    reliefCamps: number;
  };
}

export const MapLayerMenu: React.FC<MapLayerMenuProps> = ({
  isOpen,
  onToggleOpen,
  activeLayers,
  onToggleLayer,
  tileStyle,
  onChangeTileStyle,
  sectors,
  activeSector,
  onSelectSector,
  counts,
}) => {
  const tileStyles = mapService.getTileStyles();

  return (
    <div className="relative">
      {/* Main Layer Trigger Button */}
      <button
        type="button"
        id="map-layer-menu-btn"
        onClick={onToggleOpen}
        className={`px-3.5 py-2 rounded-full border text-xs font-display font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
          isOpen
            ? 'bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-[0_0_16px_rgba(245,158,11,0.4)]'
            : 'bg-[#0B101C]/90 backdrop-blur-xl text-neutral-200 border-white/[0.1] hover:bg-white/[0.08] hover:text-white hover:border-amber-500/40'
        }`}
        title="Toggle Map Layers & Operational Grid"
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Layers & Grid</span>
      </button>

      {/* Layer Dropdown Panel */}
      {isOpen && (
        <div
          id="map-layer-dropdown-panel"
          className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#0B101C]/98 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-4 z-30 space-y-3.5 text-xs animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="font-display text-xs uppercase tracking-wider text-neutral-300 font-bold border-b border-white/[0.08] pb-2.5 flex items-center justify-between">
            <span>Tactical Map Configuration</span>
            <button
              type="button"
              onClick={onToggleOpen}
              className="text-neutral-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Base Map Tile Styles */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-bold">
              Base Map Style
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(tileStyles) as MapTileStyle[]).map((key) => {
                const active = tileStyle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChangeTileStyle(key)}
                    className={`px-2 py-1.5 rounded-xl border text-[11px] font-display font-semibold text-center transition-all cursor-pointer truncate ${
                      active
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-neutral-950/80 border-white/[0.08] text-neutral-400 hover:text-white hover:border-white/[0.2]'
                    }`}
                  >
                    {key === 'tactical_dark' ? 'Dark Ops' : key === 'standard_osm' ? 'Streets' : 'Satellite'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Tactical Feature Layers */}
          <div className="space-y-1.5 border-t border-white/[0.08] pt-2.5">
            <div className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-bold">
              Incident & Resource Layers
            </div>

            <div className="space-y-1">
              {/* Hazards */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-rose-300 font-display font-semibold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  Active Hazards ({counts.hazards})
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.hazards}
                  onChange={() => onToggleLayer('hazards')}
                  className="accent-rose-500 cursor-pointer"
                />
              </label>

              {/* Safe Shelters */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-teal-300 font-display font-semibold text-xs">
                  <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  Shelters ({counts.shelters})
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.shelters}
                  onChange={() => onToggleLayer('shelters')}
                  className="accent-teal-500 cursor-pointer"
                />
              </label>

              {/* Hospitals */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-sky-300 font-display font-semibold text-xs">
                  <HeartPulse className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Hospitals & ER ({counts.hospitals})
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.hospitals}
                  onChange={() => onToggleLayer('hospitals')}
                  className="accent-sky-500 cursor-pointer"
                />
              </label>

              {/* Blocked Corridors */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-amber-300 font-display font-semibold text-xs">
                  <Slash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Blocked Roads ({counts.blockedRoads})
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.blocked_roads}
                  onChange={() => onToggleLayer('blocked_roads')}
                  className="accent-amber-500 cursor-pointer"
                />
              </label>

              {/* Relief Camps */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-purple-300 font-display font-semibold text-xs">
                  <Home className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  Relief Camps ({counts.reliefCamps})
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.relief_camps}
                  onChange={() => onToggleLayer('relief_camps')}
                  className="accent-purple-500 cursor-pointer"
                />
              </label>

              {/* GNSS Uncertainty Ring */}
              <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                <span className="flex items-center gap-2 text-sky-200 font-display font-semibold text-xs">
                  <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  GNSS Accuracy Radius
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.accuracy_ring}
                  onChange={() => onToggleLayer('accuracy_ring')}
                  className="accent-sky-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 3. Operational Sector Focus */}
          <div className="space-y-1.5 border-t border-white/[0.08] pt-2.5">
            <div className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-bold">
              Operational Sector Grid
            </div>
            <select
              value={activeSector.id}
              onChange={(e) => {
                const found = sectors.find((s) => s.id === e.target.value);
                if (found) onSelectSector(found);
              }}
              className="w-full bg-[#080C14] border border-white/[0.1] text-neutral-200 rounded-xl p-2 text-xs font-display focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {sectors.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} {sec.isSimulatedDemo ? '(Demo Grid)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
