import { ScenarioId, RiskLevel } from '../types';

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  badge: string;
  overallRisk: RiskLevel;
  riskSummary: string;
  hazardCount: number;
  blockedRoadCount: number;
  nearbySheltersCount: number;
  safetyRecommendation: string;
  evacuationInstruction: string;
  affectedAreaName: string;
}

export const SCENARIO_DEFINITIONS: Record<ScenarioId, ScenarioDefinition> = {
  normal: {
    id: 'normal',
    name: 'Normal Operations',
    badge: 'BASELINE MONITORING',
    overallRisk: 'SAFE',
    riskSummary: 'No active localized hazards detected in your sector. All primary municipal transit arteries and bridges operational.',
    hazardCount: 0,
    blockedRoadCount: 0,
    nearbySheltersCount: 4,
    safetyRecommendation: 'Keep your offline safety package updated. Maintain standard personal emergency contact readiness.',
    evacuationInstruction: 'No evacuation required. Continue regular civil routines while maintaining baseline awareness.',
    affectedAreaName: 'Kolkata Metropolitan Area',
  },
  flood: {
    id: 'flood',
    name: 'Monsoon River Flood',
    badge: 'HYDROLOGICAL SURGE',
    overallRisk: 'WARNING',
    riskSummary: 'Hooghly River tidal surge + intense cloudburst caused waterlogging along riverbank access routes and low-lying wards.',
    hazardCount: 2,
    blockedRoadCount: 1,
    nearbySheltersCount: 3,
    safetyRecommendation: 'Avoid Strand Road and river embankment ghats. Move critical documents and medicines above ground level.',
    evacuationInstruction: 'Residents in low-elevation river wards should move towards Netaji Indoor Stadium or Milan Mela Prangan.',
    affectedAreaName: 'Hooghly Riverfront & Central Kolkata',
  },
  cyclone: {
    id: 'cyclone',
    name: 'Severe Cyclone Surge',
    badge: 'TROPICAL GALE ALERT',
    overallRisk: 'CRITICAL',
    riskSummary: 'Sustained winds 85-110 km/h with heavy windborne debris, fallen trees on EM Bypass, and damaged electrical infrastructure.',
    hazardCount: 2,
    blockedRoadCount: 2,
    nearbySheltersCount: 4,
    safetyRecommendation: 'Remain indoors away from glass facades. Do not touch downed power lines or wade through stagnant water.',
    evacuationInstruction: 'Persons in temporary structures or rooftop tenements must seek shelter in reinforced municipal arenas immediately.',
    affectedAreaName: 'Greater Kolkata & Bay Ingress Corridor',
  },
  landslide: {
    id: 'landslide',
    name: 'Embankment Rupture / Soil Slip',
    badge: 'GEOTECHNICAL ADVISORY',
    overallRisk: 'WARNING',
    riskSummary: 'Soil liquefaction and foreshore retaining wall failure along Hastings industrial riverfront.',
    hazardCount: 1,
    blockedRoadCount: 1,
    nearbySheltersCount: 3,
    safetyRecommendation: 'Keep minimum 200m buffer distance from riverward banks and deep metro excavation zones.',
    evacuationInstruction: 'Immediate cordon active in Hastings Foreshore area. Route inland via Vidyasagar Setu approach.',
    affectedAreaName: 'Hastings Foreshore & South Port Sector',
  },
  earthquake: {
    id: 'earthquake',
    name: 'Seismic Tremor (M5.8)',
    badge: 'SEISMIC EVENT ADVISORY',
    overallRisk: 'CRITICAL',
    riskSummary: 'Structural inspection underway on older overpasses and multi-tier flyovers. Aftershock precautions active.',
    hazardCount: 1,
    blockedRoadCount: 1,
    nearbySheltersCount: 4,
    safetyRecommendation: 'Do not use elevators. Gather in open ground assembly zones (Maidan / Salt Lake Central Park).',
    evacuationInstruction: 'Avoid parking beneath flyovers or century-old masonry facades in north Kolkata.',
    affectedAreaName: 'Zone III Kolkata Urban Core',
  },
  wildfire: {
    id: 'wildfire',
    name: 'Industrial Fire & Chemical Cloud',
    badge: 'HAZMAT & FIRE ALERT',
    overallRisk: 'CRITICAL',
    riskSummary: 'Major commercial warehouse fire in Topsia. Dense toxic smoke plume migrating southwest with easterly wind.',
    hazardCount: 1,
    blockedRoadCount: 1,
    nearbySheltersCount: 2,
    safetyRecommendation: 'Seal windows and doors if downwind. Wear N95 or damp cloth mask to filter particulate inhalation.',
    evacuationInstruction: 'Evacuate Topsia Canal South corridor perpendicularly to wind direction towards Science City / Milan Mela.',
    affectedAreaName: 'Topsia & Tangra Industrial Enclave',
  },
};
