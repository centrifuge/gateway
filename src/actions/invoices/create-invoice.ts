import { Invoice } from '../../common/models/dto/invoice';
import { client } from '../../client';
import { actionCreator, getActions } from '../action-creator';

const BASE_TYPE = 'CREATE_INVOICE_ACTION';

export const ACTION_TYPES = getActions(BASE_TYPE);

export const createInvoice = actionCreator(
  ACTION_TYPES,
  (invoice: Invoice) => client.invoices.create(invoice),
);
