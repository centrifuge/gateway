import { ActionType } from '../actions/action-creator';
import { AxiosResponse } from 'axios';

export function requestReducer<T>(actionType: ActionType) {
  return (
    state = {},
    { type, payload }: { type: string; payload: AxiosResponse<T[] | Error> },
  ) => {
    switch (type) {
      case actionType.success:
      case actionType.fail: {
        return {
          data: payload.data,
        };
      }
      case actionType.clear: {
        return {
          data: null,
        };
      }
      default: {
        return state;
      }
    }
  };
}
