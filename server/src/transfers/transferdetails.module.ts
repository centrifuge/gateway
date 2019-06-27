import { Module } from "@nestjs/common";
import { EthService } from "../eth/eth.service";
import { TransferDetailsController } from "./transferdetails.controller";

@Module({
  controllers: [TransferDetailsController],
  providers: [EthService],
})
export class TransferModule {}