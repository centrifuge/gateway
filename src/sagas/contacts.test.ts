import { call, fork, put, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
  createContact,
  getContacts,
  watchCreateContact,
  watchGetContactsPage,
} from './contacts';

import {
  createContactActionTypes,
  getContactsActionTypes,
} from '../actions/contacts';

import { httpClient } from '../http-client';
import routes from '../contacts/routes';
import { Contact } from '../common/models/dto/contact';

const contact = new Contact('alfred', '0xbatman_manor');

describe('watchGetContactsPage', () => {
  it('should call getContacts', function() {
    const gen = watchGetContactsPage();

    const onGetContactsAction = gen.next().value;
    expect(onGetContactsAction).toEqual(take(getContactsActionTypes.start));

    const getContactsInvocation = gen.next().value;
    expect(getContactsInvocation).toEqual(fork(getContacts));
  });
});

describe('watchCreateContact', () => {
  it('should call createContact and go back on success', function() {
    const gen = watchCreateContact();

    const onGetContactsAction = gen.next().value;
    expect(onGetContactsAction).toEqual(take(createContactActionTypes.start));

    const getContactsInvocation = gen.next({
      type: createContactActionTypes.start,
      contact,
    }).value;
    expect(getContactsInvocation).toEqual(fork(createContact, contact));

    const onSuccess = gen.next().value;
    expect(onSuccess).toEqual(take(createContactActionTypes.success));

    const goBackInvocation = gen.next().value;
    expect(goBackInvocation).toEqual(put(push(routes.index)));
  });
});

describe('getContacts', () => {
  it('should call the http client on success', function() {
    const gen = getContacts();

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(call(httpClient.contacts.read));

    const successResponse = gen.next({ data: contact }).value;
    expect(successResponse).toEqual(
      put({
        type: getContactsActionTypes.success,
        payload: contact,
      }),
    );
  });

  it('should set error on exception', function() {
    const gen = getContacts();

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(call(httpClient.contacts.read));

    const error = new Error('Oh, no, something broke!');
    const errorResponse = gen.throw && gen.throw(error).value;
    expect(errorResponse).toEqual(
      put({
        type: getContactsActionTypes.fail,
        payload: error,
      }),
    );
  });
});

describe('createContact', () => {
  it('should call the http client on success', function() {
    const gen = createContact(contact);

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(
      call(httpClient.contacts.create, contact),
    );

    const successResponse = gen.next({ data: contact }).value;
    expect(successResponse).toEqual(
      put({
        type: createContactActionTypes.success,
        payload: contact,
      }),
    );
  });

  it('should set error on exception', function() {
    const gen = createContact(contact);

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(
      call(httpClient.contacts.create, contact),
    );

    const error = new Error('Oh, no, something broke!');
    const errorResponse = gen.throw && gen.throw(error).value;
    expect(errorResponse).toEqual(
      put({
        type: createContactActionTypes.fail,
        payload: error,
      }),
    );
  });
});
