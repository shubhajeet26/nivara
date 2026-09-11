# NIVARA — Offline Mode & Resilience Strategy

## 1. The Zero-Connectivity Paradigm

Conventional web applications treat network disconnections as an error state (`ERR_INTERNET_DISCONNECTED`). In contrast, **Nivara treats offline operation as its primary, expected operating environment**.

During major natural catastrophes (e.g. Super Cyclones, severe riverbank flooding, major earthquakes):
- Cell towers lose grid power or become physically damaged.
- Backhaul fiber cables get severed.
- Cell towers that remain operational become severely congested by panic traffic.

Nivara is engineered so that **no critical life-safety action depends on a live server round-trip**.

---

## 2. Hardware GPS vs. Cellular Data Isolation

A common UX defect in emergency apps is conflating "Offline" with "No GPS".

| Subsystem | Source | Operational Requirement | Nivara Handling |
| :--- | :--- | :--- | :--- |
| **Positioning (GNSS)** | Orbital Satellites (GPS / GLONASS / Galileo / NavIC) | Direct line-of-sight to sky. Zero cellular or Wi-Fi required. | Remains active and updates local radar ring even when totally disconnected. |
| **Data Network (IP)** | 4G/5G, Wi-Fi, Ethernet | Local ISP / Cell Tower connection. | When lost, switches UI to `OFFLINE` mode without interrupting map rendering or local searches. |

---

## 3. What Functions 100% Offline in Phase 1

1. **Safety Status & Protocols**: All emergency instructions, evacuation advisories, and disaster guidelines are bundled statically into the application bundle.
2. **Safe Place Directory**: Addresses, bed capacities, contact numbers, and supply inventories for Kolkata shelters are embedded locally.
3. **Emergency Phone Calling**: Telephone links (`tel:112`, `tel:1078`) interface directly with the device's native telephony dialer, allowing standard circuit-switched cellular emergency calls even without mobile data.
4. **Interactive Tactical Map**: The Leaflet map engine, coordinate projections, marker clustering, and UI controls function entirely client-side.
5. **Distance & Bearing Calculations**: The mathematical Haversine algorithms run directly in JavaScript.

---

## 4. Phase 6 & Phase 7 Offline Roadmap

### Phase 6: Binary Vector Tile Bundles
- In Phase 6, Nivara will support downloadable `.mbtiles` / `.pmtiles` packages.
- Users can pre-download a 120 MB package covering their entire district (e.g., Greater Kolkata Metropolitan Area from Zoom level 8 to 17).
- Stored using `IndexedDB` with streaming byte-range fetching.

### Phase 7: Offline-First CRDT Data Sync
- Local reports and hazard logs will be committed to a client-side SQLite/WatermelonDB instance.
- Conflict-Free Replicated Data Types (CRDTs) will synchronize records automatically the moment a faint cell signal or peer mesh node is encountered.
