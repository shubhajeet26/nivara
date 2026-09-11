import React, { useState } from 'react';
import {
  FileText,
  Plus,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle2,
  Shield,
  Info,
  Radio,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { HazardType, RiskLevel } from '../types';

export const ReportsPage: React.FC = () => {
  const { reports, submitNewReport, userLocation, showToast } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [reportType, setReportType] = useState<HazardType>('flooded_road');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [severity, setSeverity] = useState<RiskLevel>('WARNING');
  const [locationAddress, setLocationAddress] = useState(userLocation.placeName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDescription.trim()) {
      showToast('Please provide a report title and description.');
      return;
    }

    setIsSubmitting(true);
    await submitNewReport({
      type: reportType,
      title: reportTitle.trim(),
      description: reportDescription.trim(),
      severity,
      lat: userLocation.lat,
      lng: userLocation.lng,
      locationDescription: locationAddress || 'Current User Coordinates',
    });

    setIsSubmitting(false);
    setIsSubmitModalOpen(false);
    setReportTitle('');
    setReportDescription('');
  };

  const hazardTypeOptions: { value: HazardType; label: string }[] = [
    { value: 'flooded_road', label: 'Flooded Road' },
    { value: 'blocked_road', label: 'Blocked Road / Debris' },
    { value: 'fallen_tree', label: 'Fallen Tree / Powerline' },
    { value: 'landslide', label: 'Landslide / Soil Slip' },
    { value: 'damaged_bridge', label: 'Damaged Bridge / Flyover' },
    { value: 'fire', label: 'Active Fire / Smoke' },
    { value: 'unsafe_area', label: 'Unsafe Area / Cordon' },
    { value: 'other', label: 'Shelter / Missing Person / Other' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 rounded-full bg-amber-400 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
              Community Hazard Intelligence
            </h1>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-amber-300 border border-amber-500/30">
              FIELD FEED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 pl-4 font-sans">
            Crowdsourced ground hazard reports, street obstructions, and field civilian alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-[0_0_18px_rgba(245,158,11,0.3)] active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Report Hazard</span>
        </button>
      </div>

      {/* Phase 1 Data Honesty Banner */}
      <div className="p-4 sm:p-5 bg-[#0D131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-start gap-3.5 text-xs shadow-md">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-neutral-300">
          <span className="font-bold text-white font-display">
            Phase 1 Hazard Reporting Protocol Foundation:
          </span>
          <p className="text-neutral-400 leading-relaxed font-sans">
            Reports submitted here are stored in your active client-side session and plotted onto your local tactical map for demonstration. Live authority triage, automated deduplication, and peer-to-peer mesh synchronization are scheduled for Phase 9.
          </p>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-amber-400" />
            <span>Field Reports Log ({reports.length})</span>
          </div>
          <span className="text-[11px] text-neutral-500 normal-case font-mono">Sorted by newest telemetry</span>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0D131F]/75 backdrop-blur-xl border border-white/[0.08] space-y-3 hover:border-amber-500/35 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-all duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge level={rep.severity} size="sm" />
                  <span className="font-mono text-[11px] text-neutral-400 uppercase bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                    [{rep.type.replace('_', ' ')}]
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {rep.isDemo && (
                    <span className="text-[9px] text-amber-300 border border-amber-500/30 bg-amber-500/10 px-1 rounded ml-1">
                      DEMO
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-white font-display">{rep.title}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">{rep.description}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/[0.08] text-[11px] font-mono text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{rep.locationDescription}</span>
                </div>
                <div className="text-neutral-500">
                  Reporter: <span className="text-neutral-300 font-semibold">{rep.reportedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal Dialog */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Log Ground Hazard Report"
        subtitle="Contribute situational intelligence to the local tactical resilience network"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Hazard Type */}
          <div className="space-y-1.5">
            <label className="font-mono uppercase text-neutral-300 font-semibold tracking-wider">
              Hazard Category *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as HazardType)}
              className="w-full bg-[#080C14]/90 border border-white/[0.1] rounded-xl p-3 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all cursor-pointer"
            >
              {hazardTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="font-mono uppercase text-neutral-300 font-semibold tracking-wider">
              Assessed Threat Severity *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['SAFE', 'CAUTION', 'WARNING', 'CRITICAL'] as RiskLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`p-2.5 rounded-xl font-mono text-[11px] border transition-all cursor-pointer ${
                    severity === lvl
                      ? 'border-amber-500/80 bg-amber-500/20 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'border-white/[0.08] bg-[#080C14]/80 text-neutral-400 hover:text-white hover:border-white/[0.16]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-mono uppercase text-neutral-300 font-semibold tracking-wider">
              Headline / Summary *
            </label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Waterlogging 3ft deep on Southern Avenue"
              className="w-full bg-[#080C14]/90 border border-white/[0.1] rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-mono uppercase text-neutral-300 font-semibold tracking-wider">
              Detailed Field Description *
            </label>
            <textarea
              rows={3}
              required
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Provide exact landmarks, impassable vehicle types, live wires, or trapped civilians..."
              className="w-full bg-[#080C14]/90 border border-white/[0.1] rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>

          {/* Location details */}
          <div className="space-y-1.5">
            <label className="font-mono uppercase text-neutral-300 font-semibold tracking-wider">
              Location / Landmark
            </label>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="Street or neighborhood in Kolkata"
              className="w-full bg-[#080C14]/90 border border-white/[0.1] rounded-xl p-3 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
            <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Geo-tag: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} (Device GPS)</span>
            </div>
          </div>

          {/* Phase 9 disclaimer */}
          <p className="text-[11px] text-neutral-500 pt-1 leading-relaxed">
            * Note: Phase 1 stores this report locally in your active session. Emergency municipal dispatch will be enabled in Phase 9.
          </p>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium rounded-xl transition-all cursor-pointer border border-white/[0.08]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
            >
              {isSubmitting ? 'Logging...' : 'Publish Field Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
