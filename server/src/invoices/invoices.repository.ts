import { DatabaseProvider } from '../database/database.providers';
import { DatabaseRepository } from '../database/database.repository';
import { Invoice } from './interfaces/invoice';
import { tokens as databaseTokens } from '../database/database.constants';
import { tokens as invoicesTokens } from '../invoices/invoices.constants';

export const invoicesRepository = {
  provide: invoicesTokens.invoicesRepository,
  inject: [databaseTokens.databaseConnectionFactory],
  useFactory: (
    databaseProvider: DatabaseProvider,
  ): DatabaseRepository<Invoice> =>
    new DatabaseRepository(databaseProvider.invoices),
};
