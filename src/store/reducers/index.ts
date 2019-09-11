import { combineReducers } from 'redux';
import user from './user';


import notifications from './notifications';

export default history =>
  combineReducers({
    user,
    notifications,
  });
