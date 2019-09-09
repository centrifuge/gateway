import { all, fork } from 'redux-saga/effects';
import users from './user';
import contacts from './contacts';

import notifications from './notifications';
import schemas from "./schemas";
import documents from "./documents";

export default function* () {
  yield all([
    fork(users.watchLoginPage),
    fork(users.watchUserRegister),
    fork(users.watchUserInvite),
    fork(users.watchUserUpdate),
    fork(users.watchGetAllUsers),
    fork(contacts.watchGetContactsPage),
    fork(contacts.watchCreateContact),
    fork(contacts.watchUpdateContact),
    fork(schemas.watchCreateSchema),
    fork(schemas.watchGetSchema),
    fork(schemas.watchGetSchemasList),
    fork(schemas.watchUpdateSchema),
    fork(schemas.watchArchiveSchema),
    fork(documents.watchCreateDocument),
    fork(documents.watchGetDocumentById),
    fork(documents.watchGetDocuments),
    fork(documents.watchUpdateDocument),
    fork(documents.watchMintNftForDocument),
    fork(notifications.watchCloseAlert),
  ]);
}
