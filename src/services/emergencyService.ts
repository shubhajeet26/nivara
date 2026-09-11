import { EmergencyContact } from '../types';

export interface IEmergencyService {
  isLiveDispatchImplemented: boolean;
  getStaticEmergencyContacts(): EmergencyContact[];
  getDisclaimer(): string;
  triggerLocalSignal(): void;
}

class EmergencyServiceImpl implements IEmergencyService {
  // Explicit flag: live SOS delivery to external emergency authorities is Phase 8
  readonly isLiveDispatchImplemented = false;

  getStaticEmergencyContacts(): EmergencyContact[] {
    return [
      {
        id: '1',
        name: 'National Emergency Helpline',
        role: 'Police / Fire / Medical Combined',
        phone: '112',
        type: 'national',
        availableOffline: true,
      },
      {
        id: '2',
        name: 'NDRF Disaster Helpline',
        role: 'National Disaster Response Force HQ',
        phone: '1078',
        type: 'national',
        availableOffline: true,
      },
      {
        id: '3',
        name: 'West Bengal State Disaster Control Room',
        role: 'State Emergency Operations Center (SEOC)',
        phone: '1070',
        type: 'state',
        availableOffline: true,
      },
      {
        id: '4',
        name: 'Kolkata Police Disaster Control',
        role: 'Lalbazar Disaster Management Group',
        phone: '033-2214-3024',
        type: 'local',
        availableOffline: true,
      },
      {
        id: '5',
        name: 'Medical Emergency Services (Ambulance)',
        role: 'Emergency Medical Dispatch',
        phone: '108',
        type: 'national',
        availableOffline: true,
      },
      {
        id: '6',
        name: 'Fire & Rescue Control Room',
        role: 'West Bengal Fire & Emergency Services',
        phone: '101',
        type: 'state',
        availableOffline: true,
      },
    ];
  }

  getDisclaimer(): string {
    return 'Emergency authority dispatch and automated satellite/SMS distress broadcast will be activated in Phase 8. Cellular voice lines (112 / 1078) remain directly dialable from any phone.';
  }

  triggerLocalSignal(): void {
    // Local screen visual alert beacon trigger (high-contrast screen pulsing)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {
        // Ignore if restricted
      }
    }
  }
}

export const emergencyService = new EmergencyServiceImpl();
