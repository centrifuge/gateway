import {
  CoreapiCreateDocumentRequest,
  CoreapiDocumentResponse,
  TransferdetailsData
} from "../../../clients/centrifuge-node";
import {FundingAgreementResponse} from "../interfaces";

export interface FlexDocument extends CoreapiCreateDocumentRequest {
  _id?: string;
  schema_id?: string;
}

export interface FlexDocResponse extends CoreapiDocumentResponse {
  ownerId?: string;
  _id?: string;
  createdAt?: Date,
  updatedAt?: Date
  fundingAgreement?: FundingAgreementResponse | null
  transferDetails?: Array<TransferdetailsData> | null
}