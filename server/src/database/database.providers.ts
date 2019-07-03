import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { User } from '../../../src/common/models/user';
import { DatabaseRepository } from './database.repository';
import { Contact } from '../../../src/common/models/contact';
import { Schema } from '../../../src/common/models/schema';
import config from '../../../src/common/config';
import { InvoiceResponse, PurchaseOrderResponse } from '../../../src/common/interfaces';
import { DatabaseService } from './database.service';

// TODO refactor this in mutiple providers,services


/**
 * Initialize the database and the separate collections.
 */
const initializeDatabase = async (inMemoryOnly:boolean) => {
  const invoicesRepository = new DatabaseRepository<InvoiceResponse>(
    { filename: `${config.dbPath}/invoicesDb`, inMemoryOnly },
  );
  const usersRepository = new DatabaseRepository<User>(
    { filename: `${config.dbPath}/usersDb`, inMemoryOnly },
  );
  const admin: User = {
    name: config.admin.name,
    password: await promisify(bcrypt.hash)(config.admin.password, 10),
    email: config.admin.email,
    enabled: true,
    invited: false,
    account: config.admin.account,
    permissions: config.admin.permissions,
  };

  const userExists = await usersRepository.findOne({
    email: admin.email,
  });

  if (!userExists) {
    await usersRepository.insert(admin);
  }

  const contactsRepository = new DatabaseRepository<Contact>(
    { filename: `${config.dbPath}/contactsDb`, inMemoryOnly },
  );

  const purchaseOrdersRepository = new DatabaseRepository<PurchaseOrderResponse>(
    { filename: `${config.dbPath}/purchaseOrdersDb`, inMemoryOnly },
  );

  const schemasRepository = new DatabaseRepository<Schema>(
      { filename: `${config.dbPath}/schemasDb`, inMemoryOnly },
  );

  return {
    invoices: invoicesRepository,
    users: usersRepository,
    contacts: contactsRepository,
    purchaseOrders: purchaseOrdersRepository,
    schemas: schemasRepository,
  };
};

/**
 * Initialize database lock. Used in order to provide a singleton connection to the database.
 */
let initializeDatabasePromise;


export const databaseServiceProvider = {
  provide: DatabaseService,
  useFactory: async (): Promise<DatabaseService> => {

    const testingMode = process.env.NODE_ENV === 'test';

    if (!initializeDatabasePromise || testingMode) {
      initializeDatabasePromise = initializeDatabase(testingMode);
    }

    return initializeDatabasePromise;
  },
};

