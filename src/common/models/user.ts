import { PERMISSIONS } from '../constants';
import { Document, DOCUMENT_ACCESS } from './document';

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

export const canWriteToDoc = (user: User, doc?: Document): boolean => {
  return accountHasDocAccess(user.account, DOCUMENT_ACCESS.WRITE, doc);
};

export const canReadDoc = (user: User, doc?: Document): boolean => {
  return accountHasDocAccess(user.account, DOCUMENT_ACCESS.READ, doc);
};

export const accountHasDocAccess = (account: string, access: DOCUMENT_ACCESS, doc?: Document): boolean => {
  return !!(
    doc &&
    doc.header &&
    doc.header[access] &&
    Array.isArray(doc.header[access]) &&
    doc.header[access]!.find(
      ac => ac.toLowerCase() === account.toLowerCase(),
    )
  );
};


export const canCreateDocuments = (user: User): boolean => {
  return (
    user.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS)
    && user.schemas.length > 0);
};
