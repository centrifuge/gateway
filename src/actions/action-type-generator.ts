export type ActionType = {
  start: string;
  success: string;
  fail: string;
};

/**
 * Generates action types for asynchronous requests
 * @param actionType - name of the action
 */
export const getActions = (actionType: string): ActionType => ({
  start: `${actionType}`,
  success: `${actionType}_SUCCESS`,
  fail: `${actionType}_ERROR`,
});
