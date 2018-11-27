import * as Nedb from 'nedb';
import { tokens } from './database.constants';
import { User } from '../../../src/common/models/dto/user';

export interface DatabaseProvider {
  invoices: Nedb;
  users: Nedb;
}

const testUser = new User('test', 'test');

export const databaseConnectionFactory = {
  provide: tokens.databaseConnectionFactory,
  useFactory: async (): Promise<DatabaseProvider> => {
    const databaseConnections = {} as DatabaseProvider;

    databaseConnections.invoices = new Nedb();
    await databaseConnections.invoices.loadDatabase();

    databaseConnections.users = new Nedb();
    await databaseConnections.users.loadDatabase();
    await databaseConnections.users.insert(testUser);

    return databaseConnections;
  },
};
