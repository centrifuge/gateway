import { Module } from "@nestjs/common";
import { EthService } from "../eth/eth.service";
import { TransferDetailsController } from "./transferdetails.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { CentrifugeModule } from "../centrifuge-client/centrifuge.module";

@Module({
  controllers: [TransferDetailsController],
  imports: [DatabaseModule, AuthModule, CentrifugeModule],
  providers: [EthService],
})
export class TransferModule {}