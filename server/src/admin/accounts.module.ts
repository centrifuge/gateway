import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CentrifugeModule } from '../centrifuge-client/centrifuge.module';


@Module({
  controllers: [AccountsController],
  imports: [DatabaseModule, AuthModule, CentrifugeModule],
})
export class AccountsModule {}
