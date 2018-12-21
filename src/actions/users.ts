import { getActions } from './action-type-generator';
import { User } from '../common/models/dto/user';

const USER_LOGIN_BASE_TYPE = 'USER_LOGIN_ACTION';
const USER_LOGOUT_BASE_TYPE = 'USER_LOGOUT_ACTION';

export const userLoginAction = getActions(USER_LOGIN_BASE_TYPE);
export const userLogoutAction = getActions(USER_LOGOUT_BASE_TYPE);

function action(type, payload = {}) {
  return { type, ...payload };
}

export const login = (user: User) =>
  action(userLoginAction.start, { user });

export const logout = () => action(userLogoutAction.start);
