import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  AppRoute,
  NavigationPage,
  ConnectivityStatus,
  GpsStatus,
  UserLocation,
  ScenarioId,
  OfflinePackage,
  HazardReport,
  HazardItem,
  SafePlaceItem,
  BlockedRoadItem,
  MapLayerId,
  MapTileStyle,
  OperationalSector,
  MapInspectionItem,
} from '../types';
import { locationService, KOLKATA_DEFAULT_LOCATION } from '../services/locationService';
import { offlineService } from '../services/offlineService';
import { reportService, SubmitReportInput } from '../services/reportService';
import { hazardService } from '../services/hazardService';
import { OPERATIONAL_SECTORS } from '../services/mapService';
import { SCENARIO_DEFINITIONS, ScenarioDefinition } from '../data/demoScenarios';

export interface FlyToCommand {
  lat: number;
  lng: number;
  zoom?: number;
  timestamp: number;
}

interface AppContextType {
  // Routing
  currentRoute: AppRoute;
  navigateToApp: (initialPage?: NavigationPage) => void;
  navigateToLanding: () => void;

  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  
  // Location & GPS
  userLocation: UserLocation;
  gpsStatus: GpsStatus;
  requestGpsPermission: () => Promise<void>;
  isWatchingLocation: boolean;
  toggleWatchLocation: () => void;
  setUserManualLocation: (lat: number, lng: number, placeName?: string) => void;
  
  // Connectivity
  connectivity: ConnectivityStatus;
  setConnectivity: (status: ConnectivityStatus) => void;
  toggleConnectivityMode: () => void;
  
  // Scenarios & Sectors (Demo system)
  activeScenario: ScenarioId;
  scenarioData: ScenarioDefinition;
  setScenario: (scenario: ScenarioId) => void;
  activeSector: OperationalSector;
  setActiveSector: (sector: OperationalSector) => void;
  customLocalData: { hazards: HazardItem[]; safePlaces: SafePlaceItem[]; blockedRoads: BlockedRoadItem[] } | null;
  generateLocalSimulation: () => void;
  clearLocalSimulation: () => void;
  
  // Map Layer & Style Management
  mapTileStyle: MapTileStyle;
  setMapTileStyle: (style: MapTileStyle) => void;
  activeLayers: Record<MapLayerId, boolean>;
  toggleLayer: (layerId: MapLayerId) => void;
  setLayerState: (layerId: MapLayerId, enabled: boolean) => void;
  flyToTarget: FlyToCommand | null;
  triggerFlyTo: (lat: number, lng: number, zoom?: number) => void;
  
  // Offline package
  offlinePackage: OfflinePackage;
  refreshOfflinePackage: () => Promise<void>;
  
  // Reports
  reports: HazardReport[];
  submitNewReport: (input: SubmitReportInput) => Promise<HazardReport>;
  
  // Inspected map item
  selectedMapItem: MapInspectionItem | null;
  setSelectedMapItem: (item: MapInspectionItem | null) => void;
  
  // Modals & Drawers
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isOfflineModalOpen: boolean;
  setIsOfflineModalOpen: (open: boolean) => void;
  isScenarioModalOpen: boolean;
  setIsScenarioModalOpen: (open: boolean) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialRoute = (): AppRoute => {
    if (typeof window === 'undefined') return 'landing';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (
      path.startsWith('/dashboard') ||
      path.startsWith('/app') ||
      hash.includes('dashboard') ||
      hash.includes('app')
    ) {
      return 'app';
    }
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [activePage, setActivePage] = useState<NavigationPage>('overview');

  const navigateToApp = useCallback((initialPage: NavigationPage = 'overview') => {
    setActivePage(initialPage);
    setCurrentRoute('app');
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/dashboard')) {
      window.history.pushState({ route: 'app', page: initialPage }, '', '/dashboard');
    }
  }, []);

  const navigateToLanding = useCallback(() => {
    setCurrentRoute('landing');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({ route: 'landing' }, '', '/');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path.startsWith('/dashboard') ||
        path.startsWith('/app') ||
        hash.includes('dashboard') ||
        hash.includes('app')
      ) {
        setCurrentRoute('app');
      } else {
        setCurrentRoute('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [userLocation, setUserLocation] = useState<UserLocation>(KOLKATA_DEFAULT_LOCATION);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('AVAILABLE');
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);
  const watchCleanupRef = useRef<(() => void) | null>(null);

  // Sector and custom local simulation
  const [activeSector, setActiveSector] = useState<OperationalSector>(OPERATIONAL_SECTORS[0]);
  const [customLocalData, setCustomLocalData] = useState<{
    hazards: HazardItem[];
    safePlaces: SafePlaceItem[];
    blockedRoads: BlockedRoadItem[];
  } | null>(null);

  // Map settings
  const [mapTileStyle, setMapTileStyle] = useState<MapTileStyle>('tactical_dark');
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerId, boolean>>({
    hazards: true,
    shelters: true,
    hospitals: true,
    relief_camps: true,
    blocked_roads: true,
    accuracy_ring: true,
  });
  const [flyToTarget, setFlyToTarget] = useState<FlyToCommand | null>(null);

  // Real browser connectivity detection
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'OFFLINE' : 'ONLINE';
  });

  const [activeScenario, setActiveScenarioState] = useState<ScenarioId>('flood');
  const [offlinePackage, setOfflinePackage] = useState<OfflinePackage>({
    id: 'pkg-kolkata-metro',
    regionName: 'Kolkata Metropolitan Area',
    status: 'READY',
    sizeMb: 124.6,
    mapDataAvailable: true,
    safetyLocationsAvailable: true,
    emergencyInfoAvailable: true,
    lastSynchronized: 'Today, 08:42 AM IST',
    expiryDate: 'In 14 days (Automatic check)',
    tileCoverageSquareKm: 1850,
  });

  const [reports, setReports] = useState<HazardReport[]>(() => reportService.getRecentReports());
  const [selectedMapItem, setSelectedMapItem] = useState<MapInspectionItem | null>(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  const triggerFlyTo = useCallback((lat: number, lng: number, zoom = 14) => {
    setFlyToTarget({ lat, lng, zoom, timestamp: Date.now() });
  }, []);

  const toggleLayer = useCallback((layerId: MapLayerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  }, []);

  const setLayerState = useCallback((layerId: MapLayerId, enabled: boolean) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: enabled,
    }));
  }, []);

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setConnectivity('ONLINE');
      showToast('Network restored: Synchronized with live telemetry');
    };
    const handleOffline = () => {
      setConnectivity('OFFLINE');
      showToast('Internet offline: Switched to verified local safety cache');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Request browser geolocation with proper error and permission states
  const requestGpsPermission = useCallback(async () => {
    setGpsStatus('REQUESTING');
    if (!('geolocation' in navigator)) {
      setGpsStatus('UNAVAILABLE');
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const liveLoc: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
          placeName: 'Live Device GNSS Fix',
          source: 'gps',
          timestamp: Date.now(),
        };
        setUserLocation(liveLoc);
        setGpsStatus('AVAILABLE');
        showToast(`GPS Position Fixed (±${liveLoc.accuracyMeters}m accuracy)`);
        triggerFlyTo(liveLoc.lat, liveLoc.lng, 15);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('DENIED');
          showToast('Location permission denied. Using Kolkata sector coordinates.');
        } else {
          setGpsStatus('UNAVAILABLE');
          showToast('Unable to obtain GPS signal. Using safe cached coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [showToast, triggerFlyTo]);

  // Live Location Watching
  const toggleWatchLocation = useCallback(() => {
    if (isWatchingLocation) {
      if (watchCleanupRef.current) {
        watchCleanupRef.current();
        watchCleanupRef.current = null;
      }
      setIsWatchingLocation(false);
      showToast('Live GNSS tracking paused');
    } else {
      const cleanup = locationService.watchLocation((loc) => {
        setUserLocation(loc);
        setGpsStatus('AVAILABLE');
      });
      watchCleanupRef.current = cleanup;
      setIsWatchingLocation(true);
      showToast('Live GNSS tracking streaming active');
    }
  }, [isWatchingLocation, showToast]);

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchCleanupRef.current) {
        watchCleanupRef.current();
      }
    };
  }, []);

  const setUserManualLocation = useCallback((lat: number, lng: number, placeName = 'Manual Map Reference') => {
    setUserLocation({
      lat,
      lng,
      accuracyMeters: 10,
      placeName,
      source: 'manual',
      timestamp: Date.now(),
    });
    triggerFlyTo(lat, lng, 14);
    showToast(`Reference position updated to: ${placeName}`);
  }, [showToast, triggerFlyTo]);

  // Generate localized simulation around the user's current GPS location
  const generateLocalSimulation = useCallback(() => {
    const data = hazardService.generateLocalSectorData(
      userLocation.lat,
      userLocation.lng,
      activeScenario,
      userLocation.placeName || 'Local Sector'
    );
    setCustomLocalData(data);
    triggerFlyTo(userLocation.lat, userLocation.lng, 14);
    showToast(`Generated localized emergency scenario around your coordinates`);
  }, [userLocation, activeScenario, triggerFlyTo, showToast]);

  const clearLocalSimulation = useCallback(() => {
    setCustomLocalData(null);
    showToast('Reset to Kolkata Disaster Operations Grid');
  }, [showToast]);

  const toggleConnectivityMode = useCallback(() => {
    setConnectivity((prev) => {
      const next: ConnectivityStatus = prev === 'ONLINE' ? 'LIMITED' : prev === 'LIMITED' ? 'OFFLINE' : 'ONLINE';
      showToast(`Simulated connection toggled to: ${next}`);
      return next;
    });
  }, [showToast]);

  const setScenario = useCallback((scId: ScenarioId) => {
    setActiveScenarioState(scId);
    showToast(`Simulation scenario activated: ${SCENARIO_DEFINITIONS[scId].name}`);
  }, [showToast]);

  const refreshOfflinePackage = useCallback(async () => {
    const updated = await offlineService.simulateSyncPackage(offlinePackage.id);
    setOfflinePackage(updated);
    showToast('Offline safety package verified & updated.');
  }, [offlinePackage.id, showToast]);

  const submitNewReport = useCallback(async (input: SubmitReportInput) => {
    const created = await reportService.submitReport(input);
    setReports((prev) => [created, ...prev]);
    showToast(`Field report logged: "${created.title}" (Local Session)`);
    return created;
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateToApp,
        navigateToLanding,
        activePage,
        setActivePage,
        userLocation,
        gpsStatus,
        requestGpsPermission,
        isWatchingLocation,
        toggleWatchLocation,
        setUserManualLocation,
        connectivity,
        setConnectivity,
        toggleConnectivityMode,
        activeScenario,
        scenarioData: SCENARIO_DEFINITIONS[activeScenario],
        setScenario,
        activeSector,
        setActiveSector,
        customLocalData,
        generateLocalSimulation,
        clearLocalSimulation,
        mapTileStyle,
        setMapTileStyle,
        activeLayers,
        toggleLayer,
        setLayerState,
        flyToTarget,
        triggerFlyTo,
        offlinePackage,
        refreshOfflinePackage,
        reports,
        submitNewReport,
        selectedMapItem,
        setSelectedMapItem,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isOfflineModalOpen,
        setIsOfflineModalOpen,
        isScenarioModalOpen,
        setIsScenarioModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

