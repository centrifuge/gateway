import { Body, Controller, Post } from '@nestjs/common';
import { ROUTES } from '../../../src/common/constants';
import {
  FunFundingListResponse,
  NotificationNotificationMessage,
  UserapiTransferDetailListResponse,
} from '../../../clients/centrifuge-node';
import { DatabaseService } from '../database/database.service';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';
import { InvoiceResponse } from '../../../src/common/interfaces';
import { unflatten } from '../../../src/common/custom-attributes';


// TODO add this in Common package
export enum DocumentTypes {
  INVOICE = 'http://github.com/centrifuge/centrifuge-protobufs/invoice/#invoice.InvoiceData',
  PURCHASE_ORDERS = 'http://github.com/centrifuge/centrifuge-protobufs/purchaseorder/#purchaseorder.PurchaseOrderData',
  GENERIC_DOCUMENT = 'http://github.com/centrifuge/centrifuge-protobufs/generic/#generic.Generic',
};

export enum EventTypes {
  DOCUMENT = 1,
  JOB =  1,
  ERROR = 0,
};

@Controller(ROUTES.WEBHOOKS)
export class WebhooksController {
  constructor(
    private readonly centrifugeService: CentrifugeService,
    private readonly databaseService: DatabaseService,
  ) {
  }

  /**
   * Webhook endpoint for processing notifications from the centrifuge node.
   * Currently using ts-ignore due to casing issue with swagger definitions.
   * @param notification NotificationNotificationMessage - received notification
   */
  @Post()
  // TODO: refactor/rethink to remove code duplication in functionality
  async receiveMessage(@Body() notification: NotificationNotificationMessage) {
    console.log('Receive Webhook', notification);
    try {
      if (notification.event_type === EventTypes.DOCUMENT) {
        // Search for the user in the database
        const user = await this.databaseService.users
          .findOne({ $or: [{ account: notification.to_id.toLowerCase() }, { account: notification.to_id }] });
        if (!user) {
          throw new Error('User is not present in database');
        }

        // Gateways can receive and store invoices
        // TODO this code should be removed when the node does not allow to send invoices
        // anymore
        if (notification.document_type === DocumentTypes.INVOICE) {
          const result = await this.centrifugeService.invoices.getInvoice(
            user.account,
            notification.document_id,
          );

          const invoice: InvoiceResponse = {
            ...result,
            ownerId: user._id,
          };
          if (invoice.attributes) {
            if (invoice.attributes.funding_agreement) {
              const fundingList: FunFundingListResponse = await this.centrifugeService.funding
                .getList(invoice.header.document_id, user.account);
              invoice.fundingAgreement = (fundingList.data ? fundingList.data.shift() : undefined);
            }
            if (invoice.attributes.transfer_details) {
              const transferList: UserapiTransferDetailListResponse = await this.centrifugeService.transfer
                .listTransferDetails(user.account, invoice.header.document_id);
              invoice.transferDetails = (transferList ? transferList.data : undefined);
            }

            // We need to delete the attributes prop because nedb does not allow for . in field names
            delete invoice.attributes;
          }

          await this.databaseService.invoices.update(
            { 'header.document_id': notification.document_id, 'ownerId': user._id },
            invoice,
            { upsert: true },
          );

        } else if (notification.document_type === DocumentTypes.GENERIC_DOCUMENT) {
          const result = await this.centrifugeService.documents.getDocument(
            user.account,
            notification.document_id,
          );

          const unflattenedAttributes = unflatten(result.attributes);
          await this.databaseService.documents.update(
            { 'header.document_id': notification.document_id, 'ownerId': user._id },
            {
              $set: {
                ownerId: user._id,
                header: result.header,
                data: result.data,
                attributes: unflattenedAttributes,
                scheme: result.scheme,
              },
            },
            { upsert: true },
          );
        } else {
          throw new Error(`Document type ${notification.document_type} not supported`);
        }
      }
    } catch (e) {
      throw new Error(`Webhook Error: ${e.message}`);
    }
    return 'OK';
  }
}
