import { call, put, takeEvery } from 'redux-saga/effects';
import { httpClient } from '../../http-client';
import {
  addAccountAction,
  getAllAccountsAction,
  updateAccountAction,
} from '../actions/admin';

export function* getAllAccounts() {
  try {
    const response = yield call(httpClient.admin.read);
    yield put({
      type: getAllAccountsAction.success,
      payload: response.data.data,
    });
  } catch (e) {
    yield put({ type: getAllAccountsAction.fail, payload: e });
  }
}

// export function* createContact(action) {
//   try {
//     const { contact } = action;
//     const response = yield call(httpClient.contacts.create, contact);
//     yield put({
//       type: createContactAction.success,
//       payload: response.data,
//     });
//     yield put({
//       type: getContactsAction.start,
//     });
//   } catch (e) {
//     yield put({ type: createContactAction.fail, payload: e });
//   }
// }
//
// export function* updateContact(action) {
//   try {
//     const { contact } = action;
//     const response = yield call(httpClient.contacts.update, contact);
//     yield put({
//       type: updateContactAction.success,
//       payload: response.data,
//     });
//     yield put({
//       type: getContactsAction.start,
//     });
//   } catch (e) {
//     yield put({ type: updateContactAction.fail, payload: e });
//   }
// }

export default {
  watchGetAccountsPage: () => takeEvery(getAllAccountsAction.start, getAllAccounts),
  // watchCreateContact: () => takeEvery(createContactAction.start, createContact),
  // watchUpdateContact: () => takeEvery(updateContactAction.start, updateContact),
};