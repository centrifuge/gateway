import { Controller, Get, Req } from '@nestjs/common';
import { EthService } from "./eth.service";
import { TransactionObject } from "web3/eth/types";

@Controller('eth')

export class EthController {
  constructor(private readonly ethService: EthService) {}

  @Get()
  /**
   * Gets a transaction object from a hash
   * @async
   * @return {Promise<TransactionObject>} result
   */
  async getTransaction(@Req() request) {
    return await this.ethService.getTransactionByHash(request.hash)
  }
}