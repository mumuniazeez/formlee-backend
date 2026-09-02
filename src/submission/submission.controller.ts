import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionResponseDto } from './dto';
import { JwtGuard } from '../auth/guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { type Request } from 'express';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiBody({ type: class Body {} })
  @Post('/f/:formSlug')
  create(
    @Body() createSubmissionDto: JSON,
    @Param('formSlug') formSlug: string,
    @Req() req: Request,
  ) {
    return this.submissionService.create(createSubmissionDto, formSlug, req);
  }

  @ApiOperation({
    summary: 'Find all submissions',
    description: 'Find all submissions under a form',
  })
  @ApiResponse({ type: [SubmissionResponseDto], status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/f/:formIdOrSlug')
  findAll(
    @Param('formIdOrSlug') formIdOrSlug: string,
    @GetUser('id') userId: string,
  ) {
    return this.submissionService.findAll(formIdOrSlug, userId);
  }

  @ApiOperation({
    summary: 'Find a submission',
    description: 'Find a submission by id',
  })
  @ApiResponse({ type: [SubmissionResponseDto], status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.submissionService.findOne(id, userId);
  }

  @ApiOperation({
    summary: 'Delete a submission',
    description: 'Delete a submission by id',
  })
  @ApiResponse({ type: [SubmissionResponseDto], status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.submissionService.remove(id, userId);
  }
}
