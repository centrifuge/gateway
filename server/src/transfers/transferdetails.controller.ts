import {Body, Controller, Get, Post, Req, Request, UseGuards} from '@nestjs/common';
import { TransactionObject } from "web3/eth/types";
import { EthService } from "../eth/eth.service";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";
import {UserapiCreateTransferDetailRequest, UserapiTransferDetailResponse} from "../../../clients/centrifuge-node";
import {SessionGuard} from "../auth/SessionGuard";
import {PurchaseOrder} from "../../../src/common/models/purchase-order";
import {FundingRequest} from "../../../src/common/models/funding-request";
import {TransferDetailRequest} from "../../../src/common/models/transfer-details";

@Controller()
@UseGuards(SessionGuard)
export class TransfersController {
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
  async createFromTransactionHash(@Body() transferDetailRequest: TransferDetailRequest, @Request() req) {
    const transaction = await this.ethService.getTransactionByHash(transferDetailRequest.settlement_reference)
    const details: UserapiCreateTransferDetailRequest = {
      data: {
        transfer_id: transferDetailRequest.transfer_id,
        // transferDetailRequest.sender_id? in case wallet addresses are different from centID address for proper rendering
        sender_id: transaction.from,
        // transferDetailRequest.recipient_id? in case wallet addresses are different from centID address for proper rendering
        recipient_id: transaction.to,
        amount: transferDetailRequest.amount,
        currency: transferDetailRequest.currency,
        scheduled_date: transferDetailRequest.scheduled_date,
        settlement_date: transferDetailRequest.settlement_date,
        // settlement reference = transaction hash to be displayed
        settlement_reference: transferDetailRequest.settlement_reference,
        transfer_type: transferDetailRequest.transfer_type,
        
        status: transferDetailRequest.status,
      }
    }
    const response: UserapiTransferDetailResponse = await this.centrifugeService.transfer.createTransferDetail(
        req.user.account,
        details,
        req.document_identifier
    )
  }
}