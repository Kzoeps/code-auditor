import {User} from './user';

export interface Team {
  id: number;
  teamName: string;
  dateEstd: string;
  teamLead: User;
  teamMembers: string;
}

