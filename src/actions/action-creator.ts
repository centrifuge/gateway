export type ActionType = {
  pending: string;
  success: string;
  fail: string;
  clear: string;
};

export const actionCreator = (
  { pending, success, fail, clear }: ActionType,
  asyncAction: (...args: any[]) => Promise<any>,
) => ({
  invoke: async dispatch => {
    dispatch({
      type: pending,
    });

    try {
      const result = await asyncAction();
      dispatch({
        type: success,
        payload: result,
      });
    } catch (err) {
      dispatch({
        type: fail,
        payload: err,
      });
    }
  },
  clear: dispatch => dispatch({ type: clear }),
});

export const getActions = (actionType: string): ActionType => ({
  pending: `${actionType}_PENDING`,
  success: `${actionType}_SUCCESS`,
  fail: `${actionType}_ERROR`,
  clear: `${actionType}_CLEAR`,
});
