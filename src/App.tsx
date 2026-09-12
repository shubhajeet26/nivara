/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { CursorFollower } from './components/common/CursorFollower';

function AppRouter() {
  const { currentRoute } = useApp();

  return (
    <>
      <CursorFollower />
      {currentRoute === 'landing' ? <LandingPage /> : <AppShell />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}


