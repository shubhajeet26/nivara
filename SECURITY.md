# NIVARA — Security Architecture Specification

## 1. Threat Model in Disaster Scenarios

Disaster resilience platforms face adversarial vectors unique to high-stress scenarios:

1. **Malicious Hazard Injection**: Bad actors posting fabricated road closures or non-existent hazards to divert civilians away from safety or trigger panic.
2. **Offline Package Tampering**: Man-in-the-middle attacks corrupting cached map tiles or redirecting safe shelter coordinates.
3. **Denial of Service (DoS)**: Flooding community report channels to degrade response times for legitimate distress calls.
4. **Physical Interception**: Intercepting peer-to-peer ad-hoc mesh packets in bandwidth-constrained environments.

---

## 2. Defensive Countermeasures in Nivara

### Cryptographic Package Verification (Phase 1 & Phase 6)
- Offline resilience packages must carry verifiable digital signatures and SHA-256 integrity checksums.
- If a downloaded tile chunk or shelter manifest fails cryptographic validation, it is quarantined immediately, preventing corrupted routing data from loading into the map engine.

### Trust Tiers for Hazard Intelligence (Phase 9)
In Phase 9, reporting will implement a 3-tier trust hierarchy:
- **Tier 1 (Official Civil Defense / Police / NDRF)**: Cryptographically signed via municipal authority public keys; renders immediately with high-priority visual borders.
- **Tier 2 (Multi-Party Civilian Verification)**: Requires consensus confirmation from $\ge 3$ distinct localized devices before a corridor is marked fully blocked.
- **Tier 3 (Unverified Single Civilian)**: Displayed with distinct "Pending Verification" styling, preventing single bad actors from closing major transit arteries.

### Client-Side Sandboxing
- All HTML inputs in hazard forms are strictly sanitized against cross-site scripting (XSS).
- Content Security Policy (CSP) headers restrict executable script contexts to trusted static bundles.
- Geolocation access adheres strictly to HTTPS transport and explicit user permissions.
