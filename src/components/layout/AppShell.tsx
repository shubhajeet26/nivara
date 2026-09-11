import React from 'react';
import { useApp } from '../../state/AppContext';
import { DemoBanner } from '../common/DemoBanner';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Toast } from './Toast';
import { LocationPermissionModal } from '../common/LocationPermissionModal';
import { OfflinePackageModal } from '../offline/OfflinePackageModal';

import { OverviewPage } from '../../pages/OverviewPage';
import { MapPage } from '../../pages/MapPage';
import { SafetyPage } from '../../pages/SafetyPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { EmergencyModePage } from '../../pages/EmergencyModePage';
import { SettingsPage } from '../../pages/SettingsPage';

export const AppShell: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'map':
        return <MapPage />;
      case 'safety':
        return <SafetyPage />;
      case 'reports':
        return <ReportsPage />;
      case 'emergency':
        return <EmergencyModePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-command-mesh text-neutral-100 antialiased font-sans">
      {/* 1. Global Simulation & Data Honesty Banner */}
      <DemoBanner />

      {/* 2. Operational Top Bar */}
      <TopBar />

      {/* 3. Main Workspace Area: Desktop Sidebar + Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative pb-16 md:pb-0">
          {renderActivePage()}
        </main>
      </div>

      {/* 4. Mobile Ergonomic Bottom Navigation */}
      <BottomNav />

      {/* 5. Accessible Global Modals & Notifications */}
      <LocationPermissionModal />
      <OfflinePackageModal />
      <Toast />
    </div>
  );
};
