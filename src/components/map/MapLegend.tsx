import React, { useState } from 'react';
import {
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Shield,
  HeartPulse,
  Home,
  Slash,
  Navigation,
} from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="tactical-map-legend"
      className="absolute left-3 bottom-14 sm:bottom-6 z-10 font-mono text-[11px] pointer-events-auto"
    >
      <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200">
        {/* Toggle Button / Bar */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between gap-2 px-3 py-1.5 w-full text-left text-neutral-300 hover:text-white cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-neutral-400">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Map Legend</span>
          </div>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-3 pt-1 border-t border-neutral-800 space-y-1.5 text-[10px] text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white shrink-0 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              <span>Your Location (GNSS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" />
              <span>Critical Hazard Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
              <span>Warning / Precaution Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" />
              <span>Safe Shelter (Designated)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-sky-500 shrink-0" />
              <span>Hospital & Emergency Care</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-purple-500 shrink-0" />
              <span>Relief & Staging Camp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 border-t-2 border-dashed border-rose-500 shrink-0" />
              <span>Impassable / Blocked Corridor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
