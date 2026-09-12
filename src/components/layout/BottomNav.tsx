import React from 'react';
import { LayoutDashboard, Map as MapIcon, ShieldAlert, FileText, AlertOctagon } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { NavigationPage } from '../../types';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage } = useApp();

  const navItems: { id: NavigationPage; label: string; icon: React.ComponentType<{ className?: string }>; emergency?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'safety', label: 'Risk & Shelter', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'emergency', label: 'Emergency', icon: AlertOctagon, emergency: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B101A]/90 backdrop-blur-2xl border-t border-white/[0.08] flex items-center justify-around px-2 z-40 select-none pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        if (item.emergency) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage('emergency')}
              className="flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl -mt-4 bg-gradient-to-br from-rose-500 to-rose-700 active:from-rose-600 active:to-rose-800 text-white shadow-[0_0_20px_rgba(244,63,94,0.45)] border border-rose-400 cursor-pointer px-2 transition-transform active:scale-95"
            >
              <Icon className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider mt-0.5">
                SOS
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center min-w-[48px] h-12 rounded-xl transition-all cursor-pointer px-2 ${
              isActive
                ? 'text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] tracking-tight font-display mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
