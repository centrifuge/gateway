import { Document } from './models/document';
import { FundingAgreementResponse } from './interfaces';

export enum FUNDING_STATUS {
  NO_STATUS = '',
  PENDING = 'Requested',
  ACCEPTED = 'Accepted',
  SETTLED = 'Settled',
  REPAID = 'Repaid',
  UNKNOWN = 'Unknown',
  REPAYING_FUNDING = 'Repaying',
  SENDING_FUNDING = 'Funding',
  FUNDED = 'Funded',

}


export enum TRANSFER_DETAILS_STATUS {
  OPENED = 'opened',
  SETTLED = 'settled',
}

export const getFundingStatus = (fundingAgreement) => {
   if (
     fundingAgreement.signatures &&
     Array.isArray(fundingAgreement.signatures) &&
     fundingAgreement.signatures.find( signature => {
       console.log(signature)
       return signature.value.toLowerCase() === fundingAgreement.funder_id.value.toLowerCase();
     })
  ) {
    return FUNDING_STATUS.ACCEPTED;
  } else {
    return FUNDING_STATUS.PENDING;
  }


};

