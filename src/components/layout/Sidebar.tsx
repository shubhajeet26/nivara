import React from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  ShieldAlert,
  FileText,
  AlertOctagon,
  Settings,
  HardDrive,
  Info,
  Home,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { NavigationPage } from '../../types';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  emergency?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, setIsOfflineModalOpen, offlinePackage, navigateToLanding } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Safety Map', icon: MapIcon, badge: 'CORE' },
    { id: 'safety', label: 'Risk & Shelters', icon: ShieldAlert },
    { id: 'reports', label: 'Field Reports', icon: FileText },
    { id: 'emergency', label: 'Emergency Mode', icon: AlertOctagon, emergency: true },
    { id: 'settings', label: 'System & Offline', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-[#0B101A]/85 backdrop-blur-xl border-r border-white/[0.08] shrink-0 select-none justify-between p-3.5 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
      <div className="space-y-6">
        {/* Navigation Group */}
        <nav className="space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
            <span className="w-1 h-2.5 rounded-full bg-amber-400" />
            Command Center
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? item.emergency
                      ? 'bg-rose-500/20 text-rose-200 font-bold border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-white/[0.08] text-white font-semibold border-l-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.18)]'
                    : item.emergency
                    ? 'text-rose-400/90 hover:bg-rose-950/30 hover:text-rose-200'
                    : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? item.emergency
                          ? 'bg-rose-500/30 text-rose-300'
                          : 'bg-amber-500/20 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : item.emergency
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-white/[0.04] text-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-display tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-neutral-300 border border-white/[0.1] tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Home / Landing Navigation Link */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={navigateToLanding}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer border border-white/[0.04] hover:border-white/[0.1]"
          title="Return to Nivara Landing Page"
        >
          <span className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Home Page</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">/</span>
        </button>

        {/* Bottom offline cache status card */}
        <div className="p-3.5 bg-[#090D15]/90 border border-white/[0.08] rounded-2xl space-y-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-200 font-display">
              <div className="w-5 h-5 rounded-md bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                <HardDrive className="w-3 h-3 text-teal-400" />
              </div>
              <span>Kolkata Cache</span>
            </div>
            <span className="text-[10px] font-mono text-teal-300 font-bold bg-teal-500/10 border border-teal-500/30 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(20,184,166,0.2)]">
              {offlinePackage.status}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
            {offlinePackage.sizeMb} MB vector map tiles, shelter nodes & contacts pre-cached.
          </p>
          <button
            type="button"
            onClick={() => setIsOfflineModalOpen(true)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-neutral-300 text-center transition-all cursor-pointer shadow-xs hover:border-white/[0.18]"
          >
            Inspect Local Cache
          </button>
        </div>
      </div>
    </aside>
  );
};
