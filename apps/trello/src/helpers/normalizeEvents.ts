import { BaseEvent, EventType } from '@app/common';
import { Card } from '../types/Card';

export function normalizeTrelloEvents(events: Card[]): BaseEvent[] {
  return events.map((event) => {
    return {
      title: event.name,
      allDay: event.badges.due === null,
      // by default it start at 8 am, so we need to set 00:00 am
      start: event.start
        ? new Date(new Date(event.badges.start).setHours(0, 0, 0, 0))
        : new Date(),
      end: event.due ? new Date(event.badges.due) : new Date(),
      resource: { ...event, type: EventType.Trello },
    };
  });
}
