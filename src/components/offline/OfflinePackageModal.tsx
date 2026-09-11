import React, { useState } from 'react';
import { HardDrive, CheckCircle2, RefreshCw, Layers, ShieldCheck, PhoneCall, AlertCircle, Database } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { Modal } from '../common/Modal';
import { offlineService } from '../../services/offlineService';

export const OfflinePackageModal: React.FC = () => {
  const { isOfflineModalOpen, setIsOfflineModalOpen, offlinePackage, refreshOfflinePackage } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    const result = await offlineService.verifyPackageIntegrity(offlinePackage.id);
    setIsVerifying(false);
    setVerifyResult(result.message);
  };

  return (
    <Modal
      isOpen={isOfflineModalOpen}
      onClose={() => setIsOfflineModalOpen(false)}
      title="Offline Safety Package Management"
      subtitle="Local geospatial storage & zero-connectivity resilience bundle"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
        {/* Phase notice banner */}
        <div className="p-3.5 bg-[#080C14]/80 border border-white/[0.08] rounded-xl flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <Database className="w-4 h-4" />
          </div>
          <div className="text-xs text-neutral-400 font-sans">
            <span className="font-bold text-white font-display">Phase 2 Architecture & Vector Store:</span>
            <p className="mt-0.5 leading-relaxed text-neutral-300">
              This panel manages the local offline resilience profile. Vector map geometries, emergency facilities, safe routes, and contact directories are stored locally in IndexedDB memory cache for uninterrupted offline survival.
            </p>
          </div>
        </div>

        {/* Current Package Overview */}
        <div className="p-4 sm:p-5 bg-[#080C14]/80 border border-white/[0.08] rounded-2xl space-y-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Active Regional Package</div>
              <h3 className="text-base font-bold text-white mt-0.5 font-display">{offlinePackage.regionName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-teal-500/15 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> {offlinePackage.status}
              </span>
              <span className="text-xs font-mono text-neutral-300 bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/[0.08]">
                {offlinePackage.sizeMb} MB
              </span>
            </div>
          </div>

          {/* Package capabilities grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-[#0D131F]/80 border border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>MAP VECTOR TILES</span>
              </div>
              <div className="font-bold text-white text-xs font-display">Available (Zoom 1-16)</div>
              <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">Coverage: {offlinePackage.tileCoverageSquareKm} km²</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D131F]/80 border border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>SAFETY LOCATIONS</span>
              </div>
              <div className="font-bold text-white text-xs font-display">Available</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Shelters, Hospitals & Camps</div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D131F]/80 border border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>EMERGENCY PROTOCOLS</span>
              </div>
              <div className="font-bold text-white text-xs font-display">Available</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">SEOC, NDRF, Police hotlines</div>
            </div>
          </div>

          {/* Metadata details */}
          <div className="pt-2 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-400">
            <div>
              <span className="text-neutral-500">Last Synchronized: </span>
              <span className="text-neutral-200">{offlinePackage.lastSynchronized}</span>
            </div>
            <div>
              <span className="text-neutral-500">Integrity Validity: </span>
              <span className="text-neutral-200">{offlinePackage.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Verification feedback */}
        {verifyResult && (
          <div className="p-3.5 bg-teal-950/40 border border-teal-500/40 rounded-xl text-xs text-teal-300 flex items-start gap-2.5 shadow-[0_0_12px_rgba(20,184,166,0.15)]">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span className="font-mono">{verifyResult}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-200 text-xs font-mono rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
            {isVerifying ? 'Verifying Integrity...' : 'Verify Tile Checksums'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOfflineModalOpen(false)}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/[0.08]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={refreshOfflinePackage}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 text-xs font-bold font-mono rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(20,184,166,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Check Updates & Re-Sync
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
