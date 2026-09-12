import React from 'react';
import {
  X,
  MapPin,
  Compass,
  Phone,
  Shield,
  HeartPulse,
  Home,
  AlertTriangle,
  Slash,
  Copy,
  ExternalLink,
  Check,
  Radio,
} from 'lucide-react';
import { MapInspectionItem, UserLocation } from '../../types';
import { mapService } from '../../services/mapService';

interface MapInspectorProps {
  item: MapInspectionItem | null;
  userLocation: UserLocation;
  onClose: () => void;
  onFocus: (lat: number, lng: number) => void;
  onToast: (msg: string) => void;
}

export const MapInspector: React.FC<MapInspectorProps> = ({
  item,
  userLocation,
  onClose,
  onFocus,
  onToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  // Determine item type
  const isHazard = 'severity' in item && 'affectedRadiusMeters' in item;
  const isBlockedRoad = 'roadName' in item && 'reason' in item;
  const isSafePlace = 'category' in item && 'suppliesAvailable' in item;

  // Calculate target coordinate for distance & bearing
  let targetLat = 0;
  let targetLng = 0;
  let addressString = '';

  if (isHazard) {
    targetLat = item.location.lat;
    targetLng = item.location.lng;
    addressString = item.location.address;
  } else if (isSafePlace) {
    targetLat = item.location.lat;
    targetLng = item.location.lng;
    addressString = item.location.address;
  } else if (isBlockedRoad) {
    targetLat = item.coordinates[0][0];
    targetLng = item.coordinates[0][1];
    addressString = item.roadName;
  }

  const distanceKm = mapService.calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    targetLat,
    targetLng
  );
  const formattedDistance = mapService.formatDistance(distanceKm);
  const bearing = mapService.calculateBearing(
    userLocation.lat,
    userLocation.lng,
    targetLat,
    targetLng
  );

  const handleCopyCoords = () => {
    const text = `${targetLat.toFixed(5)}, ${targetLng.toFixed(5)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onToast(`Coordinates copied: ${text}`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="tactical-map-inspector"
      className="absolute left-3 right-3 sm:left-auto sm:right-3 bottom-14 sm:bottom-6 sm:w-96 bg-[#0B101C]/98 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 sm:p-5 z-20 text-xs animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 border border-white/[0.1]">
              {isHazard
                ? 'HAZARD INCIDENT'
                : isSafePlace
                ? 'CIVIL RESILIENCE HUB'
                : 'CORRIDOR CLOSURE'}
            </span>
            <span className="text-[10px] font-display text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/25 font-bold tracking-wider">
              OPS RECORD
            </span>
          </div>

          <h3 className="text-base font-display font-bold text-white leading-snug">
            {isHazard ? item.title : isSafePlace ? item.name : item.roadName}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Body Content */}
      <div className="py-3 space-y-3">
        {/* Relative Distance & Bearing Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-[#080C14]/80 border border-white/[0.08] rounded-xl p-2.5">
          <div className="flex items-center gap-2 font-display">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Proximity</div>
              <div className="text-xs font-bold text-sky-300">{formattedDistance}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-display">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Vector Bearing</div>
              <div className="text-xs font-bold text-amber-300">{bearing.formatted}</div>
            </div>
          </div>
        </div>

        {/* Hazard Specific Details */}
        {isHazard && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-display">
              <span
                className={`px-2.5 py-0.5 rounded-full uppercase font-bold border ${
                  item.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                    : item.severity === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                }`}
              >
                Severity: {item.severity}
              </span>
              <span className="text-neutral-400 font-medium">
                Perimeter: {item.affectedRadiusMeters}m
              </span>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed bg-[#080C14]/60 p-3 rounded-xl border border-white/[0.06] font-sans">
              {item.description}
            </p>

            <div className="flex items-center justify-between text-[11px] font-display text-neutral-400 pt-1">
              <span>Reported: {item.reportedAt}</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Radio className="w-3 h-3 animate-pulse" /> Field Verified
              </span>
            </div>
          </div>
        )}

        {/* Safe Place Details */}
        {isSafePlace && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-display">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {item.category === 'hospital' ? (
                  <HeartPulse className="w-3 h-3 text-sky-400" />
                ) : item.category === 'relief_camp' ? (
                  <Home className="w-3 h-3 text-purple-400" />
                ) : (
                  <Shield className="w-3 h-3 text-emerald-400" />
                )}
                {item.category.replace('_', ' ')}
              </span>
              <span className="text-neutral-400 font-medium">
                {item.open24x7 ? 'Open 24/7 Access' : 'Standard Operating'}
              </span>
            </div>

            {/* Capacity Meter */}
            {item.capacity && (
              <div className="space-y-1.5 bg-[#080C14]/60 p-2.5 rounded-xl border border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] font-display">
                  <span className="text-neutral-400 font-medium">Shelter Occupancy:</span>
                  <span className="text-white font-bold">
                    {item.capacity.current} / {item.capacity.max}
                  </span>
                </div>
                <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.capacity.current / item.capacity.max > 0.8
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : item.capacity.current / item.capacity.max > 0.5
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (item.capacity.current / item.capacity.max) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Available relief supplies */}
            {item.suppliesAvailable.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-bold">
                  Relief Supplies & Resources:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.suppliesAvailable.map((sup, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-neutral-200 text-[10px] font-display font-medium border border-white/[0.1]"
                    >
                      {sup}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Phone */}
            {item.contactPhone && (
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`tel:${item.contactPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 text-xs font-display font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.contactPhone}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Blocked Road Details */}
        {isBlockedRoad && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-display">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                <Slash className="w-3 h-3 text-rose-400" />
                CORRIDOR IMPASSABLE
              </span>
              <span className="text-neutral-400">Status: Enforced</span>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed bg-[#080C14]/60 p-3 rounded-xl border border-white/[0.06] font-sans">
              {item.reason}
            </p>
          </div>
        )}

        {/* Address & Coordinates */}
        <div className="text-[11px] font-display text-neutral-400 pt-2 flex items-center justify-between border-t border-white/[0.08]">
          <span className="truncate max-w-[200px]" title={addressString}>
            {addressString}
          </span>
          <button
            type="button"
            onClick={handleCopyCoords}
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Coordinates"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : `${targetLat.toFixed(3)}, ${targetLng.toFixed(3)}`}</span>
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 font-display">
        <button
          type="button"
          onClick={() => onFocus(targetLat, targetLng)}
          className="px-3.5 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs rounded-full border border-white/[0.1] transition-all flex items-center gap-1.5 cursor-pointer hover:border-sky-500/40"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Center on Map</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToast('Turn-by-turn routing is planned for Phase 5. Vector bearing is active.');
          }}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.15)]"
        >
          Route Guide (Phase 5)
        </button>
      </div>
    </div>
  );
};
