import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import user from './user';


import notifications from './notifications';

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    notifications,
  });
