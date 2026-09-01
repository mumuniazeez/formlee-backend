import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    // Nestjs builtin modules
    ConfigModule.forRoot({ isGlobal: true }),

    // Service modules
    PrismaModule,

    // Routes modules
    HealthModule,
    AuthModule,
    UserModule,
    FormModule,
    SubmissionModule,
    MailerModule,
  ],
})
export class AppModule {}
