# NIVARA — Data Sources & Integrity Specification

## 1. Data Honesty Policy

**Never fabricate emergency alerts.**

In disaster response applications, false information or unverified data can cause real physical harm, misdirect civilian evacuation traffic, or overwhelm rescue corridors.

Nivara enforces a strict **Data Honesty Policy**:
1. Every simulated hazard, route blockage, and weather warning in Phase 1 is explicitly tagged with `[DEMO DATA]` or `[SIMULATION]` badges.
2. The user interface prominently displays a global persistent banner informing the user that active disaster data is currently running in demonstration mode.
3. The platform does not claim real-time municipal dispatch or active SDRF monitoring until verified secure API backends are authenticated in future phases.

---

## 2. Phase 1 Demonstration Dataset

The Phase 1 release incorporates realistic geospatial demonstration records mapped to the geography of **Kolkata, West Bengal, India**:

### Simulated Facilities Included:
- **Netaji Indoor Stadium Shelter** (B.B.D. Bagh) — High-capacity sports complex safe shelter.
- **SSKM Hospital Emergency Trauma Centre** (Bhowanipore) — Premier 24x7 state tertiary care hospital.
- **Calcutta Boys School Relief Camp** (SN Banerjee Road) — Elevated civic relief hub.
- **Alipore Command Post & Civil Protection Camp** (Belvedere Road) — Coordinated civil defense center.
- **Medical College & Hospital Emergency Wing** (College Street) — Central medical facility.

### Simulated Disaster Perimeters:
- Flooding hazard at Park Circus Seven Point Crossing.
- Inundation cordon at Kalighat South Embankment (Adi Ganga overflow).
- Route blockages along Maa Flyover (Park Circus connector) due to fallen high-tension cables and 3-foot waterlogging.

---

## 3. Future Real Data Source Integrations (Phases 3, 4, 9)

As Nivara progresses, real ingestion pipelines will connect to authoritative emergency and meteorological services:

| Source | Agency / Provider | Data Type | Implementation Phase |
| :--- | :--- | :--- | :--- |
| **OpenStreetMap (OSM)** | OpenStreetMap Foundation | Base map vectors, road hierarchies, building footprints | Phase 2 & 6 |
| **CAP Feeds** | NDMA (Sachet Portal) | Common Alerting Protocol (CAP) official government warnings | Phase 3 |
| **Meteorological Radar** | India Meteorological Department (IMD) | Cyclone tracking, hourly precipitation radar, tidal forecasts | Phase 3 |
| **Civic Waterlogging** | Kolkata Municipal Corporation (KMC) | Pumping station telemetry, canal water level sensors | Phase 3 |
| **Emergency Facilities** | West Bengal State Disaster Management Authority | Verified government cyclone shelter coordinates and supplies | Phase 4 |
| **Civic Reports** | Nivara Verified Citizen Mesh | Verified crowd-sourced road obstacles and hazards | Phase 9 |
