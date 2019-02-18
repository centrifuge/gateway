import * as Nedb from 'nedb';
import { promisify } from 'util';
import { tokens } from './database.constants';
import { User } from '../../../src/common/models/user';
import { DatabaseRepository } from './database.repository';
import {
  InvoiceInvoiceData,
  PurchaseorderPurchaseOrderResponse,
} from '../../../clients/centrifuge-node/generated-client';
import { Contact } from '../../../src/common/models/contact';
import config from '../config';
import {
  InvoiceResponse,
  PurchaseOrderResponse,
} from '../../../src/interfaces';

export interface DatabaseProvider {
  invoices: DatabaseRepository<InvoiceResponse>;
  users: DatabaseRepository<User>;
  contacts: DatabaseRepository<Contact>;
  purchaseOrders: DatabaseRepository<PurchaseOrderResponse>;
}

const testUser: User = {
  username: 'test',
  password: '$2b$12$o7HxJQsEl0jjwZ6FoGiEv.uQs9hLDFo2fOj5S3BnLL4nGpLfy/yW2', // password is test
  enabled: true,
  invited: false,
  permissions: [],
};

const getRepository = async function<T>(path) {
  const nedbInstance = new Nedb({ filename: path });
  await promisify(nedbInstance.loadDatabase.bind(nedbInstance))();
  return new DatabaseRepository<T>(nedbInstance);
};

/**
 * Initialize the database and the separate collections.
 */
const initializeDatabase = async function() {
  const invoicesRepository = await getRepository<InvoiceInvoiceData>(
    `${config.dbPath}/invoicesDb`,
  );

  const usersRepository = await getRepository<User>(`${config.dbPath}/usersDb`);
  const testUserFromDb = await usersRepository.findOne({
    username: testUser.username,
  });

  if (!testUserFromDb) {
    await usersRepository.create(testUser);
  }

  const contactsRepository = await getRepository<Contact>(
    `${config.dbPath}/contactsDb`,
  );

  const purchaseOrdersRepository = await getRepository<
    PurchaseorderPurchaseOrderResponse
  >(`${config.dbPath}/purchaseOrdersDb`);

  return {
    invoices: invoicesRepository,
    users: usersRepository,
    contacts: contactsRepository,
    purchaseOrders: purchaseOrdersRepository,
  };
};

/**
 * Initialize database lock. Used in order to provide a singleton connection to the database.
 */
let initializeDatabasePromise;

export const databaseConnectionFactory = {
  provide: tokens.databaseConnectionFactory,
  useFactory: async (): Promise<DatabaseProvider> => {
    if (!initializeDatabasePromise) {
      initializeDatabasePromise = initializeDatabase();
    }

    return initializeDatabasePromise;
  },
};
