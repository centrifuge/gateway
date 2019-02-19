import { Test, TestingModule } from '@nestjs/testing';
import {
  documentTypes,
  eventTypes,
  WebhooksController,
} from './webhooks.controller';
import { centrifugeClientFactory } from '../centrifuge-client/centrifuge.client';
import { tokens as clientTokens } from '../centrifuge-client/centrifuge.constants';
import { tokens as databaseTokens } from '../database/database.constants';
import { databaseConnectionFactory } from '../database/database.providers';
import {
  InvoiceInvoiceResponse,
  PurchaseorderPurchaseOrderResponse,
} from '../../../clients/centrifuge-node/generated-client';
import config from '../config';

describe('WebhooksController', () => {
  let webhooksModule: TestingModule;
  const databaseServiceMock = {
    invoices: {
      create: jest.fn(data => data),
    },
    purchaseOrders: {
      create: jest.fn(data => data),
    },
  };

  const documentId = '112233';

  const getResponse = {
    data: {},
    header: {
      document_id: documentId,
    },
  };

  const centrifugeClient = {
    documents: {
      get: jest.fn((): InvoiceInvoiceResponse => getResponse),
      get_3: jest.fn((): PurchaseorderPurchaseOrderResponse => getResponse),
    },
  };

  beforeEach(async () => {
    webhooksModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [databaseConnectionFactory, centrifugeClientFactory],
    })
      .overrideProvider(databaseTokens.databaseConnectionFactory)
      .useValue(databaseServiceMock)
      .overrideProvider(clientTokens.centrifugeClientFactory)
      .useValue(centrifugeClient)
      .compile();

    databaseServiceMock.invoices.create.mockClear();
    centrifugeClient.documents.get.mockClear();
  });

  describe('when it receives success invoice creation', function() {
    it('should fetch it from the node and persist it in the database', async function() {
      const webhooksController = webhooksModule.get<WebhooksController>(
        WebhooksController,
      );

      const result = await webhooksController.receiveMessage({
        event_type: eventTypes.success,
        document_type: documentTypes.invoice,
        document_id: documentId,
      });

      expect(result).toEqual('OK');
      expect(centrifugeClient.documents.get).toHaveBeenCalledWith(
        documentId,
        config.centrifugeId,
      );
      expect(databaseServiceMock.invoices.create).toHaveBeenCalledWith(
        getResponse,
      );
    });
  });

  describe('when it receives success purchase order creation', function() {
    it('should fetch it from the node and persist it in the database', async function() {
      const webhooksController = webhooksModule.get<WebhooksController>(
        WebhooksController,
      );

      const result = await webhooksController.receiveMessage({
        event_type: eventTypes.success,
        document_type: documentTypes.purchaseOrder,
        document_id: documentId,
      });

      expect(result).toEqual('OK');
      expect(centrifugeClient.documents.get_3).toHaveBeenCalledWith(
        documentId,
        config.centrifugeId,
      );
      expect(databaseServiceMock.purchaseOrders.create).toHaveBeenCalledWith(
        getResponse,
      );
    });
  });

  describe('when it receives invalid message', function() {
    it('should do nothing', async function() {
      const webhooksController = webhooksModule.get<WebhooksController>(
        WebhooksController,
      );

      const result = await webhooksController.receiveMessage({});
      expect(result).toBe('OK');
      expect(centrifugeClient.documents.get).not.toHaveBeenCalled();
      expect(databaseServiceMock.invoices.create).not.toHaveBeenCalled();
    });
  });
});
