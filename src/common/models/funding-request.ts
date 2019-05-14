export interface IFundingRequest {
  funder: string,
  wallet_address: string,
  funding_id: string,
  amount: string,
  apr: string,
  fee: string,
  repayment_due_date: string,
  repayment_amount: string,
  currency: string
}


export class FundingRequest implements IFundingRequest {
  public funder: string = '';
  public wallet_address: string = '';
  public funding_id: string = '';
  public amount: string = '';
  public apr: string = '';
  public fee: string = '';
  public repayment_due_date: string = '';
  public repayment_amount: string = '';
  public currency: string = '';
}
