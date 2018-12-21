import {
  userLoginAction,
  userLogoutAction,
} from '../../actions/users';

export type LoginState = {
  loading: boolean;
  hasError?: boolean;
  loggedIn: boolean;
  error?: Error;
};

const defaultState = {
  loading: false,
  hasError: false,
  loggedIn: false,
  error: undefined,
};

const auth = (
  state: LoginState = defaultState,
  { type, payload }: { type: string; payload?: string | Error },
): LoginState => {
  switch (type) {
    case userLoginAction.start:
    case userLogoutAction.start: {
      return { ...state, loading: true };
    }

    case userLoginAction.success: {
      return {
        ...state,
        loggedIn: true,
        loading: false,
      };
    }

    case userLogoutAction.success: {
      return {
        ...state,
        loggedIn: false,
        loading: false,
      };
    }

    case userLoginAction.fail:
    case userLogoutAction.fail: {
      return {
        ...state,
        loading: false,
        hasError: true,
        error: payload as Error,
      };
    }
    default: {
      return state;
    }
  }
};

export default auth;
