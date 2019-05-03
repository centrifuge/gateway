import { getActions } from './action-type-generator';

const GET_ALL_ACCOUNTS_BASE_TYPE = 'GET_ALL_ACCOUNTS_ACTION';
const GENERATE_NEW_ACCOUNT_BASE_TYPE = 'NEW_ACCOUNT_ACTION';

export const getAllAccountsAction = getActions(GET_ALL_ACCOUNTS_BASE_TYPE);
export const generateNewAccountAction = getActions(GENERATE_NEW_ACCOUNT_BASE_TYPE);

function action(type, payload = {}) {
  return { type, ...payload };
}

export const getAllAccounts = () => action(getAllAccountsAction.start);
export const generateNewAccount = () => action(generateNewAccountAction.start);
export const resetGenerateNewAccount = () => action(generateNewAccountAction.reset);
export const resetGetAllAccounts = () => action(getAllAccountsAction.reset);
