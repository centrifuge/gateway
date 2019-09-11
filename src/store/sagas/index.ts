import { all, fork } from 'redux-saga/effects';
import users from './user';
import notifications from './notifications';


export default function* () {
  yield all([
    fork(users.watchLoginPage),
    fork(users.watchUserRegister),
    fork(users.watchUserInvite),
    fork(users.watchUserUpdate),
    fork(users.watchGetAllUsers),
    fork(notifications.watchCloseAlert),
  ]);
}
