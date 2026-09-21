import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPolar, Polar } from '@polar-sh/sdk/2026-04';
import { User } from '../../generated/prisma';

@Injectable()
export class PaymentService {
  polarClient: Polar;
  constructor(private readonly configService: ConfigService) {
    this.polarClient = createPolar({
      accessToken: this.configService.get<string>('POLAR_API_KEY')!,
      environment: 'sandbox',
    });
  }
  async registerCustomerOnPolar(user: User) {
    const polarCustomer = await this.polarClient.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      external_id: user.id,
      organization_id: this.configService.get('POLAR_ORG_ID'),
      type: 'individual',
    });

    return polarCustomer;
  }
}
