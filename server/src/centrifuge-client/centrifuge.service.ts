import {
  AccountServiceApi,
  DocumentsApi,
  FundingServiceApi,
  InvoiceServiceApi,
  JobsApi,
  JobsStatusResponse,
  NFTApi,
  NFTServiceApi,
  PurchaseOrderServiceApi,
  TransferDetailApi,
} from '../../../clients/centrifuge-node';
import config from '../../../src/common/config';
import { promisify } from 'util';

const delay = promisify(setTimeout);

export class CentrifugeService {
  public documents: DocumentsApi;
  public accounts: AccountServiceApi;
  public invoices: InvoiceServiceApi;
  public purchaseOrders: PurchaseOrderServiceApi;
  public funding: FundingServiceApi;
  public nft: NFTApi;
  public invoiceUnpaid: NFTServiceApi;
  public job: JobsApi;
  public transfer: TransferDetailApi;

  constructor() {

    this.documents = new DocumentsApi({}, config.centrifugeUrl);
    this.accounts = new AccountServiceApi({}, config.centrifugeUrl);
    this.invoices = new InvoiceServiceApi({}, config.centrifugeUrl);
    this.purchaseOrders = new PurchaseOrderServiceApi({}, config.centrifugeUrl);
    this.funding = new FundingServiceApi({}, config.centrifugeUrl);
    this.nft = new NFTApi({}, config.centrifugeUrl);
    this.invoiceUnpaid = new NFTServiceApi({}, config.centrifugeUrl);
    this.job = new JobsApi({}, config.centrifugeUrl);
    this.transfer = new TransferDetailApi({}, config.centrifugeUrl);
  }

  pullForJobComplete(jobId: string, authorization: string): Promise<JobsStatusResponse> {
    return this.job.getJobStatus(authorization, jobId).then(result => {
      if (result.status === 'pending') {
        return delay(500).then(() => this.pullForJobComplete(jobId, authorization));
      } else {
        return result;
      }
    });
  }
}

export class MockCentrifugeService {
  invoices = {
    get: jest.fn(document_id => {
      return {
        header: {
          document_id,
          nfts: [
            {
              token_id: 'token_id',
              owner: 'owner',
            },
          ],
        },
        data: {
          currency: 'USD',
        },

        attributes: {
          'funding[0].test': true,
        },
      };
    }),
  };
  funding = {
    create: jest.fn((document_id, payload, account) => {
      return new Promise((resolve, reject) => {
        const result = {
          header: {
            job_id: 'some_job_id',
          },
          ...payload,
        };
        resolve(result);
      });
    }),
    sign: jest.fn((document_id, agreement_id, payload, account) => {
      return new Promise((resolve, reject) => {
        const result = {
          header: {
            job_id: 'some_job_id',
            nfts: [
              {
                token_id: payload.nft_address,
                owner: account,
              },
            ],
          },
          data: {
            funding: {
              ...payload,
            },
            signatures: ['signature_data_1'],
          },
        };
        resolve(result);
      });
    }),
  };
  transfer = {
    createTransferDetail: jest.fn((document_id, payload) => {
      return new Promise((resolve, reject) => {
        const result = {
          header: {
            job_id: 'some_job_id',
          },
          ...payload,
        };
        resolve(result);
      });
    }),
    updateTransferDetail: jest.fn((document_id, payload) => {
      return new Promise((resolve, reject) => {
        const result = {
          header: {
            job_id: 'some_job_id',
          },
          ...payload,
        };
        resolve(result);
      });
    }),
  }
  pullForJobComplete = () => true;
}
