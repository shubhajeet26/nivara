import { UserLocation } from '../types';

export interface RouteWaypoint {
  lat: number;
  lng: number;
  instruction?: string;
  isHazardAvoidancePoint?: boolean;
}

export interface EvacuationRoute {
  id: string;
  destinationName: string;
  distanceMeters: number;
  estimatedTimeMinutes: number;
  safetyScore: number; // 0 - 100
  waypoints: RouteWaypoint[];
  avoidedHazardsCount: number;
  status: 'OPTIMAL' | 'ALTERNATIVE' | 'CAUTION';
}

export interface IRoutingService {
  isImplemented: boolean;
  calculateSafeEvacuationRoute(origin: UserLocation, destinationId: string): Promise<EvacuationRoute | null>;
  getEvacuationNotice(): string;
}

/**
 * Phase 1 Architecture Placeholder:
 * Full dynamic hazard-avoiding routing engine is scheduled for Phase 5.
 * This interface establishes the data contracts and algorithm pipeline.
 */
class RoutingServiceImpl implements IRoutingService {
  readonly isImplemented = false;

  async calculateSafeEvacuationRoute(
    _origin: UserLocation,
    _destinationId: string
  ): Promise<EvacuationRoute | null> {
    // Deliberately returns null in Phase 1 to adhere strictly to data honesty.
    // Real A* / Dijkstra hazard-weighted route generation will be integrated in Phase 5.
    return null;
  }

  getEvacuationNotice(): string {
    return 'Dynamic turn-by-turn hazard avoidance routing is scheduled for Phase 5. In Phase 1, consult the active Safe Shelters and Blocked Corridors on the map.';
  }
}

export const routingService = new RoutingServiceImpl();
