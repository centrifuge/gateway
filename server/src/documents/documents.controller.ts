import { Controller } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";

@Controller()
export class DocumentsController {
  constructor(
      private readonly databaseService: DatabaseService,
      private readonly centrifugeService: CentrifugeService,
  ) {
  }

}