import { Module } from "@nestjs/common";
import { EthService } from "../eth/eth.service";
import { TransfersController } from "./transferdetails.controller";

@Module({
  controllers: [TransfersController],
  providers: [EthService],
})
export class TransferModule {}