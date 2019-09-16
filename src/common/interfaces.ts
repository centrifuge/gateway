import {
  FunFundingResponseData,
  InvoiceData,
  TransferdetailsData,
  UserapiInvoiceResponse,
  UserapiPurchaseOrderResponse,
} from '../../clients/centrifuge-node';



// TODO do we need InvoiceResponse and POResponse ?
export interface InvoiceResponse extends UserapiInvoiceResponse {
  data?: any | InvoiceData;
  ownerId?: string;
  _id?: string;
  createdAt?: Date,
  updatedAt?: Date
  fundingAgreement?: FundingAgreementResponse | null
  transferDetails?: Array<TransferdetailsData> | null
}

export interface FundingAgreementResponse extends FunFundingResponseData {
  nftOwner?: string
  nftRegistry?: string
}

export interface PurchaseOrderResponse
  extends UserapiPurchaseOrderResponse {
  ownerId?: string;
  _id?: string;
}
