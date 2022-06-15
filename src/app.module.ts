import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './auth/guard/auth.jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import generalConfig from './lib/config/general.config';

// Load modules + env secrets
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [generalConfig]
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    UserModule,
    AuthModule,
    FilesModule,
    UserModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS, 
          },
        },
        template: {
          dir: __dirname + '/auth/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }],
})
export class AppModule {}
