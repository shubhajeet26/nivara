import { OfflinePackage } from '../types';

export interface IOfflineService {
  getActivePackage(): Promise<OfflinePackage>;
  verifyPackageIntegrity(packageId: string): Promise<{ valid: boolean; verifiedTiles: number; message: string }>;
  simulateSyncPackage(packageId: string): Promise<OfflinePackage>;
  isStorageSupported(): boolean;
}

class OfflineServiceImpl implements IOfflineService {
  private currentPackage: OfflinePackage = {
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
  };

  async getActivePackage(): Promise<OfflinePackage> {
    return { ...this.currentPackage };
  }

  async verifyPackageIntegrity(_packageId: string): Promise<{ valid: boolean; verifiedTiles: number; message: string }> {
    // Simulated checksum & sqlite/indexedDB verification
    await new Promise(r => setTimeout(r, 600));
    return {
      valid: true,
      verifiedTiles: 4120,
      message: 'All local map tiles and geospatial safety indexes verified (SHA-256 intact).',
    };
  }

  async simulateSyncPackage(_packageId: string): Promise<OfflinePackage> {
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date();
    this.currentPackage = {
      ...this.currentPackage,
      status: 'READY',
      lastSynchronized: `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
    };
    return { ...this.currentPackage };
  }

  isStorageSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }
}

export const offlineService = new OfflineServiceImpl();
