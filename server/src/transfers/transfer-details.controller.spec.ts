import {Test, TestingModule} from "@nestjs/testing";
import {databaseServiceProvider} from "../database/database.providers";
import {DatabaseService} from "../database/database.service";
import {Invoice} from "../../../src/common/models/invoice";
import {SessionGuard} from "../auth/SessionGuard";
import {CentrifugeService} from "../centrifuge-client/centrifuge.service";
import {TransferDetailsController} from "./transfer-details.controller";

describe('Transfer controller', () => {

  const invoice: Invoice = {
    sender: '0x111',
    recipient: '0x999',
    currency: 'EUR',
    number: '1337',
    sender_company_name: 'hot hot heat',
    bill_to_company_name: 'ice cold water',
  };

  let insertedInvoice: any = {};
  let transferModule: TestingModule;

  beforeEach(async () => {
    transferModule = await Test.createTestingModule({
      controllers: [TransferDetailsController],
      providers: [
        SessionGuard,
        CentrifugeService,
        databaseServiceProvider,
      ],
    })
        // .overrideProvider(CentrifugeService)
        // .useValue(centrifugeClientMock)
        .compile();


    const databaseService = transferModule.get<DatabaseService>(DatabaseService);
    const centrifugeService = transferModule.get<CentrifugeService>(CentrifugeService)

    insertedInvoice = await databaseService.invoices.insert({
      header: {
        document_id: '0x39393939',
      },
      data: { ...invoice },
      ownerId: 'user_id',
    });
  })

  describe('create', () => {
    it('should return the created funding agreement', async () => {

      const transferRequest = {
        document_id: '0x39393939',
        sender_id: 'sender',
        recipient_id: 'agreement_id',
        amount: '100',
        currency: 'USD',
        scheduled_date: 'today',
        settlement_reference: '0x000000'
      };

      const transferController = transferModule.get<TransferDetailsController>(
          TransferDetailsController,
      );

      const result = await transferController.create(
          transferRequest,
          { user: { _id: 'user_id' } },
      );
      expect(result).toEqual({
        header: {
          job_id: 'some_job_id',
        },
        data: {
          'sender_id': 'sender',
          'recipient_id': 'agreement_id',
          'amount': '100',
          'currency': 'USD',
          'scheduled_date': 'today',
          'settlement_reference': '0x000000'
        },
      });
    });
  });
});