# NIVARA — Disaster Resilience & Emergency Navigation Platform

> **Safety • Awareness • Navigation • Resilience**

Nivara is a production-oriented disaster resilience and emergency navigation platform designed to empower civilians, disaster response teams (NDRF/SDRF), volunteers, and civil authorities during acute climate crises and infrastructural collapse.

---

## 1. What Nivara Is

During severe floods, cyclones, or seismic tremors, conventional cellular connectivity, power grids, and road networks frequently fail. Standard navigation applications assume uninterrupted internet access, open commercial roads, and peacetime conditions.

Nivara is built from the ground up on an **offline-first, zero-connectivity resilience paradigm**. It answers the single most urgent question a civilian or rescuer asks during a catastrophe:

> **"Am I safe right now, where is my nearest verified refuge, and how do I navigate there without driving into active hazards or flooded arteries?"**

---

## 2. Phase 1 Scope & Status

This repository contains **Phase 1: Foundation, Application Shell, and Operational Telemetry**.

### What Is Genuinely Functional in Phase 1:
- **Responsive Application Shell**: Desktop tactical Command Center layout with persistent telemetry, and mobile one-handed navigation layout.
- **Hardware-Isolated Telemetry**: Real browser GNSS/GPS geolocation handling with fallback coordinates, permission request workflows, and distinct separation of GPS hardware status from Internet data connectivity.
- **Dynamic Network Listener**: Real browser `navigator.onLine` and `online`/`offline` lifecycle handling, plus a quick simulation toggle to test zero-connectivity behavior.
- **Full-Bleed Tactical Cartography**: High-contrast, dark-mode OpenStreetMap/Leaflet tactical GIS canvas with custom vector polygons (hazard perimeters), dashed blocked roads, safe shelter beacons, and live device GPS radar rings.
- **Interactive Multi-Scenario Simulator**: 6 disaster simulation scenarios for Kolkata, West Bengal (Normal, Flood, Cyclone, Landslide, Earthquake, Wildfire).
- **Offline Package Architecture**: UX management panel, integrity verification, local metadata inspection, and storage tracking.
- **Community Hazard Reporting Flow**: User-submitted field reports tagged with device coordinates and categorized by hazard type, stored in local session state.
- **Emergency Mode**: High-contrast, stripped-down tactical screen prioritizing device coordinates, nearest safe shelter, direct-dial offline emergency hotlines (112, 1078, 1070), and screen beacon triggers.

### What is Simulated / Demonstration Data (Honesty Mandate):
- **Kolkata Hazard Zones & Road Closures**: Clearly labeled with `[DEMO DATA]` badges. These represent realistic geographical models for testing UI/UX and GIS calculations, not live municipal alerts.
- **Authority Dispatch**: In Phase 1, field hazard reports and SOS beacons are logged locally in the browser session. Real government dispatch integration is scheduled for Phase 8 & 9.
- **Offline Tile Caching**: The Phase 1 offline package panel simulates compressed tile archive unpacking and SHA-256 verification. Actual binary mbtiles downloading via Service Worker / IndexedDB SQLite is implemented in Phase 6.

---

## 3. Technology Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (v4) with high-contrast tactical operations center color system
- **Icons**: Lucide React
- **Mapping**: Leaflet with custom tactical tiles and vector overlay abstractions
- **State Management**: React Context (`AppContext`) with modular service boundaries
- **Performance**: Container ResizeObservers, memoized spatial queries, zero bulky UI component dependencies

---

## 4. Getting Started

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Verify types and linting
npm run lint

# Compile production bundle
npm run build
```

---

## 5. Architectural Roadmap

Refer to `PHASES.md` for the multi-phase deployment roadmap from Phase 1 to Phase 12.
