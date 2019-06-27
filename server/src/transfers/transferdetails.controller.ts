import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { EthService } from "../eth/eth.service";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";
import { UserapiCreateTransferDetailRequest, UserapiTransferDetailResponse } from "../../../clients/centrifuge-node";
import { SessionGuard } from "../auth/SessionGuard";
import { TransferDetailsRequest } from "../../../src/common/models/transfer-details";

@Controller()
@UseGuards(SessionGuard)
export class TransferDetailsController {
  constructor(
      private readonly databaseService: DatabaseService,
      readonly centrifugeService: CentrifugeService,
      readonly ethService: EthService,
  ) {
  }

  @Post()
  /**
   * Creates a transfer detail from a TransactionObject returned from a transaction hash
   * @async
   * @return <TransactionDetailResponse>} result
   */
  async createFromTransactionHash(@Body() transferDetailsRequest: TransferDetailsRequest, @Request() req) {
    const details: UserapiCreateTransferDetailRequest = {
      data: {
        transfer_id: transferDetailsRequest.transfer_id,
        sender_id: transferDetailsRequest.sender_id,
        recipient_id: transferDetailsRequest.recipient_id,
        amount: transferDetailsRequest.amount,
        currency: transferDetailsRequest.currency,
        scheduled_date: transferDetailsRequest.scheduled_date,
        settlement_date: transferDetailsRequest.settlement_date,
        settlement_reference: transferDetailsRequest.settlement_reference,
        transfer_type: transferDetailsRequest.transfer_type,
        status: transferDetailsRequest.status,
      }
    }
    const transferDetailsResponse: UserapiTransferDetailResponse = await this.centrifugeService.transfer.createTransferDetail(
        req.user.account,
        details,
        req.document_id,
    )

    await this.centrifugeService.pullForJobComplete(transferDetailsResponse.header.job_id, req.user.account);
    const invoiceWithTransferDetails = await this.centrifugeService.invoices.get(req.document_id, req.user.account);
    // We need to delete the attributes prop
    delete invoiceWithTransferDetails.attributes;
    // Update the document in the database
    await this.databaseService.invoices.update(
        { 'header.document_id': req.document_id, 'ownerId': req.user._id },
        {
          ...invoiceWithTransferDetails,
          ownerId: req.user._id,
          transferDetail: transferDetailsResponse.data,
        },
    );
    return transferDetailsResponse;
  }
}