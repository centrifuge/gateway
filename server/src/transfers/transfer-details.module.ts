import { Module } from "@nestjs/common";
import { EthService } from "../eth/eth.service";
import { TransferDetailsController } from "./transfer-details.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { CentrifugeModule } from "../centrifuge-client/centrifuge.module";

@Module({
  controllers: [TransferDetailsController],
  imports: [DatabaseModule, AuthModule, CentrifugeModule],
  // TODO: EthService should be provided by an EthModule imported above
  providers: [EthService],
})
export class TransferModule {}