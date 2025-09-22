export interface AuditLog {
  id: number;
  createdAt: Date;
  userId?: number;
  contextId?: number;
  profileId?: number;
  action: string; // e.g. "profile_update", "role_change", "gdpr_export"
  target?: string;
  message?: string;
  before?: any;
  after?: any;
}
