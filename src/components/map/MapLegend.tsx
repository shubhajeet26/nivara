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
      className="absolute left-3 bottom-14 sm:bottom-6 z-10 font-display text-xs pointer-events-auto"
    >
      <div className="bg-[#0B101C]/95 backdrop-blur-xl border border-white/[0.1] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-200">
        {/* Toggle Button / Bar */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between gap-3 px-3.5 py-2 w-full text-left text-neutral-300 hover:text-white cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-neutral-300 tracking-wider">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-400">
              <Info className="w-3 h-3" />
            </div>
            <span>Tactical Legend</span>
          </div>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />}
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-3.5 pt-1.5 border-t border-white/[0.08] space-y-2 text-[11px] text-neutral-300 font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span>Your Location (GNSS)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-md bg-rose-500 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
              <span>Critical Hazard Zone</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-md bg-amber-500 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              <span>Warning / Precaution Zone</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-md bg-teal-500 shrink-0 shadow-[0_0_6px_rgba(20,184,166,0.5)]" />
              <span>Safe Shelter (Designated)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-md bg-sky-500 shrink-0 shadow-[0_0_6px_rgba(14,165,233,0.5)]" />
              <span>Hospital & Emergency Care</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-md bg-purple-500 shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
              <span>Relief & Staging Camp</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 border-t-2 border-dashed border-rose-500 shrink-0 shadow-[0_0_4px_rgba(244,63,94,0.6)]" />
              <span>Impassable / Blocked Corridor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
