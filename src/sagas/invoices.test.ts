import { call, fork, put, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
  createInvoice,
  getInvoices,
  watchCreateInvoice,
  watchGetInvoicesPage,
} from './invoices';

import {
  createInvoiceAction,
  getInvoiceAction,
} from '../actions/invoices';

import { Invoice } from '../common/models/dto/invoice';
import { httpClient } from '../http-client';
import routes from '../invoices/routes';

const invoice = new Invoice(1, 'mickey', 'goofy', 'created');

describe('watchGetInvoicesPage', () => {
  it('should call getInvoices', function() {
    const gen = watchGetInvoicesPage();

    const onGetInvoiceAction = gen.next().value;
    expect(onGetInvoiceAction).toEqual(take(getInvoiceAction.start));

    const getInvoicesInvocation = gen.next().value;
    expect(getInvoicesInvocation).toEqual(fork(getInvoices));
  });
});

describe('watchCreateInvoice', () => {
  it('should call createInvoice and go back on success', function() {
    const gen = watchCreateInvoice();

    const onGetInvoiceAction = gen.next().value;
    expect(onGetInvoiceAction).toEqual(take(createInvoiceAction.start));

    const getInvoicesInvocation = gen.next({
      type: createInvoiceAction.start,
      invoice,
    }).value;
    expect(getInvoicesInvocation).toEqual(fork(createInvoice, invoice));

    const onSuccess = gen.next().value;
    expect(onSuccess).toEqual(take(createInvoiceAction.success));

    const goBackInvocation = gen.next().value;
    expect(goBackInvocation).toEqual(put(push(routes.index)));
  });
});

describe('getInvoices', () => {
  it('should call the http client on success', function() {
    const gen = getInvoices();

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(call(httpClient.invoices.read));

    const successResponse = gen.next({ data: invoice }).value;
    expect(successResponse).toEqual(
      put({
        type: getInvoiceAction.success,
        payload: invoice,
      }),
    );
  });

  it('should set error on exception', function() {
    const gen = getInvoices();

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(call(httpClient.invoices.read));

    const error = new Error('Oh, no, something broke!');
    const errorResponse = gen.throw && gen.throw(error).value;
    expect(errorResponse).toEqual(
      put({
        type: getInvoiceAction.fail,
        payload: error,
      }),
    );
  });
});

describe('createInvoice', () => {
  it('should call the http client on success', function() {
    const gen = createInvoice(invoice);

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(
      call(httpClient.invoices.create, invoice),
    );

    const successResponse = gen.next({ data: invoice }).value;
    expect(successResponse).toEqual(
      put({
        type: createInvoiceAction.success,
        payload: invoice,
      }),
    );
  });

  it('should set error on exception', function() {
    const gen = createInvoice(invoice);

    const invocationResponse = gen.next().value;
    expect(invocationResponse).toEqual(
      call(httpClient.invoices.create, invoice),
    );

    const error = new Error('Oh, no, something broke!');
    const errorResponse = gen.throw && gen.throw(error).value;
    expect(errorResponse).toEqual(
      put({
        type: createInvoiceAction.fail,
        payload: error,
      }),
    );
  });
});
