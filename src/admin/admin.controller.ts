import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { AdminGuard } from './guard';

@ApiBearerAuth()
// don't change the order of the guards, do only if you  are sure of what you're doing
@UseGuards(AdminGuard)
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  get() {
    return 'Hello';
  }
}
