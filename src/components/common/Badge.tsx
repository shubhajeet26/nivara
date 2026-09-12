import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface BadgeProps {
  level: RiskLevel | 'INFO' | 'OFFLINE' | 'ONLINE';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPing?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  level,
  label,
  size = 'md',
  className = '',
  showPing = true,
}) => {
  const getStyle = () => {
    switch (level) {
      case 'SAFE':
      case 'ONLINE':
        return {
          bg: 'bg-gradient-to-r from-teal-500/20 via-emerald-500/15 to-teal-500/10 text-teal-200 border-teal-500/40 shadow-[0_0_16px_rgba(20,184,166,0.25)]',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-teal-300' : 'w-3.5 h-3.5 text-teal-300'} />,
          dot: 'bg-teal-400',
          ring: 'bg-teal-400/50',
          defaultText: 'SAFE',
        };
      case 'CAUTION':
        return {
          bg: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/10 text-amber-200 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.25)]',
          icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-amber-300' : 'w-3.5 h-3.5 text-amber-300'} />,
          dot: 'bg-amber-400',
          ring: 'bg-amber-400/50',
          defaultText: 'CAUTION',
        };
      case 'WARNING':
        return {
          bg: 'bg-gradient-to-r from-orange-500/25 via-amber-500/20 to-orange-500/15 text-orange-200 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.35)]',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3.5 h-3.5 text-orange-300' : 'w-4 h-4 text-orange-300'} />,
          dot: 'bg-orange-400',
          ring: 'bg-orange-400/60',
          defaultText: 'WARNING',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-gradient-to-r from-rose-500/30 via-red-500/20 to-rose-500/15 text-rose-100 border-rose-500/60 shadow-[0_0_24px_rgba(244,63,94,0.45)]',
          icon: <AlertOctagon className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-300 animate-pulse' : 'w-4 h-4 text-rose-300 animate-pulse'} />,
          dot: 'bg-rose-400',
          ring: 'bg-rose-400/70',
          defaultText: 'CRITICAL',
        };
      case 'OFFLINE':
        return {
          bg: 'bg-white/[0.06] text-neutral-300 border-white/[0.12] shadow-sm',
          icon: <Info className={size === 'sm' ? 'w-3 h-3 text-neutral-400' : 'w-3.5 h-3.5 text-neutral-400'} />,
          dot: 'bg-neutral-400',
          ring: 'bg-neutral-400/30',
          defaultText: 'OFFLINE',
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-gradient-to-r from-sky-500/20 via-cyan-500/15 to-sky-500/10 text-sky-200 border-sky-500/40 shadow-[0_0_16px_rgba(14,165,233,0.25)]',
          icon: <Info className={size === 'sm' ? 'w-3 h-3 text-sky-300' : 'w-3.5 h-3.5 text-sky-300'} />,
          dot: 'bg-sky-400',
          ring: 'bg-sky-400/50',
          defaultText: 'INFO',
        };
    }
  };

  const style = getStyle();
  const text = label || style.defaultText;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5 rounded-md',
    md: 'px-2.5 py-1 text-[11px] gap-1.5 rounded-lg',
    lg: 'px-3.5 py-1.5 text-xs sm:text-[13px] gap-2 rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center border backdrop-blur-xl whitespace-nowrap uppercase transition-all select-none font-display font-bold tracking-wider ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {showPing && (
        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${style.ring}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
        </span>
      )}
      <span className="shrink-0">{style.icon}</span>
      <span>{text}</span>
    </span>
  );
};
