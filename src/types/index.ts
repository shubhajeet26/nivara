export type AppRoute = 'landing' | 'app';

export type NavigationPage = 'overview' | 'map' | 'safety' | 'reports' | 'emergency' | 'settings';

export type ConnectivityStatus = 'ONLINE' | 'LIMITED' | 'OFFLINE';

export type GpsStatus = 'AVAILABLE' | 'REQUESTING' | 'DENIED' | 'UNAVAILABLE';

export type RiskLevel = 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL';

export type HazardType = 
  | 'flooded_road'
  | 'blocked_road'
  | 'fallen_tree'
  | 'landslide'
  | 'damaged_bridge'
  | 'fire'
  | 'unsafe_area'
  | 'cyclone_surge'
  | 'structural_collapse'
  | 'other';

export type SafePlaceCategory = 
  | 'shelter'
  | 'hospital'
  | 'police'
  | 'fire_station'
  | 'relief_camp';

export type ScenarioId = 
  | 'normal'
  | 'flood'
  | 'cyclone'
  | 'landslide'
  | 'earthquake'
  | 'wildfire';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  placeName: string;
  source: 'gps' | 'fallback' | 'manual';
  timestamp: number;
}

export interface HazardItem {
  id: string;
  title: string;
  type: HazardType;
  severity: RiskLevel;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedAt: string;
  description: string;
  distanceKm?: number;
  verified: boolean;
  affectedRadiusMeters: number;
  activeInScenarios: ScenarioId[];
}

export interface SafePlaceItem {
  id: string;
  name: string;
  category: SafePlaceCategory;
  capacity?: {
    current: number;
    max: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactPhone?: string;
  suppliesAvailable: string[];
  distanceKm?: number;
  verified: boolean;
  open24x7: boolean;
}

export interface BlockedRoadItem {
  id: string;
  roadName: string;
  reason: string;
  coordinates: [number, number][];
  severity: RiskLevel;
  activeInScenarios: ScenarioId[];
}

export interface OfflinePackage {
  id: string;
  regionName: string;
  status: 'READY' | 'DOWNLOADING' | 'UPDATE_AVAILABLE' | 'NOT_DOWNLOADED';
  sizeMb: number;
  mapDataAvailable: boolean;
  safetyLocationsAvailable: boolean;
  emergencyInfoAvailable: boolean;
  lastSynchronized: string;
  expiryDate: string;
  tileCoverageSquareKm: number;
}

export interface HazardReport {
  id: string;
  type: HazardType;
  title: string;
  description: string;
  severity: RiskLevel;
  lat: number;
  lng: number;
  locationDescription: string;
  timestamp: number;
  reportedBy: string;
  isDemo: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  type: 'national' | 'state' | 'local' | 'personal';
  availableOffline: boolean;
}

export type MapLayerId = 'hazards' | 'shelters' | 'hospitals' | 'relief_camps' | 'blocked_roads' | 'accuracy_ring';

export type MapTileStyle = 'tactical_dark' | 'standard_osm' | 'satellite';

export interface OperationalSector {
  id: string;
  name: string;
  lat: number;
  lng: number;
  center: [number, number];
  zoom: number;
  description: string;
  isSimulatedDemo: boolean;
}

export type MapInspectionItem = HazardItem | SafePlaceItem | BlockedRoadItem;
