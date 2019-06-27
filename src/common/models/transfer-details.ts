import {TransferdetailsTransferDetailData} from "../../../clients/centrifuge-node";

export class TransferDetailsRequest implements TransferdetailsTransferDetailData {
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