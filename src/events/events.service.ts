import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly entityManager: EntityManager) {}

  create(createEventDto: CreateEventDto) {
    const eventRepository = this.entityManager.getRepository(Event);

    return eventRepository.save(eventRepository.create(createEventDto));
  }

  findMany(fields: Partial<Pick<Event, 'userId'>>) {
    const eventRepository = this.entityManager.getRepository(Event);

    return eventRepository.find({ where: fields });
  }

  findOne(fields: Partial<Pick<Event, 'id'>>) {
    const eventRepository = this.entityManager.getRepository(Event);

    return eventRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateCategoryDto: UpdateEventDto) {
    const eventRepository = this.entityManager.getRepository(Event);

    return eventRepository.save(
      eventRepository.create({
        id,
        ...updateCategoryDto,
      }),
    );
  }

  delete(id: number) {
    const eventRepository = this.entityManager.getRepository(Event);

    return eventRepository.delete(id);
  }
}
