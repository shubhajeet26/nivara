import { UserLocation, GpsStatus } from '../types';

export interface LocationPermissionState {
  status: GpsStatus;
  message: string;
}

export interface ILocationService {
  getCurrentLocation(): Promise<UserLocation>;
  watchLocation(callback: (location: UserLocation) => void): () => void;
  requestPermission(): Promise<LocationPermissionState>;
  getFallbackLocation(): UserLocation;
}

// Default fallback reference coordinates: Kolkata, West Bengal
export const KOLKATA_DEFAULT_LOCATION: UserLocation = {
  lat: 22.5726,
  lng: 88.3639,
  placeName: 'Kolkata, West Bengal',
  accuracyMeters: 25,
  source: 'fallback',
  timestamp: Date.now(),
};

class LocationServiceImpl implements ILocationService {
  private currentWatcherId: number | null = null;

  getFallbackLocation(): UserLocation {
    return { ...KOLKATA_DEFAULT_LOCATION, timestamp: Date.now() };
  }

  async requestPermission(): Promise<LocationPermissionState> {
    if (!('geolocation' in navigator)) {
      return {
        status: 'UNAVAILABLE',
        message: 'Browser does not support geolocation hardware.',
      };
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const queryResult = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (queryResult.state === 'granted') {
          return { status: 'AVAILABLE', message: 'Location access granted.' };
        } else if (queryResult.state === 'denied') {
          return { status: 'DENIED', message: 'Location permission was denied in browser settings.' };
        }
      }
    } catch {
      // Some browsers do not support permissions.query for geolocation
    }

    return {
      status: 'REQUESTING',
      message: 'Awaiting user permission grant.',
    };
  }

  async getCurrentLocation(): Promise<UserLocation> {
    if (!('geolocation' in navigator)) {
      return this.getFallbackLocation();
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy),
            placeName: 'Current Device Position',
            source: 'gps',
            timestamp: position.timestamp || Date.now(),
          });
        },
        () => {
          // If denied or timed out, gracefully return fallback location
          resolve(this.getFallbackLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      );
    });
  }

  watchLocation(callback: (location: UserLocation) => void): () => void {
    if (!('geolocation' in navigator)) {
      callback(this.getFallbackLocation());
      return () => {};
    }

    this.currentWatcherId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
          placeName: 'Live Device GPS',
          source: 'gps',
          timestamp: position.timestamp || Date.now(),
        });
      },
      () => {
        // Fallback gracefully on watcher error
        callback(this.getFallbackLocation());
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (this.currentWatcherId !== null) {
        navigator.geolocation.clearWatch(this.currentWatcherId);
        this.currentWatcherId = null;
      }
    };
  }
}

export const locationService = new LocationServiceImpl();
