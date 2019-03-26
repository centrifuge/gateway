import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ROUTES } from '../../../src/common/constants';
import { NotificationNotificationMessage } from '../../../clients/centrifuge-node/generated-client';
import { tokens } from '../centrifuge-client/centrifuge.constants';
import { tokens as databaseTokens } from '../database/database.constants';
import { DatabaseProvider } from '../database/database.providers';
import config from '../config';
import { CentrifugeClient } from '../centrifuge-client/centrifuge.interfaces';

export const documentTypes = {
  invoice:
    'http://github.com/centrifuge/centrifuge-protobufs/invoice/#invoice.InvoiceData',
  purchaseOrder:
    'http://github.com/centrifuge/centrifuge-protobufs/purchaseorder/#purchaseorder.PurchaseOrderData',
};

export const eventTypes = {
  success: 1,
  error: 0,
};

@Controller(ROUTES.WEBHOOKS)
export class WebhooksController {
  constructor(
    @Inject(tokens.centrifugeClientFactory)
    private readonly centrifugeClient: CentrifugeClient,
    @Inject(databaseTokens.databaseConnectionFactory)
    private readonly databaseService: DatabaseProvider,
  ) {}

  /**
   * Webhook endpoint for processing notifications from the centrifuge node.
   * Currently using ts-ignore due to casing issue with swagger definitions.
   * @param notification NotificationNotificationMessage - received notification
   */
  @Post()
  async receiveMessage(@Body() notification: NotificationNotificationMessage) {
    if (notification.event_type === eventTypes.success) {
      if (notification.document_type === documentTypes.invoice) {
        const result = await this.centrifugeClient.documents.get(
          notification.document_id,
          config.admin.account,
        );
        await this.databaseService.invoices.insert(result);
      } else if (notification.document_type === documentTypes.purchaseOrder) {
        const result = await this.centrifugeClient.documents.get_3(
          notification.document_id,
          config.admin.account,
        );
        await this.databaseService.purchaseOrders.insert(result);
      }
    }

    return 'OK';
  }
}
