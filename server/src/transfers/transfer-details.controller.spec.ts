import {User} from "../../../src/common/models/user";
import {AuthService} from "../auth/auth.service";
import {Test, TestingModule} from "@nestjs/testing";
import {databaseServiceProvider} from "../database/database.providers";
import {DatabaseService} from "../database/database.service";
import {Invoice} from "../../../src/common/models/invoice";
import {FundingController} from "../funding/funding.controller";
import {SessionGuard} from "../auth/SessionGuard";
import {CentrifugeService} from "../centrifuge-client/centrifuge.service";

describe('Transfer controller', () => {

  const invoice: Invoice = {
    sender: '0x111',
    recipient: '0x112',
    currency: 'USD',
    number: '999',
    sender_company_name: 'cinderella',
    bill_to_company_name: 'step mother',
  };

  let insertedInvoice: any = {};
  let fundingModule: TestingModule;

  beforeEach(async () => {
    fundingModule = await Test.createTestingModule({
      controllers: [FundingController],
      providers: [
        SessionGuard,
        CentrifugeService,
        databaseServiceProvider,
      ],
    })
        // .overrideProvider(CentrifugeService)
        // .useValue(centrifugeClientMock)
        .compile();


    const databaseService = fundingModule.get<DatabaseService>(DatabaseService);
    const centrifugeService = fundingModule.get<CentrifugeService>(CentrifugeService)

    insertedInvoice = await databaseService.invoices.insert({
      header: {
        document_id: '0x39393939',
      },
      data: { ...invoice },
      ownerId: 'user_id',
    });

  })
}