import { getInvoiceAction } from '../../actions/invoices';
import { httpRequestReducer } from '../http-request-reducer';
import { InvoiceInvoiceData } from '../../../clients/centrifuge-node/generated-client';
import { Contact } from '../../common/models/dto/contact';

export interface GetInvoicesInterface extends InvoiceInvoiceData {
  supplier: Contact;
}

export default httpRequestReducer<GetInvoicesInterface>(getInvoiceAction);
