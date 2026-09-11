import React from 'react';
import { Wifi, WifiOff, Navigation, Radio } from 'lucide-react';
import { ConnectivityStatus, GpsStatus } from '../../types';

interface StatusPillProps {
  type: 'connectivity' | 'gps' | 'sync';
  connectivityStatus?: ConnectivityStatus;
  gpsStatus?: GpsStatus;
  sublabel?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  type,
  connectivityStatus = 'ONLINE',
  gpsStatus = 'AVAILABLE',
  sublabel,
  onClick,
  interactive = false,
}) => {
  const getContent = () => {
    if (type === 'connectivity') {
      if (connectivityStatus === 'ONLINE') {
        return {
          icon: <Wifi className="w-3 h-3 text-teal-400" />,
          label: 'ONLINE',
          border: 'border-teal-500/30 bg-teal-500/10 text-teal-300 shadow-[0_0_14px_rgba(20,184,166,0.22)]',
          dot: 'bg-teal-400',
          ring: 'bg-teal-400/40',
        };
      }
      if (connectivityStatus === 'LIMITED') {
        return {
          icon: <Wifi className="w-3 h-3 text-amber-400" />,
          label: 'LIMITED',
          border: 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.2)]',
          dot: 'bg-amber-400',
          ring: 'bg-amber-400/40',
        };
      }
      return {
        icon: <WifiOff className="w-3 h-3 text-neutral-400" />,
        label: 'OFFLINE',
        border: 'border-white/[0.08] bg-white/[0.04] text-neutral-300 shadow-sm',
        dot: 'bg-neutral-500',
        ring: 'bg-neutral-500/30',
      };
    }

    if (type === 'gps') {
      if (gpsStatus === 'AVAILABLE') {
        return {
          icon: <Navigation className="w-3 h-3 text-sky-400" />,
          label: 'GPS READY',
          border: 'border-sky-500/30 bg-sky-500/10 text-sky-300 shadow-[0_0_14px_rgba(14,165,233,0.22)]',
          dot: 'bg-sky-400',
          ring: 'bg-sky-400/40',
        };
      }
      if (gpsStatus === 'REQUESTING') {
        return {
          icon: <Navigation className="w-3 h-3 text-amber-400 animate-spin" />,
          label: 'LOCKING...',
          border: 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.2)]',
          dot: 'bg-amber-400',
          ring: 'bg-amber-400/40',
        };
      }
      if (gpsStatus === 'DENIED') {
        return {
          icon: <Navigation className="w-3 h-3 text-rose-400" />,
          label: 'GPS DENIED',
          border: 'border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.25)]',
          dot: 'bg-rose-400',
          ring: 'bg-rose-400/40',
        };
      }
      return {
        icon: <Navigation className="w-3 h-3 text-neutral-400" />,
        label: 'NO GPS',
        border: 'border-white/[0.08] bg-white/[0.04] text-neutral-400 shadow-sm',
        dot: 'bg-neutral-500',
        ring: 'bg-neutral-500/30',
      };
    }

    // sync
    return {
      icon: <Radio className="w-3 h-3 text-teal-400" />,
      label: 'SYNCED',
      border: 'border-white/[0.08] bg-white/[0.04] text-neutral-200 shadow-sm',
      dot: 'bg-teal-400',
      ring: 'bg-teal-400/40',
    };
  };

  const c = getContent();

  const buttonClass = interactive
    ? 'cursor-pointer hover:border-white/[0.2] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150'
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono select-none backdrop-blur-md transition-all ${c.border} ${buttonClass}`}
      title={sublabel || c.label}
    >
      <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${c.ring}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${c.dot}`} />
      </span>
      <span className="font-semibold tracking-wider text-[11px]">{c.label}</span>
      {sublabel && (
        <span className="hidden sm:inline text-neutral-400 text-[10px] border-l border-white/[0.12] pl-1.5">
          {sublabel}
        </span>
      )}
    </button>
  );
};
