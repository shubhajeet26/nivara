import { HazardItem, BlockedRoadItem, SafePlaceItem, ScenarioId } from '../types';
import { DEMO_HAZARDS, DEMO_BLOCKED_ROADS, DEMO_SAFE_PLACES } from '../data/demoData';

export interface IHazardService {
  getActiveHazards(scenario: ScenarioId, customHazards?: HazardItem[]): HazardItem[];
  getBlockedRoads(scenario: ScenarioId, customRoads?: BlockedRoadItem[]): BlockedRoadItem[];
  getSafePlaces(customPlaces?: SafePlaceItem[]): SafePlaceItem[];
  getHazardById(id: string): HazardItem | undefined;
  generateLocalSectorData(
    lat: number,
    lng: number,
    scenario: ScenarioId,
    locationLabel?: string
  ): {
    hazards: HazardItem[];
    safePlaces: SafePlaceItem[];
    blockedRoads: BlockedRoadItem[];
  };
}

class HazardServiceImpl implements IHazardService {
  getActiveHazards(scenario: ScenarioId, customHazards?: HazardItem[]): HazardItem[] {
    const list = customHazards && customHazards.length > 0 ? customHazards : DEMO_HAZARDS;
    return list.filter((h) => h.activeInScenarios.includes(scenario));
  }

  getBlockedRoads(scenario: ScenarioId, customRoads?: BlockedRoadItem[]): BlockedRoadItem[] {
    const list = customRoads && customRoads.length > 0 ? customRoads : DEMO_BLOCKED_ROADS;
    return list.filter((r) => r.activeInScenarios.includes(scenario));
  }

  getSafePlaces(customPlaces?: SafePlaceItem[]): SafePlaceItem[] {
    return customPlaces && customPlaces.length > 0 ? customPlaces : DEMO_SAFE_PLACES;
  }

  getHazardById(id: string): HazardItem | undefined {
    return DEMO_HAZARDS.find((h) => h.id === id);
  }

  generateLocalSectorData(
    lat: number,
    lng: number,
    scenario: ScenarioId,
    locationLabel = 'Live GPS Vicinity'
  ): {
    hazards: HazardItem[];
    safePlaces: SafePlaceItem[];
    blockedRoads: BlockedRoadItem[];
  } {
    // Generate realistic simulated coordinates within ~800m - 2.5km of the user's location
    const safePlaces: SafePlaceItem[] = [
      {
        id: `sp-local-shelter-1`,
        name: `${locationLabel} Designated Civil Shelter`,
        category: 'shelter',
        capacity: { current: 140, max: 1200 },
        location: {
          lat: lat + 0.0075,
          lng: lng + 0.0062,
          address: `Municipal Community Complex, Sector 1 (${locationLabel})`,
        },
        contactPhone: '+1-800-CIVIL-RES',
        suppliesAvailable: ['Emergency Backup Power', 'Potable Water Tank', 'Field Cots', 'VHF Comms'],
        distanceKm: 0.9,
        verified: true,
        open24x7: true,
      },
      {
        id: `sp-local-hospital-2`,
        name: `${locationLabel} Emergency Medical Center`,
        category: 'hospital',
        capacity: { current: 85, max: 400 },
        location: {
          lat: lat - 0.0092,
          lng: lng + 0.0084,
          address: `Trauma & Emergency Care Wing (${locationLabel})`,
        },
        contactPhone: '+1-800-MED-EMRG',
        suppliesAvailable: ['Triage Bay', 'Blood Bank Reserves', 'Emergency O2 Supply', 'Surgical Suites'],
        distanceKm: 1.4,
        verified: true,
        open24x7: true,
      },
      {
        id: `sp-local-camp-3`,
        name: `${locationLabel} Relief & Staging Depot`,
        category: 'relief_camp',
        capacity: { current: 50, max: 2000 },
        location: {
          lat: lat + 0.0125,
          lng: lng - 0.0088,
          address: `Public Athletic Ground Logistics Base (${locationLabel})`,
        },
        contactPhone: '+1-800-RELIEF-HUB',
        suppliesAvailable: ['Food Ration Kits', 'Inflatable Rafts', 'Sanitation Facility', 'Helipad Access'],
        distanceKm: 1.8,
        verified: true,
        open24x7: true,
      },
      {
        id: `sp-local-fire-4`,
        name: `${locationLabel} Rescue Brigade Station`,
        category: 'fire_station',
        location: {
          lat: lat - 0.0055,
          lng: lng - 0.0065,
          address: `Civil Defense Rescue Outpost (${locationLabel})`,
        },
        contactPhone: '+1-800-RESCUE-HQ',
        suppliesAvailable: ['High-Volume Pumps', 'Hydraulic Spreaders', 'Thermal Imagers'],
        distanceKm: 0.8,
        verified: true,
        open24x7: true,
      },
    ];

    const hazards: HazardItem[] = [
      {
        id: `hz-local-01`,
        title: `Simulated Flash Inundation Zone`,
        type: 'flooded_road',
        severity: 'WARNING',
        location: {
          lat: lat + 0.0042,
          lng: lng - 0.0035,
          address: `Drainage Crossing & Lowland Corridor (${locationLabel})`,
        },
        reportedAt: '12 mins ago',
        description: `Simulated flash inundation drill (40-60cm standing water). Light vehicular traffic diverted.`,
        verified: true,
        affectedRadiusMeters: 450,
        activeInScenarios: ['flood', 'cyclone', 'normal'],
      },
      {
        id: `hz-local-02`,
        title: `Simulated Debris & Utility Line Obstruction`,
        type: 'fallen_tree',
        severity: 'CAUTION',
        location: {
          lat: lat - 0.0068,
          lng: lng + 0.0032,
          address: `Main Arterial Road Underpass (${locationLabel})`,
        },
        reportedAt: '35 mins ago',
        description: `Simulated fallen pole and power line debris hazard. Clearance crew dispatched.`,
        verified: true,
        affectedRadiusMeters: 300,
        activeInScenarios: ['cyclone', 'wildfire', 'normal', 'earthquake'],
      },
      {
        id: `hz-local-03`,
        title: `Simulated Structural Safety Cordon`,
        type: 'structural_collapse',
        severity: 'CRITICAL',
        location: {
          lat: lat + 0.0105,
          lng: lng + 0.0048,
          address: `Commercial Depot Ramp Access (${locationLabel})`,
        },
        reportedAt: '1 hour ago',
        description: `Simulated masonry and structural integrity inspection hold. 500m exclusion perimeter active.`,
        verified: true,
        affectedRadiusMeters: 550,
        activeInScenarios: ['earthquake', 'wildfire', 'landslide'],
      },
    ];

    const blockedRoads: BlockedRoadItem[] = [
      {
        id: `blk-local-01`,
        roadName: `Main Transit Bypass (Sector 2 to 3)`,
        reason: `Simulated floodwater overflow across carriageway`,
        coordinates: [
          [lat + 0.0035, lng - 0.005],
          [lat + 0.0045, lng - 0.002],
          [lat + 0.0055, lng + 0.001],
        ],
        severity: 'WARNING',
        activeInScenarios: ['flood', 'cyclone', 'normal'],
      },
      {
        id: `blk-local-02`,
        roadName: `Underpass Rail Crossing Access`,
        reason: `Emergency services staging lane closure`,
        coordinates: [
          [lat - 0.006, lng + 0.002],
          [lat - 0.0075, lng + 0.004],
        ],
        severity: 'CAUTION',
        activeInScenarios: ['cyclone', 'earthquake'],
      },
    ];

    return { hazards, safePlaces, blockedRoads };
  }
}

export const hazardService = new HazardServiceImpl();

