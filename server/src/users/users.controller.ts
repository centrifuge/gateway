import {
  Body,
  Controller,
  Get,
  HttpCode,
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

@Controller(ROUTES.USERS.base)
export class UsersController {
  constructor(
    @Inject(databaseTokens.databaseConnectionFactory)
    private readonly database: DatabaseProvider,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: User) {
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
    const dbUser: User = await this.database.users.findOne({
      username: user.username,
    });

    if (config.inviteOnly) {
      if (dbUser) {
        if (dbUser.invited && !dbUser.enabled) {
          return this.upsertUser(dbUser, true);
        } else {
          throw new Error('Username taken!');
        }
      } else {
        throw new Error('You need an invitation in order to register user!');
      }
    } else {
      if (dbUser) {
        throw new Error('Username taken!');
      }

      return this.upsertUser(user);
    }
  }

  @Post('invite')
  async inviteUser(@Body() user: { username: string }) {
    if (!config.inviteOnly) {
      throw new Error('Invite functionality not enabled!');
    }

    await this.database.users.create({
      username: user.username,
      password: undefined,
      enabled: false,
      invited: true,
      permissions: [],
    });

    return 'OK';
  }

  private async upsertUser(user: User, update?: boolean) {
    let id;

    const userToUpsert: User = {
      username: user.username,
      password: await promisify(bcrypt.hash)(user.password, 10),
      enabled: true,
      invited: config.inviteOnly,
      permissions: [],
    };

    // TODO: create an account for the user

    if (update) {
      const result = await this.database.users.updateById(
        user._id,
        userToUpsert,
      );
      id = result._id;
    } else {
      const result = await this.database.users.create(userToUpsert);
      id = result._id;
    }

    return { id };
  }
}
