import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { FundingModule } from './funding/funding.module';
import { AllExceptionFilter } from './exceptions/all-exception.filter';
import { SchemasModule } from './schemas/schemas.module';
import { DocumentsModule } from './documents/documents.module';
import { NftsModule } from './nfts/nfts.module';
import { OrganizationsModule } from './oraganizations/organizations.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from './config';
console.log(process.cwd() + '/email-templates/')
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  imports: [
    AuthModule,
    ContactsModule,
    FundingModule,
    UsersModule,
    WebhooksModule,
    SchemasModule,
    DocumentsModule,
    NftsModule,
    OrganizationsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      },
      defaults: {
        from:'"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: process.cwd() + '/email-templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    })
  ],
})

export class AppModule {}
