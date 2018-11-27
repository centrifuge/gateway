import axios from 'axios';

// TODO: extract common models and constants in a better place (separate npm module?)
import { Invoice } from '../common/models/dto/invoice';
import { ROUTES } from '../common/constants';

const instance = axios.create();

export const httpClient = {
  invoices: {
    create: async (invoice: Invoice) => instance.post(ROUTES.INVOICES, invoice),
    read: async () => instance.get(ROUTES.INVOICES),
  },
  users: {
    setCredentials: (username, password) =>
      (instance.defaults.auth = { username, password }),
  },
};
