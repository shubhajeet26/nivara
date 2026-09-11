import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface BadgeProps {
  level: RiskLevel | 'INFO' | 'OFFLINE' | 'ONLINE';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ level, label, size = 'md', className = '' }) => {
  const getStyle = () => {
    switch (level) {
      case 'SAFE':
      case 'ONLINE':
        return {
          bg: 'bg-teal-500/10 text-teal-300 border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-teal-400' : 'w-3.5 h-3.5 text-teal-400'} />,
          defaultText: 'SAFE',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-400'} />,
          defaultText: 'CAUTION',
        };
      case 'WARNING':
        return {
          bg: 'bg-orange-500/10 text-orange-300 border-orange-500/30 shadow-[0_0_14px_rgba(249,115,22,0.22)]',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3 text-orange-400' : 'w-3.5 h-3.5 text-orange-400'} />,
          defaultText: 'WARNING',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15 text-rose-200 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.3)]',
          icon: <AlertOctagon className={size === 'sm' ? 'w-3 h-3 text-rose-400 animate-pulse' : 'w-3.5 h-3.5 text-rose-400 animate-pulse'} />,
          defaultText: 'CRITICAL',
        };
      case 'OFFLINE':
        return {
          bg: 'bg-white/[0.04] text-neutral-300 border-white/[0.08] shadow-sm',
          icon: <Info className={size === 'sm' ? 'w-3 h-3 text-neutral-400' : 'w-3.5 h-3.5 text-neutral-400'} />,
          defaultText: 'OFFLINE',
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.2)]',
          icon: <Info className={size === 'sm' ? 'w-3 h-3 text-sky-400' : 'w-3.5 h-3.5 text-sky-400'} />,
          defaultText: 'INFO',
        };
    }
  };

  const style = getStyle();
  const text = label || style.defaultText;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 rounded-md font-mono',
    md: 'px-2.5 py-1 text-[11px] gap-1.5 font-mono font-semibold tracking-wider rounded-lg',
    lg: 'px-3.5 py-1.5 text-xs gap-2 font-mono font-bold tracking-wider rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center border backdrop-blur-md whitespace-nowrap uppercase transition-all select-none ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className="shrink-0">{style.icon}</span>
      <span>{text}</span>
    </span>
  );
};
