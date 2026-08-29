import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto, FormResponseDto, UpdateFormDto } from './dto/';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { $Enums, type User } from '../../generated/prisma';
import { GeneralOkResponseDto } from '../dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @ApiOperation({
    summary: 'Create a new form',
    description: 'Create a new form',
  })
  @ApiResponse({ status: 201, type: FormResponseDto })
  @Post()
  create(@Body() createFormDto: CreateFormDto, @GetUser() user: User) {
    return this.formService.create(createFormDto, user.id, user.email);
  }

  @ApiOperation({
    summary: 'Find all form',
    description: 'Find all form created by the user',
  })
  @ApiResponse({ status: 200, type: [FormResponseDto] })
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.formService.findAll(userId);
  }

  @ApiOperation({
    summary: 'Find all form',
    description: 'Find all form created by the user by status',
  })
  @ApiResponse({ status: 200, type: [FormResponseDto] })
  @ApiParam({ name: 'status', enum: $Enums.FormStatus })
  @Get('/status/:status')
  findAllByStatus(
    @GetUser('id') userId: string,
    @Param('status') status: $Enums.FormStatus,
  ) {
    return this.formService.findAllByStatus(userId, status);
  }

  @ApiOperation({
    summary: 'Find a form',
    description: 'Find a form created by the user by id or slug',
  })
  @ApiResponse({ status: 200, type: FormResponseDto })
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') id: string, @GetUser('id') userId: string) {
    return this.formService.findOne(id, userId);
  }

  @ApiOperation({
    summary: 'Update a form',
    description:
      'Update a form created by the user by id or slug, you can also use this endpoint to update the status of a form',
  })
  @ApiResponse({ status: 200, type: FormResponseDto })
  @Patch(':idOrSlug')
  update(
    @Param('idOrSlug') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @GetUser('id') userId: string,
  ) {
    return this.formService.update(id, updateFormDto, userId);
  }

  @ApiOperation({
    summary: 'Delete a form',
    description: 'Delete a form created by the user by id or slug',
  })
  @ApiResponse({ status: 200, type: GeneralOkResponseDto })
  @Delete(':idOrSlug')
  remove(@Param('idOrSlug') id: string, @GetUser('id') userId: string) {
    return this.formService.remove(id, userId);
  }
}
