import { getInvoiceActionTypes } from '../../actions/invoices';
import { httpRequestReducer } from '../http-request-reducer';
import { InvoiceInvoiceData } from 'centrifuge-node-client';

export default httpRequestReducer<InvoiceInvoiceData[]>(getInvoiceActionTypes);
