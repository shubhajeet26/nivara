import { ConnectivityStatus } from '../types';

export interface SyncHealthReport {
  lastSyncTimestamp: number;
  pendingOfflineChangesCount: number;
  isSyncing: boolean;
  syncProtocol: 'P2P_MESH' | 'CELLULAR_HTTP' | 'LOCAL_CACHE';
  status: 'SYNCHRONIZED' | 'PENDING' | 'OFFLINE_ONLY';
}

export interface ISyncService {
  getSyncHealth(connectivity: ConnectivityStatus): SyncHealthReport;
  triggerManualSync(): Promise<boolean>;
  getPendingQueueLength(): number;
}

class SyncServiceImpl implements ISyncService {
  private lastSync = Date.now() - 1000 * 120; // 2 minutes ago
  private pendingQueue: unknown[] = [];

  getSyncHealth(connectivity: ConnectivityStatus): SyncHealthReport {
    if (connectivity === 'OFFLINE') {
      return {
        lastSyncTimestamp: this.lastSync,
        pendingOfflineChangesCount: this.pendingQueue.length,
        isSyncing: false,
        syncProtocol: 'LOCAL_CACHE',
        status: 'OFFLINE_ONLY',
      };
    }

    return {
      lastSyncTimestamp: this.lastSync,
      pendingOfflineChangesCount: 0,
      isSyncing: false,
      syncProtocol: 'CELLULAR_HTTP',
      status: 'SYNCHRONIZED',
    };
  }

  async triggerManualSync(): Promise<boolean> {
    await new Promise(r => setTimeout(r, 800));
    this.lastSync = Date.now();
    this.pendingQueue = [];
    return true;
  }

  getPendingQueueLength(): number {
    return this.pendingQueue.length;
  }
}

export const syncService = new SyncServiceImpl();
