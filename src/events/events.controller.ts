import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventDto: CreateEventDto, @Request() request: IRequest) {
    const userId = (request as any).user.id;
    createEventDto.userId = userId;

    return this.eventsService.create(createEventDto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  findMany(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.eventsService.findMany(userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne({ id: +id });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }
}
