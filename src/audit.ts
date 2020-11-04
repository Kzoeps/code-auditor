import {Team} from './app/team';

export interface Audit {
  id: number;
  Auditee: Team;
  Auditor: Team[];
  dateOfAudit: string;
  status: string;
}
