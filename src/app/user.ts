import {Team} from './team';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  leadOnTeams: string[];
  memberOnTeams: string[];
  admin: boolean;
  approved: boolean;
  loggedIn: boolean;
}
