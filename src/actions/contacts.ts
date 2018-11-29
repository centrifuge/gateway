import { getActions } from './action-type-generator';
import { Contact } from '../common/models/dto/contact';

const CREATE_CONTACT_BASE_TYPE = 'CREATE_CONTACT_ACTION';
const GET_CONTACTS_BASE_TYPE = 'GET_CONTACTS_ACTION';

export const createContactActionTypes = getActions(CREATE_CONTACT_BASE_TYPE);
export const getContactsActionTypes = getActions(GET_CONTACTS_BASE_TYPE);

function action(type, payload = {}) {
  return { type, ...payload };
}

export const createContact = (contact: Contact) =>
  action(createContactActionTypes.start, { contact });
export const getContacts = () => action(getContactsActionTypes.start);
