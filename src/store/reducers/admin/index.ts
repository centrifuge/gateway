import { combineReducers } from 'redux';

import {
  getAllAccountsAction,
} from '../../actions/admin';
import { httpRequestReducer } from '../http-request-reducer';
import {AccountGetAllAccountResponse} from "../../../../clients/centrifuge-node";

const get = httpRequestReducer<AccountGetAllAccountResponse>(getAllAccountsAction);

export default combineReducers({ get });