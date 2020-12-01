import {User} from './user';

export interface Memo {
  description: string;
  assignedTo: User[];
}
