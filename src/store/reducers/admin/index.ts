import { combineReducers } from 'redux';

import {
  getAllAccountsAction,
  // createContactAction,
  // updateContactAction,
} from '../../actions/admin';
import { httpRequestReducer } from '../http-request-reducer';
import {AccountGetAllAccountResponse} from "../../../../clients/centrifuge-node";

// const create = httpRequestReducer<Contact>(createContactAction);
const get = httpRequestReducer<AccountGetAllAccountResponse>(getAllAccountsAction);
// const update = httpRequestReducer<Contact>(updateContactAction);

export default combineReducers({ get });