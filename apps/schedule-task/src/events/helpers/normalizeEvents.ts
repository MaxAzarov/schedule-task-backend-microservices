import { BaseEvent } from '@app/common';
import { Event } from '@app/common/entities';

export function normalizeCustomEvents(events: Event[]): BaseEvent[] {
  return events.map((event) => {
    return {
      title: event.title,
      // eslint-disable-next-line @typescript-eslint/ban-types
      resource: { id: event.id, ...(event.resource as Object) },
      allDay: false,
      start: event.start ? new Date(event.start) : new Date(),
      end: event.end ? new Date(event.end) : new Date(),
    };
  });
}
