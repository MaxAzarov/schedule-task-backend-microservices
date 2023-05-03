import { Event } from 'src/common/types';
import { Card } from '../types/Card';
import { EventType } from 'src/integrations/types';

export function normalizeTrelloEvents(events: Card[]): Event[] {
  return events.map((event) => {
    return {
      title: event.name,
      allDay: event.due === null,
      // by default it start at 8 am, so we need to set 00:00 am
      start: event.start
        ? new Date(new Date(event.start).setHours(0, 0, 0, 0))
        : new Date(),
      end: event.due ? new Date(event.due) : new Date(),
      resource: { ...event, type: EventType.trello },
    };
  });
}
