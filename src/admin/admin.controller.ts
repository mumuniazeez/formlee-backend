import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { AdminGuard } from './guard';
import { UserResponseDto } from '../user/dto';
import { FormResponseDto } from '../form/dto';
import { FormStatus } from '../../generated/prisma';

@ApiBearerAuth()
// don't change the order of the guards, do only if you  are sure of what you're doing
@UseGuards(AdminGuard)
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get a list of all the user registered',
  })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @Get('/users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Get all forms',
    description: 'Get a list of all the forms created',
  })
  @ApiResponse({ status: 200, type: [FormResponseDto] })
  @Get('/forms')
  getAllForms() {
    return this.adminService.getAllForms();
  }

  @ApiOperation({
    summary: 'Update a form status',
    description: 'Pause or archive or active a form',
  })
  @ApiResponse({ status: 200, type: FormResponseDto })
  @ApiParam({ name: 'formId', description: 'id of the form' })
  @ApiQuery({
    name: 'status',
    description: 'the status to set',
    enum: FormStatus,
  })
  @Patch('/forms/:formId/status')
  changeFormStatus(
    @Param('formId') formId: string,
    @Query('status') status: FormStatus,
  ) {
    return this.adminService.changeFormStatus(formId, status);
  }
}
