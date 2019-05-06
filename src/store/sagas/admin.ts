import { call, put, takeEvery } from 'redux-saga/effects';
import { httpClient } from '../../http-client';
import {
  getAllAccountsAction,
  generateAccountAction
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

export function* generateAccount() {
  try {
    const response = yield call(httpClient.accounts.create);
    yield put({
      type: generateAccountAction.success,
      payload: response.data,
    });
  } catch (e) {
    yield put({ type: generateAccountAction.fail, payload: e });
  }
}


export default {
  watchGetAccountsPage: () => takeEvery(getAllAccountsAction.start, getAllAccounts),
  watchGenerateAccountPage: () => takeEvery(generateAccountAction.start, generateAccount),
};