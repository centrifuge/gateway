import { call, put, takeEvery } from 'redux-saga/effects';
import { httpClient } from '../../http-client';
import {
  getAllAccountsAction,
} from '../actions/admin';

export function* getAllAccounts() {
  try {
    const response = yield call(httpClient.accounts.read);
    yield put({
      type: getAllAccountsAction.success,
      payload: response.data.data,
    });
  } catch (e) {
    yield put({ type: getAllAccountsAction.fail, payload: e });
  }
}


export default {
  watchGetAccountsPage: () => takeEvery(getAllAccountsAction.start, getAllAccounts),
};