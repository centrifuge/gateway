import { all, fork } from 'redux-saga/effects';
import invoices from './invoices';
import users from './user';
import contacts from './contacts';
import purchaseOrders from './purchase-orders';

export default function*() {
  yield all([
    fork(invoices.watchGetInvoicesPage),
    fork(invoices.watchCreateInvoice),
    fork(users.watchLoginPage),
    fork(contacts.watchGetContactsPage),
    fork(contacts.watchCreateContact),
    fork(purchaseOrders.watchCreatePurchaseOrder),
    fork(purchaseOrders.watchUpdatePurchaseOrder),
    fork(purchaseOrders.watchGetPurchaseOrdersPage),
    fork(purchaseOrders.watchGetPurchaseOrderById),
  ]);
}
