/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';

function AppRouter() {
  const { currentRoute } = useApp();

  if (currentRoute === 'landing') {
    return <LandingPage />;
  }

  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}


