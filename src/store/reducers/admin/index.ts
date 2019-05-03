import { combineReducers } from 'redux';

import {
  getAllAccountsAction,
  generateNewAccountAction,
} from '../../actions/admin';
import { httpRequestReducer } from '../http-request-reducer';
import {AccountAccountData, AccountGetAllAccountResponse} from "../../../../clients/centrifuge-node";

const getAccounts = httpRequestReducer<AccountGetAllAccountResponse>(getAllAccountsAction);
const generateNewAccount = httpRequestReducer<AccountAccountData>(generateNewAccountAction)

export default combineReducers({ getAccounts, generateNewAccount });