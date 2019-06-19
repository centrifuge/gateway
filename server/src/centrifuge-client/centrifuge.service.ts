import {
  AccountsApi,
  DocumentsApi,
  FundingServiceApi,
  InvoiceServiceApi,
  JobsApi,
  JobsStatusResponse,
  NFTApi,
  NFTServiceApi,
  PurchaseOrderServiceApi,
} from '../../../clients/centrifuge-node';
import config from '../../../src/common/config';
import { promisify } from 'util';

const delay = promisify(setTimeout);

export class CentrifugeService {
  public documents: DocumentsApi;
  public accounts: AccountsApi;
  public invoices: InvoiceServiceApi;
  public purchaseOrders: PurchaseOrderServiceApi;
  public funding: FundingServiceApi;
  public nft: NFTApi;
  public invoiceUnpaid: NFTServiceApi;
  public job: JobsApi;

  constructor() {

    this.documents = new DocumentsApi({}, config.centrifugeUrl);
    this.accounts = new AccountsApi({}, config.centrifugeUrl);
    this.invoices = new InvoiceServiceApi({}, config.centrifugeUrl);
    this.purchaseOrders = new PurchaseOrderServiceApi({}, config.centrifugeUrl);
    this.funding = new FundingServiceApi({}, config.centrifugeUrl);
    this.nft = new NFTApi({}, config.centrifugeUrl);
    this.invoiceUnpaid = new NFTServiceApi({}, config.centrifugeUrl);
    this.job = new JobsApi({}, config.centrifugeUrl);
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
