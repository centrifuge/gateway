import { call, fork, put, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { httpClient } from '../http-client';
import {
  createContactActionTypes,
  getContactsActionTypes,
} from '../actions/contacts';
import { Contact } from '../common/models/dto/contact';
import routes from '../contacts/routes';

export function* getContacts() {
  try {
    const response = yield call(httpClient.contacts.read);
    yield put({
      type: getContactsActionTypes.success,
      payload: response.data,
    });
  } catch (e) {
    yield put({ type: getContactsActionTypes.fail, payload: e });
  }
}

export function* createContact(contact: Contact) {
  try {
    const response = yield call(httpClient.contacts.create, contact);
    yield put({
      type: createContactActionTypes.success,
      payload: response.data,
    });
  } catch (e) {
    yield put({ type: createContactActionTypes.fail, payload: e });
  }
}

export function* watchGetContactsPage() {
  while (true) {
    yield take(getContactsActionTypes.start);
    yield fork(getContacts);
  }
}

export function* watchCreateContact() {
  while (true) {
    const { contact } = yield take(createContactActionTypes.start);
    yield fork(createContact, contact);
    yield take(createContactActionTypes.success);
    yield put(push(routes.index));
  }
}

export default {
  watchGetContactsPage,
  watchCreateContact,
};
