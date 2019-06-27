export interface ITransferDetailRequest {
  amount?: string;
  currency?: string;
  data?: string;
  recipient_id?: string;
  scheduled_date?: string;
  sender_id?: string;
  settlement_date?: string;
  settlement_reference?: string;
  status?: string;
  transfer_id?: string;
  transfer_type?: string;
}


export class TransferDetailRequest implements ITransferDetailRequest {
  public amount: string;
  public currency: string;
  public sender_id?: string;
  public recipient_id?: string;
  public scheduled_date: string;
  public settlement_date: string;
  public settlement_reference;
  public status?:string;
  public transfer_id?: string = '';
  public transfer_type?: string;
  public data?: string;
}