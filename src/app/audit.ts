import {Team} from './team';
import {Memo} from './memo';

export interface Audit {
  id: number;
  Auditee: Team;
  Auditor: Team[];
  dateOfAudit: string;
  status: string;
  memo: Memo;
}
