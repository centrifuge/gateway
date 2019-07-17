import { PERMISSIONS } from '../constants';
import { Document } from './document';

export interface IUser {
  name: string;
  password?: string;
  email: string;
  _id?: string;
  account: string;
  permissions: PERMISSIONS[];
  schemas?: string[];
  enabled: boolean;
  invited: boolean;
}

export class User implements IUser {
  name: string;
  password?: string = '';
  email: string;
  _id?: string;
  account: string = '';
  permissions: PERMISSIONS[] = [];
  schemas: string[] = [];
  enabled: boolean;
  invited: boolean;
}


export const canWriteToDoc = (user: User, doc: Document): boolean => {
  return !!(
    doc.header &&
    doc.header.write_access &&
    doc.header.write_access.find(
      ac => ac.toLowerCase() === user.account.toLowerCase(),
    )
  );
};

export const canReadDoc = (user: User, doc: Document): boolean => {
  return !!(
    doc.header &&
    doc.header.read_access &&
    doc.header.read_access.find(
      ac => ac.toLowerCase() === user.account.toLowerCase(),
    )
  );
};

export const canCreateDocuments = (user: User): boolean => {
  return (
    user.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS)
    && user.schemas.length > 0);
};
