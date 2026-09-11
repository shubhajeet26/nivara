# NIVARA — System Architecture Specification

## 1. Architectural Philosophy

Nivara is engineered with strict separation between user interface rendering, geospatial telemetry, and communication protocols. This decoupling guarantees that:

1. **The application functions under 0 bps bandwidth**: The core UI renders instantly from local static assets without blocking on remote API calls.
2. **Hardware telemetry is isolated from IP transport**: GPS/GNSS receiver states are tracked independently of cellular/Wi-Fi socket states.
3. **Future phases plug in without rewrites**: Business logic is encapsulated in TypeScript service interfaces that can be swapped from Phase 1 mock providers to Phase 2-12 live systems (e.g. SQLite, WebSockets, or Android Native JNI).

---

## 2. Directory Structure

```
src/
├── types/                     # Shared immutable data contracts
│   └── index.ts               # Navigation, Risk, Hazard, Offline, Location models
├── services/                  # Business logic & hardware abstractions
│   ├── locationService.ts     # Browser GNSS, permissions & fallback coords
│   ├── mapService.ts          # GIS calculations, Haversine formula, layers
│   ├── offlineService.ts      # Offline package inspection & integrity
│   ├── hazardService.ts       # Hazard scenario data provider
│   ├── routingService.ts      # Phase 5 evacuation routing interface
│   ├── syncService.ts         # Synchronization engine abstraction
│   ├── emergencyService.ts    # Emergency mode, direct telephony & SOS disclaimer
│   └── reportService.ts       # Community field reporting interface
├── data/                      # Geographically realistic demonstration records
│   ├── demoData.ts            # Kolkata hazards, shelters, hospitals, blocked roads
│   └── demoScenarios.ts       # Scenario definitions (Flood, Cyclone, etc.)
├── state/                     # Reactive application state
│   └── AppContext.tsx         # Central lightweight context & event listeners
├── components/                # Modular presentational & interactive units
│   ├── common/                # Badges, StatusPills, Modals, DemoBanner
│   ├── layout/                # AppShell, TopBar, Sidebar, BottomNav, Toast
│   ├── map/                   # Tactical Leaflet canvas, markers, layers, inspector
│   └── offline/               # Offline package inspection dialog
└── pages/                     # Primary top-level route views
    ├── OverviewPage.tsx       # Primary dashboard ("Am I safe right now?")
    ├── MapPage.tsx            # Full-bleed immersive tactical map
    ├── SafetyPage.tsx         # Risk breakdown, active hazards & safe shelters
    ├── ReportsPage.tsx        # Field reporting feed & submission modal
    ├── EmergencyModePage.tsx  # High-contrast, stripped-down emergency UI
    └── SettingsPage.tsx       # System settings, offline packages, roadmap
```

---

## 3. Service Layer Specifications

### `locationService`
- Interacts with `navigator.geolocation` using `enableHighAccuracy: true`.
- Evaluates permission status via `navigator.permissions.query({ name: 'geolocation' })`.
- Provides an immediate, valid fallback coordinate set (`22.5726, 88.3639` — Kolkata city center) if permissions are declined, preventing runtime map crashes.

### `mapService`
- Implements the Haversine spherical distance calculation:
  $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
- Formats distances humanely (meters under 1 km, tenths of km above 1 km).
- Exposes tactical layer definitions with semantic colors and icons.

### `offlineService`
- Manages the local resilience bundle (`OfflinePackage`).
- Simulates SHA-256 chunk validation across 4,120 pre-rendered vector tiles.
- Prepares interface contracts for Phase 6 IndexedDB SQLite tile storage.

### `hazardService`
- Filters hazards, safe shelters, and blocked transportation corridors based on the active simulation scenario.

### `routingService` (Phase 5 Interface)
- Declares the future Dijkstra / A* route evaluation algorithm that penalizes paths traversing active hazard perimeters or blocked roads.
- In Phase 1, cleanly returns `null` with transparent user guidance, respecting data honesty.

### `emergencyService` (Phase 8 Interface)
- Stores directly dialable emergency telephone URIs (`tel:112`, `tel:1078`, `tel:1070`).
- Provides physical vibration feedback via `navigator.vibrate` when supported.
- Explicitly documents that live automated dispatch requires Phase 8 backend services.

### `reportService` (Phase 9 Interface)
- Captures user reports into local reactive memory.
- Prepares data schemas for photo attachments, location tagging, and civil defense verification.

---

## 4. State Management Flow

1. **Browser Network Listener**: Binds to `window.addEventListener('online')` and `('offline')` to dynamically update `connectivity`.
2. **Scenario Swapper**: Switching scenarios in `AppContext` immediately recalculates active hazard perimeters, shelter counts, and dashboard risk status across all components.
3. **Map Marker Selection**: Clicking any map marker or list item populates `selectedMapItem`, which opens the tactical inspector drawer without page reloads.

---

## 5. Future Native Android Integration Path

To deploy Nivara as an ultra-reliable APK/AAB for field personnel in Phase 12:
- The React/Vite web application shares identical service interfaces with the native Android architecture.
- Android's native `LocationManager` and `FusedLocationProviderClient` will plug into `locationService`.
- MapLibre Native SDK (C++/Android NDK) will replace web Leaflet for hardware-accelerated 60 FPS offline tile rendering.
- Background location geofencing and SMS/satellite SOS dispatch will operate via Android Foreground Services.
