import {Module} from "@nestjs/common";
import {EthController} from "../eth/eth.controller";
import {EthService} from "../eth/eth.service";

@Module({
  controllers: [EthController],
  providers: [EthService],
})
export class TransferModule {}