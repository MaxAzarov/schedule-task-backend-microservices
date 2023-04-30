import { Event } from 'src/common/types';
import { Card } from '../types/Card';

export function normalizeTrelloEvents(events: Card[]): Event[] {
  return events.map((event) => {
    return {
      title: event.name,
      allDay: event.due === null,
      start: new Date(),
    };
  });
}
