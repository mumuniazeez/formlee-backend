import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';
import { MailerModule } from './mailer/mailer.module';
import { StatsModule } from './stats/stats.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Nestjs builtin modules
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 120, blockDuration: 120000 }],
      errorMessage: 'Too many request from your device, try again later',
    }),

    // Service modules
    PrismaModule,
    MailerModule,

    // Routes modules
    HealthModule,
    AuthModule,
    UserModule,
    StatsModule,
    FormModule,
    SubmissionModule,
    PaymentModule,
    NotificationModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
