import {
  Body,
  Controller,
  Get, HttpException, HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Account } from '../../../src/common/models/account';
import { ROUTES } from '../../../src/common/constants';
import { SessionGuard } from '../auth/SessionGuard';
import {
  AccountGetAllAccountResponse,
} from '../../../clients/centrifuge-node';
import { DatabaseService } from '../database/database.service';
import config from '../config';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';
import { AccountAuthGuard } from "../auth/account.auth.guard";

@Controller(ROUTES.ACCOUNTS)
@UseGuards(SessionGuard)
@UseGuards(AccountAuthGuard)
export class AccountsController {
  constructor(
      private readonly database: DatabaseService,
      private readonly centrifugeService: CentrifugeService,
  ) {}

  @Get()
  /**
   * Get the list of all accounts
   * @async
   * @return {Promise<Account[]>} result
   */
  async get(@Req() request): Promise<AccountGetAllAccountResponse> {
   try {
     return await this.centrifugeService.accounts.getAllAccounts(
         config.admin.account,
     )
   } catch (error) {
      throw new HttpException(await error.json(), error.status);
    }
  }
}
