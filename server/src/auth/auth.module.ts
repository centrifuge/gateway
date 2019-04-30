import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AccountAuthGuard } from "./account.auth.guard";
import { CookieSerializer } from './cookie-serializer';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'local',
    }),
    DatabaseModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccountAuthGuard,
    CookieSerializer,
  ],
})
export class AuthModule {}
