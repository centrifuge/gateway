import { getActions } from './action-type-generator';

const GET_ALL_ACCOUNTS_BASE_TYPE = 'GET_ALL_ACCOUNTS_ACTION';

export const getAllAccountsAction = getActions(GET_ALL_ACCOUNTS_BASE_TYPE);

function action(type, payload = {}) {
  return { type, ...payload };
}

export const getAllAccounts = () => action(getAllAccountsAction.start);
export const resetGetAllAccounts = () => action(getAllAccountsAction.reset);
