# NIVARA — Multi-Phase Development Roadmap

Nivara is developed under a disciplined, phased engineering architecture to ensure every subsystem is tested and production-ready before adding subsequent complexity.

---

## Complete 12-Phase Roadmap

### [COMPLETED] Phase 1: Foundation, Application Shell, and Operational Telemetry
- **Visual Identity & Brand Tone**: Mission-critical dark theme, high-contrast typography, and tactical visual language.
- **Responsive Architecture**: Multi-device operational command center with desktop sidebar, mobile bottom navigation, and top telemetry bar.
- **Hardware Telemetry Isolation**: Independent GPS/GNSS satellite status tracking separate from cellular/Wi-Fi socket status.
- **Tactical Map Foundation**: Full-bleed Leaflet GIS map with custom tactical tile filters, hazard perimeters, shelter pins, and user radar pulse.
- **Safety Dashboard**: Direct answer to *"Am I safe right now?"* with current threat analysis and nearby facility cards.
- **Disaster Simulation Engine**: 6 operational disaster scenarios for Kolkata, West Bengal (Flood, Cyclone, Landslide, Earthquake, Wildfire, Baseline).
- **Offline Package Architecture**: UX management panel, SHA-256 integrity simulation, and local storage inspector.
- **Hazard Reporting Foundation**: Community report submission modal with geo-tagging, categorized logging, and data honesty disclaimers.
- **Emergency Mode**: Large-typography, low-animation view with coordinates, nearest shelter, and offline telephony links (112, 1078).

---

### [UPCOMING] Phase 2: Live Map & Advanced GNSS Engine
- Integration of high-frequency device orientation (compass bearing / heading).
- MapLibre GL vector tile rendering with dynamic pitch and rotation.
- Custom vector symbology for disaster classifications (NDMA standard iconography).

### [UPCOMING] Phase 3: Hazard Intelligence Engine
- Real-time ingestion of Common Alerting Protocol (CAP) feeds from NDMA / IMD.
- Dynamic polygon calculation for flood surge inundation zones.
- Temporal threat forecasting (hourly projected flood paths).

### [UPCOMING] Phase 4: Facilities & Relief Inventory
- Real-time shelter occupancy tracking and live bed availability.
- Potable water, dry rations, and medical supply inventory monitors.
- Civil defense coordinator portal.

### [UPCOMING] Phase 5: Safest Evacuation Routing (Hazard-Aware A*)
- Evacuation pathfinding algorithm that dynamically avoids hazard polygons, impassable flood depths, and blocked roads.
- Multi-modal evacuation support (pedestrian, emergency 4x4 vehicle, boat).
- Elevation-aware routing to direct users toward higher ground.

### [UPCOMING] Phase 6: True Offline Map Packages
- Downloadable district-level `.mbtiles` / `.pmtiles` bundles stored in IndexedDB.
- Service Worker precaching of all static UI assets for true air-gapped performance.
- Storage quota management and automatic background diff updating.

### [UPCOMING] Phase 7: Offline-First Database & Synchronization
- Local-first embedded database (SQLite / WatermelonDB) with CRDT synchronization.
- Automatic queueing of field hazard reports for synchronization when network connectivity restores.

### [UPCOMING] Phase 8: Emergency SOS & Distress Protocol
- One-touch SOS distress beacon with automated coordinates, blood type, and contact emergency payloads.
- SMS fallback channel: Encodes distress packets into compact 140-character SMS strings for transmission across single-bar 2G cellular connections.

### [UPCOMING] Phase 9: Community Verification & Authority Triage
- Automated deduplication of crowd-sourced hazard reports.
- Multi-party peer verification (upvoting / confirming ground truth).
- Direct municipal authority dashboard for emergency responders.

### [UPCOMING] Phase 10: Mesh Networking & Peer-to-Peer Relay
- Bluetooth Low Energy (BLE) and Wi-Fi Direct ad-hoc mesh networking.
- Packet relay across neighbor devices when all cell towers and internet backhauls are offline.

### [UPCOMING] Phase 11: Multi-Lingual & Accessibility Hardening
- Complete localization in Bengali (বাংলা), Hindi (हिन्दी), and English.
- Screen reader accessibility (ARIA live regions for active emergency sirens).
- Ultra-low battery consumption mode (black & white OLED theme).

### [UPCOMING] Phase 12: Native Android Production App
- Kotlin / Jetpack Compose native application.
- Foreground emergency service with satellite messaging (Android 14+ NTN Direct-to-Cell).
- Hardened APK distribution for field disaster response personnel.
