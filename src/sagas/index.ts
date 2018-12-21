import { all, fork } from 'redux-saga/effects';
import invoices from './invoices';
import users from './user';
import contacts from './contacts';

export default function*() {
  yield all([
    fork(invoices.watchGetInvoicesPage),
    fork(invoices.watchCreateInvoice),
    fork(users.watchLoginPage),
    fork(users.watchLogout),
    fork(contacts.watchGetContactsPage),
    fork(contacts.watchCreateContact),
  ]);
}
