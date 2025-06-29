import { py } from './bridge/multimind-bridge';

export interface ComplianceConfig {
  organizationId: string;
  enabledRegulations: string[];
  privacyLevel: 'basic' | 'enhanced' | 'enterprise';
  auditEnabled: boolean;
  realTimeMonitoring: boolean;
  alertThresholds?: AlertThresholds;
}

export interface AlertThresholds {
  dataBreachRisk: number;
  privacyViolationRisk: number;
  complianceScore: number;
}

export interface ComplianceCheck {
  modelId: string;
  dataCategories: string[];
  useCase: string;
  region?: string;
  customRules?: Record<string, any>;
}

export interface ComplianceResult {
  compliant: boolean;
  score: number;
  violations: string[];
  recommendations: string[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  userId: string;
  details: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardMetrics {
  timeRange: string;
  useCase: string;
  complianceScore: number;
  totalChecks: number;
  violations: number;
  alerts: number;
  trends: TrendData[];
}

export interface TrendData {
  date: string;
  score: number;
  violations: number;
}

export class ComplianceMonitor {
  private monitor: any;
  private validator: any;
  private reporter: any;
  private config: ComplianceConfig;

  constructor(config: ComplianceConfig) {
    this.config = config;
  }

  async initialize() {
    try {
      this.monitor = await py`ComplianceMonitor(
        organization_id=${this.config.organizationId},
        enabled_regulations=${this.config.enabledRegulations},
        privacy_level=${this.config.privacyLevel},
        audit_enabled=${this.config.auditEnabled},
        real_time_monitoring=${this.config.realTimeMonitoring},
        alert_thresholds=${this.config.alertThresholds || {}}
      )`;

      this.validator = await py`ComplianceValidator()`;
      this.reporter = await py`ComplianceReporter()`;

      return { success: true, message: 'Compliance monitor initialized' };
    } catch (error) {
      console.error('Error initializing compliance monitor:', error);
      throw error;
    }
  }

  async checkCompliance(check: ComplianceCheck): Promise<ComplianceResult> {
    try {
      const result = await py`self.monitor.check_compliance(
        model_id=${check.modelId},
        data_categories=${check.dataCategories},
        use_case=${check.useCase},
        region=${check.region || 'global'},
        custom_rules=${check.customRules || {}}
      )`;

      return {
        compliant: result.compliant,
        score: result.score,
        violations: result.violations || [],
        recommendations: result.recommendations || [],
        auditTrail: result.audit_trail || []
      };
    } catch (error) {
      console.error('Error checking compliance:', error);
      throw error;
    }
  }

  async validateData(data: any, dataType: string): Promise<boolean> {
    try {
      const isValid = await py`self.validator.validate_data(${data}, ${dataType})`;
      return isValid;
    } catch (error) {
      console.error('Error validating data:', error);
      throw error;
    }
  }

  async getDashboardMetrics(metrics: Partial<DashboardMetrics>): Promise<DashboardMetrics> {
    try {
      const dashboard = await py`self.monitor.get_dashboard_metrics(
        time_range=${metrics.timeRange || '7d'},
        use_case=${metrics.useCase || 'general'},
        organization_id=${this.config.organizationId}
      )`;

      return {
        timeRange: dashboard.time_range,
        useCase: dashboard.use_case,
        complianceScore: dashboard.compliance_score,
        totalChecks: dashboard.total_checks,
        violations: dashboard.violations,
        alerts: dashboard.alerts,
        trends: dashboard.trends || []
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  async generateComplianceReport(
    startDate: string,
    endDate: string,
    format: 'pdf' | 'html' | 'json' = 'pdf'
  ) {
    try {
      const report = await py`self.reporter.generate_report(
        organization_id=${this.config.organizationId},
        start_date=${startDate},
        end_date=${endDate},
        format=${format}
      )`;
      return report;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }

  async addAuditEntry(entry: Omit<AuditEntry, 'timestamp'>) {
    try {
      const timestamp = new Date().toISOString();
      await py`self.monitor.add_audit_entry(
        timestamp=${timestamp},
        action=${entry.action},
        user_id=${entry.userId},
        details=${entry.details},
        risk_level=${entry.riskLevel}
      )`;
      return { success: true, message: 'Audit entry added' };
    } catch (error) {
      console.error('Error adding audit entry:', error);
      throw error;
    }
  }

  async getAuditTrail(
    startDate?: string,
    endDate?: string,
    userId?: string,
    riskLevel?: string
  ) {
    try {
      const trail = await py`self.monitor.get_audit_trail(
        start_date=${startDate || null},
        end_date=${endDate || null},
        user_id=${userId || null},
        risk_level=${riskLevel || null}
      )`;
      return trail;
    } catch (error) {
      console.error('Error getting audit trail:', error);
      throw error;
    }
  }

  async setAlertThresholds(thresholds: AlertThresholds) {
    try {
      await py`self.monitor.set_alert_thresholds(${thresholds})`;
      return { success: true, message: 'Alert thresholds updated' };
    } catch (error) {
      console.error('Error setting alert thresholds:', error);
      throw error;
    }
  }

  async getAlerts(timeRange: string = '24h') {
    try {
      const alerts = await py`self.monitor.get_alerts(time_range=${timeRange})`;
      return alerts;
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  async enableRealTimeMonitoring(enabled: boolean = true) {
    try {
      await py`self.monitor.enable_real_time_monitoring(${enabled})`;
      return { success: true, message: `Real-time monitoring ${enabled ? 'enabled' : 'disabled'}` };
    } catch (error) {
      console.error('Error toggling real-time monitoring:', error);
      throw error;
    }
  }

  async validatePrivacyCompliance(data: any, privacyLevel: string) {
    try {
      const result = await py`self.validator.validate_privacy(
        data=${data},
        privacy_level=${privacyLevel}
      )`;
      return result;
    } catch (error) {
      console.error('Error validating privacy compliance:', error);
      throw error;
    }
  }
} 