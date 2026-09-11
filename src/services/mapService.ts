import { MapLayerId, MapTileStyle, OperationalSector } from '../types';

export interface MapLayerConfig {
  id: MapLayerId;
  name: string;
  enabled: boolean;
  color: string;
  icon: string;
  description: string;
}

export interface TileStyleConfig {
  id: MapTileStyle;
  name: string;
  url: string;
  subdomains: string[] | string;
  attribution: string;
  maxZoom: number;
}

export interface BearingResult {
  degrees: number;
  direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  formatted: string;
}

export interface IMapService {
  getAvailableLayers(): MapLayerConfig[];
  getTileStyles(): Record<MapTileStyle, TileStyleConfig>;
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number;
  formatDistance(distanceKm: number): string;
  calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): BearingResult;
  calculateBounds(points: [number, number][]): [[number, number], [number, number]] | null;
  getOperationalSectors(): OperationalSector[];
}

export const OPERATIONAL_SECTORS: OperationalSector[] = [
  {
    id: 'kolkata-metro',
    name: 'Kolkata Metropolitan Grid',
    lat: 22.5726,
    lng: 88.3639,
    center: [22.5726, 88.3639],
    zoom: 13,
    description: 'Primary disaster response simulation sector with river flooding, fallen debris & cyclone drills.',
    isSimulatedDemo: true,
  },
  {
    id: 'mumbai-coastal',
    name: 'Mumbai Coastal Sector',
    lat: 18.9220,
    lng: 72.8347,
    center: [18.9220, 72.8347],
    zoom: 13,
    description: 'High-density urban coastline vulnerability monitoring zone.',
    isSimulatedDemo: true,
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR Civil Defense',
    lat: 28.6139,
    lng: 77.2090,
    center: [28.6139, 77.2090],
    zoom: 12,
    description: 'Capital territorial defense, seismic zone-4 monitoring grid.',
    isSimulatedDemo: true,
  },
];

class MapServiceImpl implements IMapService {
  private layers: MapLayerConfig[] = [
    { id: 'hazards', name: 'Hazard Zones', enabled: true, color: '#ef4444', icon: 'AlertTriangle', description: 'Active environmental threats, perimeters & structural hazards' },
    { id: 'shelters', name: 'Safe Shelters', enabled: true, color: '#10b981', icon: 'Shield', description: 'Designated civil defense shelters, relief camps & depots' },
    { id: 'hospitals', name: 'Emergency Care', enabled: true, color: '#3b82f6', icon: 'HeartPulse', description: 'Level-1 trauma hospitals and critical disaster wards' },
    { id: 'blocked_roads', name: 'Blocked Corridors', enabled: true, color: '#f59e0b', icon: 'Slash', description: 'Impassable roadways, flooded bridges and closed underpasses' },
    { id: 'relief_camps', name: 'Relief Camps', enabled: true, color: '#8b5cf6', icon: 'Home', description: 'Food ration and emergency staging centers' },
    { id: 'accuracy_ring', name: 'GNSS Accuracy Ring', enabled: true, color: '#0ea5e9', icon: 'Crosshair', description: 'Hardware GPS uncertainty radius perimeter' },
  ];

  private tileStyles: Record<MapTileStyle, TileStyleConfig> = {
    tactical_dark: {
      id: 'tactical_dark',
      name: 'Tactical Dark (Ops)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap, &copy; CARTO',
      maxZoom: 19,
    },
    standard_osm: {
      id: 'standard_osm',
      name: 'Clean Street (OSM)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    },
    satellite: {
      id: 'satellite',
      name: 'Satellite Recon',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      subdomains: '',
      attribution: '&copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 18,
    },
  };

  getAvailableLayers(): MapLayerConfig[] {
    return [...this.layers];
  }

  getTileStyles(): Record<MapTileStyle, TileStyleConfig> {
    return this.tileStyles;
  }

  getOperationalSectors(): OperationalSector[] {
    return OPERATIONAL_SECTORS;
  }

  // Haversine formula (km)
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  }

  // Compass Bearing from (lat1, lon1) to (lat2, lon2)
  calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): BearingResult {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    brng = (brng + 360) % 360;
    const roundedDeg = Math.round(brng);

    const directions: ('N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW')[] = [
      'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW',
    ];
    const index = Math.round(brng / 45) % 8;
    const dir = directions[index];

    return {
      degrees: roundedDeg,
      direction: dir,
      formatted: `${roundedDeg}° ${dir}`,
    };
  }

  calculateBounds(points: [number, number][]): [[number, number], [number, number]] | null {
    if (points.length === 0) return null;
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const [lat, lng] of points) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }

    // Add slight padding so bounds aren't directly on edge
    const latPadding = Math.max((maxLat - minLat) * 0.1, 0.005);
    const lngPadding = Math.max((maxLng - minLng) * 0.1, 0.005);

    return [
      [minLat - latPadding, minLng - lngPadding],
      [maxLat + latPadding, maxLng + lngPadding],
    ];
  }
}

export const mapService = new MapServiceImpl();

