import {Controller, Get, Post, Req} from '@nestjs/common';
import { TransactionObject } from "web3/eth/types";
import { EthService } from "../eth/eth.service";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";

@Controller()

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
   * @return {Promise<TransactionObject>} result
   */
  async getTransaction(@Req() request) {
    return await this.ethService.getTransactionByHash(request.hash)
  }
}