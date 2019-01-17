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
import { ROUTES } from '../../../src/common/constants';
import { User } from '../../../src/common/models/dto/user';
import { SessionGuard } from '../auth/SessionGuard';
import { tokens as databaseTokens } from '../database/database.constants';
import { DatabaseProvider } from '../database/database.providers';

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

  @Post()
  async register(@Body() user: User) {
    const dbUser = await this.database.users.findOne({
      username: user.username,
    });
    if (dbUser) {
      throw new Error('Username taken!');
    }

    return this.database.users.create(user);
  }
}
