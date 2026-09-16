import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import 'dotenv/config';
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
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    // Nestjs builtin modules
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 120, blockDuration: 120000 }],
      errorMessage: 'Too many request from your device, try again later',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
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
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
