import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { promisify } from 'util';
import { ROUTES } from '../../../src/common/constants';
import { User } from '../../../src/common/models/user';
import { SessionGuard } from '../auth/SessionGuard';
import { tokens as databaseTokens } from '../database/database.constants';
import { DatabaseProvider } from '../database/database.providers';
import config from '../config';
import { tokens as clientTokens } from '../centrifuge-client/centrifuge.constants';
import { CentrifugeClient } from '../centrifuge-client/centrifuge.interfaces';

@Controller(ROUTES.USERS.base)
export class UsersController {
  constructor(
    @Inject(databaseTokens.databaseConnectionFactory)
    private readonly database: DatabaseProvider,
    @Inject(clientTokens.centrifugeClientFactory)
    private readonly centrifugeClient: CentrifugeClient,
  ) {
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: User,@Request() req) {
    return 'OK';
  }

  @Get('logout')
  @UseGuards(new SessionGuard())
  async logout(@Request() req, @Response() res) {
    req.logout();
    return res.redirect('/');
  }

  @Post('register')
  async register(@Body() user: User) {

    const existingUser: User = await this.database.users.findOne({
      username: user.username,
    });

    if (config.inviteOnly) {
      if (existingUser && existingUser.invited && !existingUser.enabled) {
        return this.upsertUser({
            ...user,
            enabled: true,
          },
          existingUser._id,
        );
      } else {
          throw new HttpException('Username taken!', HttpStatus.FORBIDDEN);
      }
    } else {
      if (existingUser) {
        throw new HttpException('Username taken!', HttpStatus.FORBIDDEN);
      }

      return this.upsertUser({
        ...user,
        enabled: true,
        invited: false,
      });
    }
  }

  @Post('invite')
  async inviteUser(@Body() user: { username: string }) {
    if (!config.inviteOnly) {
      throw new HttpException('Invite functionality not enabled!', HttpStatus.FORBIDDEN);
    }
    const userExists = await this.database.users.findOne({
      username: user.username,
    });

    if (userExists) {
      throw new HttpException('User already invited!', HttpStatus.FORBIDDEN);
    }

    return this.upsertUser({
      username: user.username,
      password: undefined,
      enabled: false,
      invited: true,
      permissions: [],
    });
  }

    private async upsertUser(user: User, id: string = '') {

      // Create centrifuge identity in case user does not have one
      // if (!user.account) {
      //   const account = await this.centrifugeClient.accounts.generateAccount(
      //     config.admin.account,
      //   );
      //   user.account = account.identity_id;
      // }

      // Hash Password, and invited one should not have a password
      if (user.password) {
        user.password = await promisify(bcrypt.hash)(user.password, 10);
      }

      const result: User = await this.database.users.updateById(id, user,true );
      return result._id;
  }


}
