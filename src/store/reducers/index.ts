import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';


import user from './user';
import contacts from './contacts';

import schemas from './schemas';
import documents from './documents';

import notifications from './notifications';

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    contacts,
    schemas,
    documents,
    notifications,
  });
