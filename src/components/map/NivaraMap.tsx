import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { Search, X, Crosshair, MapPin, Radio, AlertCircle } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { hazardService } from '../../services/hazardService';
import { mapService, OPERATIONAL_SECTORS } from '../../services/mapService';
import { HazardItem, SafePlaceItem, BlockedRoadItem } from '../../types';
import { MapInspector } from './MapInspector';
import { MapControls } from './MapControls';
import { MapLayerMenu } from './MapLayerMenu';
import { MapLegend } from './MapLegend';

interface NivaraMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const NivaraMap: React.FC<NivaraMapProps> = ({
  className = 'h-full w-full',
  initialCenter = [22.5726, 88.3639], // Default Kolkata
  initialZoom = 13,
}) => {
  const {
    userLocation,
    gpsStatus,
    requestGpsPermission,
    isWatchingLocation,
    toggleWatchLocation,
    activeScenario,
    activeSector,
    setActiveSector,
    customLocalData,
    mapTileStyle,
    setMapTileStyle,
    activeLayers,
    toggleLayer,
    flyToTarget,
    triggerFlyTo,
    selectedMapItem,
    setSelectedMapItem,
    showToast,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Search & UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active scenario datasets (or local custom simulation)
  const activeHazards = useMemo(() => {
    return hazardService.getActiveHazards(activeScenario, customLocalData?.hazards);
  }, [activeScenario, customLocalData]);

  const blockedRoads = useMemo(() => {
    return hazardService.getBlockedRoads(activeScenario, customLocalData?.blockedRoads);
  }, [activeScenario, customLocalData]);

  const safePlaces = useMemo(() => {
    return hazardService.getSafePlaces(customLocalData?.safePlaces);
  }, [customLocalData]);

  // Counts for layer menu
  const layerCounts = useMemo(() => {
    return {
      hazards: activeHazards.length,
      shelters: safePlaces.filter((p) => p.category === 'shelter').length,
      hospitals: safePlaces.filter((p) => p.category === 'hospital').length,
      blockedRoads: blockedRoads.length,
      reliefCamps: safePlaces.filter((p) => p.category === 'relief_camp').length,
    };
  }, [activeHazards, safePlaces, blockedRoads]);

  // Filtered lists based on search
  const filteredHazards = useMemo(() => {
    if (!searchQuery.trim()) return activeHazards;
    const q = searchQuery.toLowerCase();
    return activeHazards.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.location.address.toLowerCase().includes(q)
    );
  }, [activeHazards, searchQuery]);

  const filteredSafePlaces = useMemo(() => {
    if (!searchQuery.trim()) return safePlaces;
    const q = searchQuery.toLowerCase();
    return safePlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q)
    );
  }, [safePlaces, searchQuery]);

  const filteredBlockedRoads = useMemo(() => {
    if (!searchQuery.trim()) return blockedRoads;
    const q = searchQuery.toLowerCase();
    return blockedRoads.filter(
      (r) =>
        r.roadName.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }, [blockedRoads, searchQuery]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter as L.LatLngTuple,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      maxBoundsViscosity: 0.8,
    });

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    // Resize observer to handle dynamic layout / container resizes cleanly
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [initialCenter, initialZoom]);

  // 2. Handle Dynamic Tile Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
      currentTileLayerRef.current = null;
    }

    const tileConfigs = mapService.getTileStyles();
    const currentConfig = tileConfigs[mapTileStyle] || tileConfigs.tactical_dark;

    const newTileLayer = L.tileLayer(currentConfig.url, {
      maxZoom: currentConfig.maxZoom,
      attribution: currentConfig.attribution,
      className: currentConfig.className || '',
    });

    newTileLayer.addTo(map);
    currentTileLayerRef.current = newTileLayer;
  }, [mapTileStyle]);

  // 3. Handle External FlyTo Trigger (from AppContext)
  useEffect(() => {
    if (!flyToTarget || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(
      [flyToTarget.lat, flyToTarget.lng],
      flyToTarget.zoom || 15,
      {
        animate: true,
        duration: 1.2,
      }
    );
  }, [flyToTarget]);

  // 4. Update User Marker & GNSS Accuracy Perimeter
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing user marker & circle
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }

    // Accuracy Circle
    if (activeLayers.accuracy_ring && userLocation.accuracyMeters) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: Math.max(15, userLocation.accuracyMeters),
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4',
      });
      circle.addTo(map);
      accuracyCircleRef.current = circle;
    }

    // Pulsing Tactical User Beacon
    const userLocationIcon = L.divIcon({
      className: 'custom-user-beacon',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(14, 165, 233, 0.3); border: 1.5px solid rgba(14, 165, 233, 0.85); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #0284c7; border: 2px solid #ffffff; box-shadow: 0 0 12px rgba(14, 165, 233, 1);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userLocationIcon,
      zIndexOffset: 2000,
    });

    marker.bindTooltip(
      `<div style="font-family: monospace; font-size: 11px; padding: 2px 6px;">
        <b style="color: #38bdf8;">YOUR POSITION</b> (${userLocation.source.toUpperCase()})<br/>
        <span style="color: #9ca3af;">Accuracy: ±${userLocation.accuracyMeters}m</span>
      </div>`,
      { permanent: false, direction: 'top', className: 'tactical-tooltip' }
    );

    marker.addTo(map);
    userMarkerRef.current = marker;
  }, [userLocation, activeLayers.accuracy_ring]);

  // 5. Render Map Features (Hazards, Safe Places, Blocked Roads)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Blocked Roads
    if (activeLayers.blocked_roads) {
      filteredBlockedRoads.forEach((road) => {
        const polyline = L.polyline(road.coordinates, {
          color: road.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          weight: 6,
          dashArray: '8, 8',
          opacity: 0.9,
        });

        polyline.bindTooltip(
          `<div style="font-family: monospace; padding: 4px; font-size: 11px;">
            <b style="color: #ef4444;">[CORRIDOR CLOSURE]</b><br/>
            ${road.roadName}<br/>
            <span style="color: #9ca3af;">${road.reason}</span>
          </div>`,
          { sticky: true, className: 'tactical-tooltip' }
        );

        polyline.on('click', () => {
          setSelectedMapItem(road);
        });

        polyline.addTo(group);
      });
    }

    // 2. Active Hazards
    if (activeLayers.hazards) {
      filteredHazards.forEach((hazard) => {
        // Cordon / blast zone circle
        const circle = L.circle([hazard.location.lat, hazard.location.lng], {
          radius: hazard.affectedRadiusMeters,
          color: hazard.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillColor: hazard.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '3, 3',
        });
        circle.addTo(group);

        const markerColor =
          hazard.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b';

        const hazardIcon = L.divIcon({
          className: 'custom-hazard-marker',
          html: `
            <div style="width: 28px; height: 28px; border-radius: 8px; background: #171717; border: 2px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.6); cursor: pointer;">
              <span style="color: ${markerColor}; font-size: 13px; font-weight: bold; line-height: 1;">▲</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([hazard.location.lat, hazard.location.lng], {
          icon: hazardIcon,
        });

        marker.bindTooltip(
          `<div style="font-family: monospace; padding: 4px; font-size: 11px;">
            <b style="color: ${markerColor};">[${hazard.severity}] ${hazard.title}</b><br/>
            <span>${hazard.location.address}</span><br/>
            <span style="color: #9ca3af;">Perimeter: ${hazard.affectedRadiusMeters}m</span>
          </div>`,
          { direction: 'top', className: 'tactical-tooltip' }
        );

        marker.on('click', () => {
          setSelectedMapItem(hazard);
        });

        marker.addTo(group);
      });
    }

    // 3. Safe Places (Shelters, Hospitals, Relief Camps)
    filteredSafePlaces.forEach((place) => {
      const isShelter = place.category === 'shelter' && activeLayers.shelters;
      const isHospital = place.category === 'hospital' && activeLayers.hospitals;
      const isReliefCamp = place.category === 'relief_camp' && activeLayers.relief_camps;

      if (!isShelter && !isHospital && !isReliefCamp) return;

      let iconBg = '#10b981';
      let iconSymbol = '🛡';
      if (place.category === 'hospital') {
        iconBg = '#0ea5e9';
        iconSymbol = '✚';
      } else if (place.category === 'relief_camp') {
        iconBg = '#a855f7';
        iconSymbol = '⛺';
      }

      const safeIcon = L.divIcon({
        className: 'custom-safe-marker',
        html: `
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #171717; border: 2px solid ${iconBg}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.6); cursor: pointer;">
            <span style="color: ${iconBg}; font-size: 13px; font-weight: bold; line-height: 1;">${iconSymbol}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([place.location.lat, place.location.lng], {
        icon: safeIcon,
      });

      marker.bindTooltip(
        `<div style="font-family: monospace; padding: 4px; font-size: 11px;">
          <b style="color: ${iconBg};">${place.name}</b><br/>
          <span>${place.location.address}</span><br/>
          <span style="color: #9ca3af;">${place.open24x7 ? 'Open 24/7' : 'Standard Operating'}</span>
        </div>`,
        { direction: 'top', className: 'tactical-tooltip' }
      );

      marker.on('click', () => {
        setSelectedMapItem(place);
      });

      marker.addTo(group);
    });
  }, [
    activeLayers,
    filteredHazards,
    filteredSafePlaces,
    filteredBlockedRoads,
    setSelectedMapItem,
  ]);

  // Map Controls Callbacks
  const handleLocateMe = useCallback(async () => {
    if (gpsStatus !== 'AVAILABLE') {
      await requestGpsPermission();
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [gpsStatus, requestGpsPermission, userLocation]);

  const handleResetSector = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(activeSector.center, activeSector.zoom, {
      animate: true,
      duration: 1.2,
    });
    showToast(`Focused on: ${activeSector.name}`);
  }, [activeSector, showToast]);

  const handleFitBounds = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const coords: [number, number][] = [
      [userLocation.lat, userLocation.lng],
      ...filteredHazards.map((h) => [h.location.lat, h.location.lng] as [number, number]),
      ...filteredSafePlaces.map((s) => [s.location.lat, s.location.lng] as [number, number]),
    ];

    if (coords.length > 1) {
      const bounds = mapService.calculateBounds(coords);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
      showToast('Framed all active operational assets');
    }
  }, [userLocation, filteredHazards, filteredSafePlaces, showToast]);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleSelectSector = useCallback(
    (sector: (typeof OPERATIONAL_SECTORS)[0]) => {
      setActiveSector(sector);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(sector.center, sector.zoom, {
          animate: true,
          duration: 1.2,
        });
      }
      showToast(`Operational Grid Switched: ${sector.name}`);
    },
    [setActiveSector, showToast]
  );

  return (
    <div
      id="nivara-map-wrapper"
      className={`relative overflow-hidden select-none ${className}`}
    >
      {/* 1. Leaflet Canvas Root */}
      <div
        ref={mapContainerRef}
        id="nivara-leaflet-map"
        className="w-full h-full bg-neutral-950"
      />

      {/* 2. Top-Left: Operational Telemetry & Sector Badge */}
      <div
        id="map-top-left-telemetry"
        className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none"
      >
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-[#0B101C]/90 backdrop-blur-xl border border-white/[0.1] shadow-xl flex items-center gap-2">
            <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            </span>
            <span className="font-display font-bold text-xs text-white tracking-wide">
              {activeSector.name}
            </span>
            <span className="text-[10px] font-display font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
              OPS GRID
            </span>
          </div>
        </div>

        <div className="text-[10px] font-display font-medium text-neutral-300 px-3 py-1 rounded-full bg-[#0B101C]/85 backdrop-blur-xl border border-white/[0.08] w-fit pointer-events-auto flex items-center gap-2 shadow-lg">
          <span className="text-sky-300 flex items-center gap-1 font-semibold">
            <MapPin className="w-3 h-3 text-sky-400" />
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 uppercase tracking-wider">{userLocation.source}</span>
          {isWatchingLocation && (
            <span className="text-emerald-300 font-bold flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
            </span>
          )}
        </div>
      </div>

      {/* 3. Top-Right: Search Bar & Layer Controls */}
      <div
        id="map-top-right-bar"
        className="absolute top-3 right-3 z-10 flex items-center gap-2"
      >
        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hazards, shelters..."
              className="bg-[#0B101C]/90 backdrop-blur-xl border border-white/[0.1] text-xs text-white placeholder-neutral-400 rounded-full pl-9 pr-7 py-2 w-44 sm:w-64 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all font-display shadow-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Layer Menu Dropdown */}
        <MapLayerMenu
          isOpen={isLayerMenuOpen}
          onToggleOpen={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          activeLayers={activeLayers}
          onToggleLayer={toggleLayer}
          tileStyle={mapTileStyle}
          onChangeTileStyle={setMapTileStyle}
          sectors={OPERATIONAL_SECTORS}
          activeSector={activeSector}
          onSelectSector={handleSelectSector}
          counts={layerCounts}
        />
      </div>

      {/* 4. Bottom-Left: Tactical Legend */}
      <MapLegend />

      {/* 5. Bottom-Right: Floating Controls */}
      <MapControls
        onLocateMe={handleLocateMe}
        onResetSector={handleResetSector}
        onFitBounds={handleFitBounds}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isWatchingLocation={isWatchingLocation}
        onToggleWatchLocation={toggleWatchLocation}
        gpsStatus={gpsStatus}
      />

      {/* 6. Tactical Map Inspector Drawer */}
      <MapInspector
        item={selectedMapItem}
        userLocation={userLocation}
        onClose={() => setSelectedMapItem(null)}
        onFocus={(lat, lng) => triggerFlyTo(lat, lng, 16)}
        onToast={showToast}
      />
    </div>
  );
};
