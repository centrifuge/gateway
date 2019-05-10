import { PERMISSIONS } from '../constants';

export interface IUser {
  username: string;
  password?: string;
  email: string;
  date_added: Date;
  _id?: string;
  account?: string;
  permissions: PERMISSIONS[];
  enabled: boolean;
  invited: boolean;
}

export class User implements IUser{
  username: string;
  password?: string = "";
  email: string;
  date_added: Date;
  _id?: string;
  account?: string;
  permissions: PERMISSIONS[] = [];
  enabled: boolean;
  invited: boolean;
}
