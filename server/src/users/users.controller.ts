import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { promisify } from 'util';
import {PERMISSIONS, ROUTES} from '../../../src/common/constants';
import { User } from '../../../src/common/models/user';
import { DatabaseService } from '../database/database.service';
import config from '../config';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';
import {UserAuthGuard} from "../auth/admin.auth.guard";

@Controller(ROUTES.USERS.base)
export class UsersController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly centrifugeService: CentrifugeService,
  ) {
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: User, @Request() req): Promise<User> {
    return req.user;
  }

  @Get('logout')
  async logout(@Request() req, @Response() res) {
    req.logout();
    return res.redirect('/');
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getAllUsers(@Request() request) {
    return await this.databaseService.users.find({});
  }

  @Post('register')
  @UseGuards(UserAuthGuard)
  async register(@Body() user: User) {

    const existingUser: User = await this.databaseService.users.findOne({
      username: user.username,
    });

    if (!user.password || !user.password.trim()) {
      throw new HttpException('Password is mandatory', HttpStatus.FORBIDDEN);
    }

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
        invited: true,
      });
    }
  }

  @Post('invite')
  @UseGuards(UserAuthGuard)
  async invite(@Body() user: { username: string, email: string, permissions: PERMISSIONS[] }) {
    if (!config.inviteOnly) {
      throw new HttpException('Invite functionality not enabled!', HttpStatus.FORBIDDEN);
    }
    const userExists = await this.databaseService.users.findOne({
      username: user.username,
    });

    if (userExists) {
      throw new HttpException('User already invited!', HttpStatus.FORBIDDEN);
    }

    return this.upsertUser({
      ...user,
      username: user.username,
      email: user.email,
      date_added: new Date(),
      password: undefined,
      enabled: false,
      invited: true,
      permissions: user.permissions,
    });
  }

  private async upsertUser(user: User, id: string = '') {


    // Create centrifuge identity in case user does not have one
    if (!user.account) {
      const account = await this.centrifugeService.accounts.generateAccount(
        config.admin.account,
      );
      user.account = account.identity_id;
    }

    // Hash Password, and invited one should not have a password
    if (user.password) {
      user.password = await promisify(bcrypt.hash)(user.password, 10);
    }
    const result: User = await this.databaseService.users.updateById(id, user, true);
    // TODO return "public" User here not just the id
    return result._id;
  }
}
