import { ROLE } from '../constants';

export interface User {
  username: string;
  password: string;
  _id?: string;
  account?: string;
  permissions: ROLE[];
  enabled: boolean;
  invited: boolean;
}
