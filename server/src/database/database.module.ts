import { Module } from '@nestjs/common';
import { databaseConnectionFactory,databaseConnection } from './database.providers';

@Module({
  providers: [databaseConnectionFactory, databaseConnection],
  exports: [databaseConnectionFactory, databaseConnection],
})
export class DatabaseModule {}
