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
import { EventType, JwtAuthGuard } from '@app/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { IntegrationsService } from './integrations.service';
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

  @Get('/:type')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  find(@Request() request: IRequest, @Param('type') type?: EventType) {
    return this.integrationsService.findOne({
      type,
      userId: (request as any).user.id,
    });
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

  @Get('/trello/boards')
  @UseGuards(JwtAuthGuard)
  getTrelloBoards(@Request() request: IRequest) {
    return this.integrationsService.getTrelloBoards((request as any).user.id);
  }

  @Get('/trello/user/cards')
  @UseGuards(JwtAuthGuard)
  getUserCards(@Request() request: IRequest) {
    return this.integrationsService.getTrelloUserCards(
      (request as any).user.id,
    );
  }

  @Get('/trello/board/list')
  @UseGuards(JwtAuthGuard)
  getTrelloBoardList(@Request() request: IRequest) {
    return this.integrationsService.getTrelloBoardList(
      (request as any).user.id,
    );
  }

  // jira
  @Get('/jira/boards')
  @UseGuards(JwtAuthGuard)
  getJiraBoardList(@Request() request: IRequest) {
    return this.integrationsService.getJiraBoards((request as any).user.id);
  }

  @Get('/jira/project/statuses')
  @UseGuards(JwtAuthGuard)
  getJiraProjectStatuses(@Request() request: IRequest) {
    return this.integrationsService.getJiraProjectStatuses(
      (request as any).user.id,
    );
  }
}
