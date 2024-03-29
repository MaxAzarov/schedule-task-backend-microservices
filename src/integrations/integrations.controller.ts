import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { EventType } from './types';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { MarkEventAsDoneDto } from './dto/mark-event-as-done';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request: IRequest,
    @Body() createIntegrationDto: CreateIntegrationDto,
  ) {
    createIntegrationDto.userId = (request as any).user.id;
    return this.integrationsService.create(createIntegrationDto);
  }

  @Get('/events')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  userEvents(@Request() request: IRequest) {
    return this.integrationsService.getUsersTasks((request as any).user.id);
  }

  @Put('/event/:eventId/done')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  markAsDone(
    @Request() request: IRequest,
    @Body() dto: MarkEventAsDoneDto,
    @Param('eventId') eventId: string,
  ) {
    return this.integrationsService.markEventAsDone(
      (request as any).user.id,
      dto.type,
      eventId,
    );
  }

  @Get('/:type')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  find(@Request() request: IRequest, @Param('type') type?: EventType) {
    return this.integrationsService.findOne({
      type,
      userId: (request as any).user.id,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: number) {
    return this.integrationsService.delete(id);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateIntegrationDto) {
    return this.integrationsService.update(id, dto);
  }
}
