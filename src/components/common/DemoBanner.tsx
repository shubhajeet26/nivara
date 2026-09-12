import React from 'react';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { Modal } from './Modal';
import { SCENARIO_DEFINITIONS } from '../../data/demoScenarios';
import { ScenarioId } from '../../types';

export const DemoBanner: React.FC = () => {
  const {
    activeScenario,
    scenarioData,
    setScenario,
    isScenarioModalOpen,
    setIsScenarioModalOpen,
    connectivity,
    toggleConnectivityMode,
  } = useApp();

  return (
    <>
      <div className="w-full bg-[#120F09]/90 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-4 py-1.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-2 z-30 relative shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
        {/* Subtle animated amber gradient accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 font-display font-black bg-gradient-to-r from-amber-500/25 to-amber-600/15 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-[11px] tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
            </span>
            SIMULATION
          </span>
          <span className="text-neutral-400 font-sans text-xs hidden md:inline">
            Active Operations Grid:
          </span>
          <span className="font-display font-bold text-amber-200 text-xs sm:text-sm flex items-center gap-1.5 tracking-tight">
            {scenarioData.name}
            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {scenarioData.badge}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick simulation toggles for presentation demos */}
          <button
            type="button"
            onClick={toggleConnectivityMode}
            className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-xs font-display text-neutral-300 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Toggle between Online, Limited, and Offline states"
          >
            <span className="text-neutral-400 font-sans text-[11px]">Net:</span>
            <span className="text-white font-bold">{connectivity}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 hover:border-amber-500/60 text-amber-300 font-display font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.18)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Scenario</span>
          </button>
        </div>
      </div>

      {/* Scenario Selection Modal */}
      <Modal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        title="Disaster Simulation Scenario Selector"
        subtitle="Mission Demonstration Engine: Select an active emergency profile to simulate localized hazards, corridor blockages, and safety advice."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-[#090D15]/80 border border-white/[0.08] rounded-xl text-xs text-neutral-400">
            <p className="font-semibold text-neutral-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Operational Data Integrity Disclaimer:
            </p>
            Nivara strictly separates live GNSS telemetry from simulated emergency drills. All hazards, road closures, and shelter occupancies in these scenarios are curated disaster profiles to validate system responsiveness.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(SCENARIO_DEFINITIONS) as ScenarioId[]).map((scId) => {
              const sc = SCENARIO_DEFINITIONS[scId];
              const isSelected = activeScenario === scId;
              return (
                <button
                  key={scId}
                  type="button"
                  onClick={() => {
                    setScenario(scId);
                    setIsScenarioModalOpen(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-amber-500/80 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/50'
                      : 'border-white/[0.08] bg-[#0E1524]/60 hover:border-white/[0.18] hover:bg-[#131C2E]/80 shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-neutral-100 font-display group-hover:text-white">
                        {sc.name}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
                          <CheckCircle2 className="w-3 h-3 text-amber-400" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                          {sc.overallRisk}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{sc.riskSummary}</p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="text-rose-400/90">{sc.hazardCount} Hazards</span>
                    <span className="text-amber-400/90">{sc.blockedRoadCount} Blocked</span>
                    <span className="text-teal-400/90">{sc.nearbySheltersCount} Safe Hubs</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsScenarioModalOpen(false)}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-neutral-200 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
