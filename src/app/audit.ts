import {Team} from './team';
import {Memo} from './memo';

export interface Audit {
  id: number;
  auditee: Team;
  auditor: Team[];
  auditStartDate: string;
  status: string;
  memo: Memo;
}
