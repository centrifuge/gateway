import { client } from '../../client';
import { actionCreator, getActions } from '../action-creator';

const BASE_TYPE = 'GET_INVOICE_ACTION';

export const ACTION_TYPES = getActions(BASE_TYPE);

export const getInvoices = actionCreator(
  ACTION_TYPES,
  () => client.invoices.read(),
);
