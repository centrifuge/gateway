import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Invoice } from '../../../src/common/models/dto/invoice';
import { ROUTES } from '../../../src/common/constants';
import { SessionGuard } from '../auth/SessionGuard';
import { tokens as clientTokens } from '../centrifuge-client/centrifuge.constants';
import { tokens as databaseTokens } from '../database/database.constants';
import {
  DocumentServiceApi,
  InvoiceInvoiceData,
} from '../../../clients/centrifuge-node/generated-client';
import { DatabaseProvider } from '../database/database.providers';
import { InvoiceData } from '../../../src/interfaces';

@Controller(ROUTES.INVOICES)
@UseGuards(SessionGuard)
export class InvoicesController {
  constructor(
    @Inject(databaseTokens.databaseConnectionFactory)
    private readonly database: DatabaseProvider,
    @Inject(clientTokens.centrifugeClientFactory)
    private readonly centrifugeClient: DocumentServiceApi,
  ) {}

  @Post()
  /**
   * Create an invoice and save in the centrifuge node and the local database
   * @async
   * @param {Invoice} invoice - the body of the request
   * @return {Promise<InvoiceInvoiceResponse>} result
   */
  async create(@Req() request, @Body() invoice: Invoice) {
    const createResult = await this.centrifugeClient.create({
      data: {
        ...invoice,
      },
      collaborators: invoice.collaborators,
    });

    return await this.database.invoices.create({
      ...createResult,
      ownerId: request.user.id,
    });
  }

  @Get()
  /**
   * Get the list of all invoices
   * @async
   * @param {Promise<Invoice[]>} result
   */
  async get(@Req() request): Promise<InvoiceData[]> {
    const invoices = (await this.database.invoices.find({
      ownerId: request.user.id,
    })) as (InvoiceInvoiceData & { _id: string })[];

    return await Promise.all(
      invoices.map(async invoice => {
        const supplier = await this.database.contacts.findOne({
          _id: invoice.sender_name,
        });

        if (supplier) {
          return Object.assign({}, invoice, {
            supplier,
          });
        }

        return invoice;
      }),
    );
  }
}
