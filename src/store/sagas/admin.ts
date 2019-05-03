import { call, put, takeEvery } from 'redux-saga/effects';
import { httpClient } from '../../http-client';
import {
  getAllAccountsAction,
  generateNewAccountAction
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

export function* generateNewAccount() {
  try {
    const response = yield call(httpClient.accounts.create);
    yield put({
      type: generateNewAccountAction.success,
      payload: response.data,
    });
  } catch (e) {
    yield put({ type: generateNewAccountAction.fail, payload: e });
  }
}


export default {
  watchGetAccountsPage: () => takeEvery(getAllAccountsAction.start, getAllAccounts),
  watchGenerateNewAccountPage: () => takeEvery(generateNewAccountAction.start, generateNewAccount),
};