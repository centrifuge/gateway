import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import invoices from './invoices';
import user from './user';
import contacts from './contacts';
import admin from './admin';

export default history =>
  combineReducers({
    router: connectRouter(history),
    invoices,
    user,
    contacts,
    admin
  });
