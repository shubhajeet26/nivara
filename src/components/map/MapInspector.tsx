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
      className="absolute left-3 right-3 sm:left-auto sm:right-3 bottom-14 sm:bottom-6 sm:w-96 bg-neutral-900/98 backdrop-blur-xl border border-neutral-700/80 rounded-2xl shadow-2xl p-4 sm:p-5 z-20 text-xs animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
              {isHazard
                ? 'HAZARD INCIDENT'
                : isSafePlace
                ? 'CIVIL RESILIENCE HUB'
                : 'CORRIDOR CLOSURE'}
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              [DEMO DATA]
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-snug">
            {isHazard ? item.title : isSafePlace ? item.name : item.roadName}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Body Content */}
      <div className="py-3 space-y-3">
        {/* Relative Distance & Bearing Metrics */}
        <div className="grid grid-cols-2 gap-2 bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-2 font-mono">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Proximity</div>
              <div className="text-xs font-bold text-sky-300">{formattedDistance}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">Vector Bearing</div>
              <div className="text-xs font-bold text-amber-300">{bearing.formatted}</div>
            </div>
          </div>
        </div>

        {/* Hazard Specific Details */}
        {isHazard && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span
                className={`px-2 py-0.5 rounded uppercase font-bold border ${
                  item.severity === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : item.severity === 'WARNING'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-yellow-950 text-yellow-300 border-yellow-800'
                }`}
              >
                Severity: {item.severity}
              </span>
              <span className="text-neutral-400">
                Perimeter: {item.affectedRadiusMeters}m
              </span>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-800/50">
              {item.description}
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
              <span>Reported: {item.reportedAt}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3" /> Field Verified
              </span>
            </div>
          </div>
        )}

        {/* Safe Place Details */}
        {isSafePlace && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold flex items-center gap-1.5">
                {item.category === 'hospital' ? (
                  <HeartPulse className="w-3 h-3 text-sky-400" />
                ) : item.category === 'relief_camp' ? (
                  <Home className="w-3 h-3 text-purple-400" />
                ) : (
                  <Shield className="w-3 h-3 text-emerald-400" />
                )}
                {item.category.replace('_', ' ')}
              </span>
              <span className="text-neutral-400">
                {item.open24x7 ? 'Open 24/7 Access' : 'Standard Operating'}
              </span>
            </div>

            {/* Capacity Meter */}
            {item.capacity && (
              <div className="space-y-1 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400">Shelter Occupancy:</span>
                  <span className="text-white font-semibold">
                    {item.capacity.current} / {item.capacity.max}
                  </span>
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.capacity.current / item.capacity.max > 0.8
                        ? 'bg-rose-500'
                        : item.capacity.current / item.capacity.max > 0.5
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
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
                <div className="text-[10px] font-mono uppercase text-neutral-400">
                  Relief Supplies & Resources:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.suppliesAvailable.map((sup, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-200 text-[10px] font-mono border border-neutral-800"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 text-xs font-mono transition-colors"
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
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase font-bold flex items-center gap-1">
                <Slash className="w-3 h-3 text-rose-400" />
                CORRIDOR IMPASSABLE
              </span>
              <span className="text-neutral-400">Status: Enforced</span>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-800/50">
              {item.reason}
            </p>
          </div>
        )}

        {/* Address & Coordinates */}
        <div className="text-[11px] font-mono text-neutral-400 pt-1 flex items-center justify-between border-t border-neutral-800/80">
          <span className="truncate max-w-[200px]" title={addressString}>
            {addressString}
          </span>
          <button
            type="button"
            onClick={handleCopyCoords}
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
            title="Copy Coordinates"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : `${targetLat.toFixed(3)}, ${targetLng.toFixed(3)}`}</span>
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onFocus(targetLat, targetLng)}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Center on Map</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToast('Turn-by-turn routing is planned for Phase 5. Vector bearing is active.');
          }}
          className="px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-800 font-mono text-xs rounded-lg transition-colors cursor-pointer"
        >
          Route Guide (Phase 5)
        </button>
      </div>
    </div>
  );
};
