import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { databaseConnectionFactory } from '../database/database.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersProviderFactory } from './users.providers';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    databaseConnectionFactory,
    UsersProviderFactory,
  ],
  imports: [DatabaseModule],
  exports: [UsersService],
})
export class UsersModule {}
