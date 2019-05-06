import { combineReducers } from 'redux';

import {
  getAllAccountsAction,
  generateAccountAction,
} from '../../actions/admin';
import { httpRequestReducer } from '../http-request-reducer';
import {AccountAccountData, AccountGetAllAccountResponse} from "../../../../clients/centrifuge-node";

const getAccounts = httpRequestReducer<AccountGetAllAccountResponse>(getAllAccountsAction);
const generateAccount = httpRequestReducer<AccountAccountData>(generateAccountAction)

export default combineReducers({ getAccounts, generateAccount });