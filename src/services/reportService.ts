import { HazardReport, HazardType, RiskLevel } from '../types';

export interface SubmitReportInput {
  type: HazardType;
  title: string;
  description: string;
  severity: RiskLevel;
  lat: number;
  lng: number;
  locationDescription: string;
}

export interface IReportService {
  isBackendConnected: boolean;
  getRecentReports(): HazardReport[];
  submitReport(input: SubmitReportInput): Promise<HazardReport>;
  getAuthorityDisclaimer(): string;
}

class ReportServiceImpl implements IReportService {
  // Explicit honesty flag
  readonly isBackendConnected = false;

  private localReports: HazardReport[] = [
    {
      id: 'rep-kol-01',
      type: 'flooded_road',
      title: 'Waterlogging up to 2.5 feet',
      description: 'Strand Road near Babu Ghat completely submerged after tidal surge. Sedans unable to cross.',
      severity: 'WARNING',
      lat: 22.5684,
      lng: 88.3415,
      locationDescription: 'Strand Road, Babu Ghat area',
      timestamp: Date.now() - 1000 * 60 * 45, // 45m ago
      reportedBy: 'Volunteer Patrol (Field Unit 3)',
      isDemo: true,
    },
    {
      id: 'rep-kol-02',
      type: 'fallen_tree',
      title: 'Banyan tree fallen across lanes',
      description: 'Major tree blocking both north-bound lanes of EM Bypass near Science City. Traffic diverted.',
      severity: 'CAUTION',
      lat: 22.5395,
      lng: 88.3962,
      locationDescription: 'EM Bypass near Science City junction',
      timestamp: Date.now() - 1000 * 60 * 90, // 1.5h ago
      reportedBy: 'Civil Defense Scout',
      isDemo: true,
    },
    {
      id: 'rep-kol-03',
      type: 'damaged_bridge',
      title: 'Structural barrier shift on flyover ramp',
      description: 'Precautionary closure on southern access ramp. Inspection teams deployed.',
      severity: 'CRITICAL',
      lat: 22.5851,
      lng: 88.3468,
      locationDescription: 'Howrah Approach Road, North Ramp',
      timestamp: Date.now() - 1000 * 60 * 180, // 3h ago
      reportedBy: 'Traffic Wardens Division',
      isDemo: true,
    }
  ];

  getRecentReports(): HazardReport[] {
    return [...this.localReports];
  }

  async submitReport(input: SubmitReportInput): Promise<HazardReport> {
    // Simulate brief client-side processing
    await new Promise(r => setTimeout(r, 450));
    const newReport: HazardReport = {
      id: `rep-${Date.now()}`,
      ...input,
      timestamp: Date.now(),
      reportedBy: 'You (Local Session)',
      isDemo: true,
    };
    this.localReports.unshift(newReport);
    return newReport;
  }

  getAuthorityDisclaimer(): string {
    return 'Phase 1 Foundation: Reports are captured in your local session and shared with in-memory map state. Automated verification and municipal authority dispatch will activate in Phase 9.';
  }
}

export const reportService = new ReportServiceImpl();
